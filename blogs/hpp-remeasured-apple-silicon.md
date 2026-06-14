# High Performance Python, Re-Measured on Apple Silicon: 6 Results That Came Out Differently for Me

**Published:** June 13, 2026

*High Performance Python* (Gorelick & Ozsvald, 3rd ed.) is the clearest explanation I know of why Python is slow and how to make it fast, and I'd recommend it without hesitation. But a performance book is a photograph of specific hardware running a specific software stack, and photographs age. As a learning exercise I worked through every chapter as runnable, self-measuring benchmarks on a modern stack (Apple M1 Max, CPython 3.14, numpy 2.4, pandas 3.0, PyTorch 2.12), asserting a correctness anchor on each so a faster-but-wrong version fails loudly. Most of the book held up exactly as written. A handful of results came out differently for me, and a couple came out *backwards* — and those are the ones worth writing about, since where a benchmark drifts tends to be more instructive than where it holds.

To be clear up front: none of this means the book is wrong. Its *mechanisms* and *ratios* are what endure; the *absolute numbers* and a few *specific optimizations* are the parts most exposed to a changing stack. Apple Silicon runs the pure-Python baseline about twice as fast as the book's laptop, so every absolute figure here is roughly half — that part is entirely expected. The cases I found interesting are the few where a recommended optimization stopped paying, or reversed, on my particular machine. Yours will differ again, which is rather the point.

Every benchmark below is runnable in the companion repo, [`high-performance-python`](https://github.com/deepanshululla/high-performance-python); each row in the table links to the exercise folder it came from, with its script, chart, and a prose writeup.

## At a glance: what the book claimed vs. what I measured

| # | Topic | The book claimed | What I measured |
| --- | --- | --- | --- |
| 1 | [Strength reduction (drop the sqrt)](https://github.com/deepanshululla/high-performance-python/tree/main/chapter_8_compiling_to_c/ex01_julia_baseline) | Expanding `abs(z)` sped Cython 0.43s to 0.23s (≈2x); only ever shown compiled | Compiled: confirmed. Pure CPython 3.14: ≈1.9x **slower** (2.7s to 5.1s) |
| 2 | [Hand-rolled `roll_add` vs `np.roll`](https://github.com/deepanshululla/high-performance-python/tree/main/chapter_6_matrix_and_vector_computation/ex05_roll_vs_roll_add) | A specialized in-place shift was ≈7% **faster** | ≈1.2x **slower** (222 ms vs 186 ms); modern `np.roll` already wins |
| 3 | [`float16` on the CPU](https://github.com/deepanshululla/high-performance-python/tree/main/chapter_6_matrix_and_vector_computation/ex06_float_precision_cpu) | numpy: ≈6x **slower** than float64 (no native 16-bit instructions) | ≈7.6x **slower** (worse than the book); float32 ≈2x faster, confirmed |
| 4 | [GPU on sequential/branchy work](https://github.com/deepanshululla/high-performance-python/tree/main/chapter_6_matrix_and_vector_computation/ex08_when_not_gpu) | numpy beat the GPU by ≈98% (≈50x) | CPU ≈2,600x faster on MPS (diffusion still ≈10x faster on GPU) |
| 5 | [scikit-learn vs `lstsq`](https://github.com/deepanshululla/high-performance-python/tree/main/chapter_7_pandas_dask_polars/ex01_ols_sklearn_vs_lstsq) | ≈7x slower; >85% is input validation | ≈15x slower; ≈85% validation, confirmed |
| 6 | [pandas `.str` chain vs `apply`](https://github.com/deepanshululla/high-performance-python/tree/main/chapter_7_pandas_dask_polars/hypothesis/h06_cow_narrows_chain) | ≈3x slower (pre-CoW); the book credits CoW for the future shrink | ≈1.3x slower, but isolating CoW shows it is **not** the cause (general speedup) |

The sections below walk through each row: the claim, the measurement, and why they diverged.

## 1. Strength reduction reverses in the interpreter

The book replaces the Julia-set escape test `abs(z) < 2` with the algebraically identical `z.real*z.real + z.imag*z.imag < 4`, dropping a square root. Compiled, this is faster. In pure CPython 3.14 it is ≈1.9x *slower* (≈2.7 s to ≈5.1 s).

![Strength reduction is 1.9x slower in pure CPython](/blogs/images/hpp-strength-reduction-julia.png)
*The amber expanded form towers ≈1.9x over the grey `abs` baseline. The same change is a win once compiled.*

The book introduces this trick *inside Cython* (Example 8-8), where expanding `abs` dropped the runtime from 0.43s to 0.23s, a clean ≈2x gain, and it never shows the rewrite in plain CPython. That is the subtlety: the optimization is correct in the context the book applies it, and the compiled exercises ([ex02 Cython](https://github.com/deepanshululla/high-performance-python/tree/main/chapter_8_compiling_to_c/ex02_cython_pure_python), [ex03 Cython+OpenMP](https://github.com/deepanshululla/high-performance-python/tree/main/chapter_8_compiling_to_c/ex03_cython_numpy_openmp)) confirm it once compiled. The error is only in carrying it back to the interpreter. `abs(z)` is one call into an optimized C builtin; the expanded form is several attribute lookups, multiplies, and an add, each a separate bytecode paying interpreter dispatch and float boxing 30+ million times. The sqrt you saved was never the bottleneck; the dispatch you added was. A change that helps the compiler hurts the interpreter. (Full deep-dive: *Strength Reduction Is a Trap in the Interpreter*.)

## 2. The hand-rolled np.roll replacement now loses

The diffusion laplacian calls `np.roll` four times, each allocating a temporary array. The book writes a specialized `roll_add` helper that shifts-and-accumulates in place with no temporaries and reports a ≈7% speed-up. On modern numpy, the specialization *loses*:

| version | time |
| --- | ---: |
| `np.roll` laplacian (allocates 4 temporaries/iter) | 186 ms |
| custom `roll_add` (in-place, no temporaries) | 222 ms |

![Hand-rolled roll_add is ≈1.2x slower than np.roll](/blogs/images/hpp-roll-vs-rolladd.png)
*The orange custom bar is the taller one. The "optimization" is a regression.*

Modern `np.roll` is already heavily optimized C, and `roll_add` adds four slice-assignments per call, each crossing back into the interpreter. Here those extra Python-level statements cost more than the temporaries they were meant to avoid. "Fewer allocations must be faster" is a sound *mechanism* that simply does not pay on this numpy version, and you give up readable code to find that out. The book's own discipline catches it: benchmark, never assume.

## 3. float16 is a penalty on the CPU and a win on the GPU

It is tempting to assume narrower floats are always faster. Running `a*a + a` over a large array at three precisions on the CPU:

| dtype | time | vs float64 |
| --- | ---: | --- |
| `float64` | 2.40 ms | 1x |
| `float32` | 1.22 ms | ≈2x faster |
| `float16` | 18.3 ms | ≈7.6x slower |

![float16 towers over even float64 on the CPU](/blogs/images/hpp-float-precision-cpu.png)
*float32 is the shortest bar, as intuition predicts; float16 is by far the tallest.*

The book measured this on an AMD Ryzen 7 1700 and reported `float16` coming out ≈6x *slower* than `float64` in numpy, for exactly this reason. On the M1 Max the penalty is even steeper, ≈7.6x. `float32` behaves as expected on both (half the bytes, native instructions, ≈2x faster). But neither CPU has native 16-bit float arithmetic, so numpy converts every element up to a supported width, computes, and converts back, and that per-element conversion costs far more than the bytes it saves. Now the twist the book also shows: on the GPU the same `float16` is *faster* (≈1.7x over float32 on MPS here; the book's CUDA card got ≈4x over float64), because GPU silicon was built from the start to trade precision for throughput and has native low-precision instructions. Precision is a genuine speed knob on the GPU and a penalty on the CPU. Same dtype, opposite behavior on the two devices.

## 4. The GPU loses by 2,600x on sequential work

Porting the diffusion simulation to the MPS GPU made it ≈9.7x faster (667 ms to 69 ms). But a data-dependent walk, where each step's index is the previous step's value, ran ≈2,600x *slower* on the GPU than on one CPU core (45.5 us vs 118 ms).

![Dependent walk: GPU ≈2,600x slower, log axis](/blogs/images/hpp-gpu-branchy-walk.png)
*Same two devices as the diffusion win, inverted: the red GPU bar towers over blue CPU on a log scale.*

On its NVIDIA RTX 2080 Ti, *High Performance Python* found the GPU losing this same sequential task by ≈98% (numpy roughly 50x faster); on the M1 Max via MPS the gap blows out to ≈2,600x, because element-at-a-time tensor access forces a CPU-GPU sync on every one of the 321 steps. A dependency chain offers exactly one operation at a time, so the GPU's thousands of cores sit idle. (For scale: the book clocked the parallel diffusion at 10.5x faster on the GPU for a 512x512 grid up to 63.6x at 12,288x12,288; I measured ≈10x at 1024x1024.) Apple's unified memory also softens the book's CUDA lesson that "transfer is the #1 killer": a one-shot `.to()` is cheap here, and the damage comes from repeated per-element syncs, not a bulk copy. (Full deep-dive: *When the GPU Loses*.)

## 5. scikit-learn's overhead grew, not shrank

The book clocks `sklearn`'s `LinearRegression` at ≈7x slower than a direct `numpy.linalg.lstsq` for the same fit. On this stack the gap widened to ≈15x (≈170 us vs ≈11 us per call).

![scikit-learn ≈15x slower than lstsq, log axis](/blogs/images/hpp-sklearn-vs-lstsq.png)
*The friendly API is the expensive one; ≈85% of its time is input validation.*

Both end in the same solve; ≈85% of scikit-learn's time is in `_validate_data` and `_preprocess_data` (NaN/Inf scans, shape checks, mean-centering) that run on every call. On a tiny clean row that safety is pure overhead, and across 730 million fits it is the difference between 2 hours and 34. The mechanism is exactly as the book describes; the multiple just grew with the library. (Full deep-dive: *scikit-learn Is 15x Slower Than lstsq*.)

## 6. A narrowed pandas result, and the wrong reason for it

This last one is the most interesting, because the surprise is partly on me. The book's Chapter 7 benchmark for chained `.str` accessors versus a single `apply` reports the chain ≈3x slower. On pandas 3.0 I measured only ≈1.3x, and my first instinct, echoing the book's own forward-looking note about Copy-on-Write becoming the default, was to credit CoW: surely the chain used to pay for defensive copies of its intermediates, and CoW now elides them.

So I tried to prove it. pandas 3.0 no longer lets you turn CoW off (the `mode.copy_on_write` switch is a deprecated no-op), so I emulated the pre-CoW world by forcing an explicit deep `.copy()` on every intermediate the chain builds. If defensive copies were the story, restoring them should reopen the gap toward 3x. They did not.

| variant | time | vs `apply` |
| --- | ---: | ---: |
| `apply(find_9)` (no pandas intermediates) | ≈13.0 ms | 1.0x |
| `.str` chain (pandas 3.0 CoW, default) | ≈16.4 ms | ≈1.3x |
| `.str` chain (pre-CoW emulation, forced copies) | ≈16.6 ms | ≈1.3x |
| book's reported pre-CoW gap | -- | 3.0x |

![Forcing defensive copies back does not restore the book's 3x gap](/blogs/images/hpp-cow-str-chain.png)
*Three bars in milliseconds with the book's 3x gap as a dashed line near the top. The forced-copy bar (red) sits level with the plain CoW bar (blue), both far below the dashed line. Forcing the copies back changes nothing, so CoW was never the cause.*

Forcing the copies back added ≈0.2 ms and left the ratio at ≈1.3x. Deep-copying two short string columns over 50,000 rows is simply cheap relative to the string work, so the defensive copies I blamed were never the explanation. The honest conclusion is that the narrowing is *general* improvement, faster `.str` kernels and faster hardware between the book's pandas and pandas 3.0, not CoW. The book's CoW note is correct in general (CoW genuinely makes a shallow copy [≈1,800x cheaper than a deep one](https://github.com/deepanshululla/high-performance-python/tree/main/chapter_7_pandas_dask_polars/hypothesis/h05_cow_lazy_copy), and finally safe from the old `SettingWithCopyWarning` footgun), it just does not explain *this* number. That is the trap a re-measurement exists to catch: a correct mechanism is not automatically the cause of any particular change, and only isolating it tells the two apart.

## What ages and what doesn't

Across six surprises a pattern emerges. The things that aged are:

- **Absolute timings** (different CPU, ≈2x baseline shift).
- **Specific micro-optimizations** whose payoff depended on a library version (`roll_add`, the strength-reduction rewrite) or a library default (pandas CoW).
- **Exact multiples** that drift as libraries change (scikit-learn 7x to 15x).

The things that held are the *mechanisms*: interpreter dispatch is the dominant cost in tight Python loops; allocation is expensive; the GPU is a wide machine that needs parallel work; library safety is a per-call tax. Those are physics. The numbers around them are weather.

## Conclusion

Read *High Performance Python* for its mechanisms and its discipline, not its digits. The book's single most important instruction is also the one that lets you catch it being out of date: measure on the engine and stack you will actually ship. When I did, six conclusions came out different and two came out backwards, every one of them because a piece of the stack (the interpreter version, the numpy internals, the GPU's precision support, faster libraries and hardware) had moved since the photograph was taken. The sixth was a reminder that the discipline cuts both ways: even my own first explanation for a narrowed result did not survive isolation. The lesson is not that the book is wrong; it is that *any* performance claim, including the ones in this post, is a measurement of a moment, and the only way to know if it still holds, or why, is to run it yourself.


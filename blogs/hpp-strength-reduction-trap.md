# Strength Reduction Can Be a Trap in the Interpreter

**Published:** June 13, 2026

There is a classic optimization called strength reduction: replace an expensive operation with a cheaper one that computes the same answer. In a tight numeric loop, the textbook example is dropping a square root. *High Performance Python* (3rd ed.) applies exactly this trick to its Julia-set benchmark, swapping the escape test `abs(z) < 2` for the algebraically identical `z.real*z.real + z.imag*z.imag < 4`. The book shows it as a win — and it is, in the context the book uses it. When I tried the same rewrite in plain CPython 3.14, though, it came out almost twice as slow, which turned out to be a useful thing to understand about where to optimize Python.

*The runnable benchmark for this post lives in the companion repo: [`chapter_8_compiling_to_c/ex01_julia_baseline`](https://github.com/deepanshululla/high-performance-python/tree/main/chapter_8_compiling_to_c/ex01_julia_baseline).*

## The two forms

The Julia set colors each point of a grid by how many iterations of `z = z*z + c` it survives before `abs(z)` exceeds 2. That escape test runs in the innermost loop, more than 30 million times for the default 1000x1000 grid at 300 iterations. There are two ways to write it:

```python
# The book's original: one builtin call
while abs(z) < 2 and n < maxiter:
    z = z * z + c
    n += 1

# "Strength-reduced": drop the sqrt hidden inside abs()
while z.real * z.real + z.imag * z.imag < 4 and n < maxiter:
    z = z * z + c
    n += 1
```

`abs()` on a complex number computes `sqrt(real^2 + imag^2)`. Comparing that against 2 is the same as comparing `real^2 + imag^2` against 4 without ever taking the root. Algebraically these are identical, and both produce the book's anchor checksum exactly (`sum(output) == 33,219,980`), so they generate the same fractal. The only thing that differs is how the escape test is written.

## What it measures

One full 1000x1000 grid at `maxiter=300`, best of three rounds, on pure CPython 3.14 with no compiler involved:

| inner-loop form | time | vs `abs` |
| --- | ---: | ---: |
| `abs(z) < 2` (the book's original) | ≈2.7 s | 1.0x |
| `z.real*z.real + z.imag*z.imag < 4` (expanded) | ≈5.1 s | 1.9x slower |

![Strength reduction in pure CPython: the expanded form is 1.9x slower](/blogs/images/hpp-strength-reduction-julia.png)
*Two bars, seconds, lower is better. The grey `abs` bar is the baseline; the amber expanded bar towers ≈1.9x above it. Read it as a warning label: this is the "optimization" the book applies, shown doing harm because it is being run on the wrong engine.*

The book's laptop took 5.8 s for the `abs` form; Apple Silicon does it in ≈2.7 s. The absolute numbers are machine-dependent, but the ratio is the lesson, and the ratio is backwards from what the optimization promises.

## Why the cheaper math is slower

The mistake is reasoning about the arithmetic instead of the execution engine. In compiled code, the expanded form genuinely wins: `real*real + imag*imag` is a handful of machine instructions, while `abs()` on a complex calls into libm's `sqrt`. Drop the sqrt and you save real cycles. Cython, Numba, and Pythran all confirm this once the loop is compiled.

But CPython is an interpreter, and there the accounting flips. `abs(z)` is a *single* call into one optimized C builtin. It pays one dispatch and returns. The expanded form is a pile of separate bytecodes:

- two attribute lookups (`.real`, `.imag`),
- two multiplies,
- one add,
- one comparison,

each its own trip around the evaluation loop, each boxing and unboxing Python float objects. The interpreter pays its per-operation "dynamic typing tax" on every one of them. The sqrt you saved was never the expensive part. The dispatch you added was. Multiply that extra dispatch by 30+ million iterations and you get a 2x regression.

### The general shape of the trap

This is the sharpest possible statement of the chapter's running thesis: the same source change can be a pessimization in one execution engine and a win in another, and you cannot reason your way to which one. The cost model of compiled machine code (count the instructions, the sqrt is expensive) is not the cost model of the interpreter (count the bytecodes and the boxing, the dispatch is expensive). An optimization that is "obviously" cheaper by one model is more expensive by the other.

The corollary is practical: if you are going to compile the hot loop anyway, write the math the compiler likes. If you are staying in the interpreter, prefer the single builtin call. Either way, the only way to know is to benchmark on the engine you will actually ship.

## Conclusion

Strength reduction is a real optimization, but "fewer or cheaper math operations" only translates to "faster" when arithmetic is what the machine is spending its time on. In a CPython loop it usually is not; interpreter dispatch and object boxing dominate, so collapsing one builtin call into five bytecodes can make things worse even though the math got simpler. The same change that helps the compiler can hurt the interpreter. None of this is a knock on the book, which applies the rewrite correctly under Cython; it is just a reminder I found worth keeping: measure on the engine you'll actually run, because intuition trained on assembly can mislead you about bytecode.


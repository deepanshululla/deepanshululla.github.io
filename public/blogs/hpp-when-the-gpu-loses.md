# When the GPU Loses: 2,600x Slower on a Branchy Walk

**Published:** June 13, 2026

"Move it to the GPU" has become a reflex. For the right workload it is the correct reflex: porting a 2D diffusion simulation from numpy to PyTorch on Apple's Metal (MPS) backend made it roughly 10x faster with an almost mechanical code change. But the same hardware, on a different shape of problem, ran 2,600 times *slower* than a single CPU core. These two results are the two halves of one rule from *High Performance Python* (Gorelick & Ozsvald, 3rd ed.), and the second half is the one I find easiest to forget. This post walks through both, measured on an Apple M1 Max with CPython 3.14 and PyTorch 2.12 — your hardware will land at different numbers, but the shape should hold.

*Runnable benchmarks for this post: the GPU win is [`ex07_diffusion_mps`](https://github.com/deepanshululla/high-performance-python/tree/main/chapter_6_matrix_and_vector_computation/ex07_diffusion_mps) and the GPU loss is [`ex08_when_not_gpu`](https://github.com/deepanshululla/high-performance-python/tree/main/chapter_6_matrix_and_vector_computation/ex08_when_not_gpu) in the companion repo.*

## Half one: the GPU wins on bulk parallel math

The diffusion update sweeps a grid and replaces each cell with a blend of its neighbors. Every cell is computed independently from the others, which is the textbook definition of embarrassingly parallel work. The numpy-to-torch port is nearly a find-and-replace: swap `np` for `torch`, put the tensors on the `mps` device, and call `synchronize()` before reading the clock (MPS runs asynchronously, so without the sync you would time the dispatch, not the work).

| benchmark | CPU (numpy) | GPU (MPS) | result |
| --- | ---: | ---: | --- |
| diffusion 1024^2, 200 iters | 667 ms | 69 ms | ≈9.7x faster on GPU |

![Diffusion: numpy CPU vs torch MPS, GPU ≈10x faster](/blogs/images/hpp-gpu-diffusion-mps.png)
*Blue is numpy on the CPU, green is torch on the GPU. The green GPU bar is far shorter. This is the visual confirmation that a parallel, bulk-math workload belongs on the GPU.*

The GPU port is verified to match the numpy result to about `2e-9`, the small gap being float32-vs-float64 rounding. A GPU has thousands of individually-slow cores; when there are millions of independent cell updates available at once, those cores all stay busy and the throughput dwarfs a handful of fast CPU cores.

## Half two: the GPU loses on sequential, branchy work

Now the counter-example, taken from the book's Example 6-25. The task is a dependent walk: start at an index, read the value there, use it as the next index, and repeat. Step *k+1* cannot begin until step *k* finishes, because step *k* produces the address that step *k+1* reads. There is nothing to parallelize; at every instant there is exactly one operation available to do.

| device | time per run | result |
| --- | ---: | --- |
| numpy (CPU) | 45.5 us | -- |
| torch (MPS GPU) | 118 ms | CPU ≈2,600x faster |

![Dependent walk on a log axis: GPU ≈2,600x slower than CPU](/blogs/images/hpp-gpu-branchy-walk.png)
*Two bars on a logarithmic y-axis: blue for numpy (CPU), red for torch (GPU). The red GPU bar is so much taller that a log scale is needed to fit both. This is the visual opposite of the diffusion chart: same two devices, GPU now towering over CPU.*

The GPU is over two thousand times slower. With only one operation available at a time, the GPU's thousands of cores sit idle while one slow core does everything, and single-core speed is exactly where the CPU dominates. It gets worse: reading one element at a time off a GPU tensor (`A[i]`) forces a tiny CPU-GPU synchronization on *every* step, so the 321-step loop pays that round-trip penalty hundreds of times.

### The unified-memory footnote

The book's CUDA chapters hammer one lesson: data transfer between host and device is the number one killer. On Apple Silicon that lesson only partly applies. Apple's unified memory makes a one-shot `.to(device)` cheap, so a single big copy is not where the time goes. The damage in the branchy walk comes from the repeated per-element syncs inside the hot loop, not from a bulk transfer. The hardware moved the cost around; it did not remove it.

## The rule

Put the two charts side by side and the rule writes itself:

- **Parallel bulk math** (every output independent, the same operation over a huge array): the GPU's many-core design is exactly the right tool. Expect a large win.
- **Sequential or data-dependent work** (each step needs the previous step's result, branchy control flow, element-at-a-time access): the GPU's cores cannot be filled, single-core speed rules, and per-element device access adds sync overhead on top. The CPU wins, often by orders of magnitude.

The question is never "is the GPU faster?" It is "does this workload have enough independent work to fill the GPU's cores at once?" The diffusion grid does. The dependent walk does not, and no amount of hardware fixes a dependency chain.

## Conclusion

The GPU is not a faster computer; it is a wider one. Width helps only when you have enough independent work to spread across it. The same M1 Max that ran a diffusion simulation ≈10x faster than the CPU ran a sequential walk ≈2,600x slower, because the walk offers exactly one thing to do at a time and pays a sync tax for each one. Before you port a hot loop to the GPU, ask whether its work is parallel or sequential. If you cannot answer, benchmark both, because the wrong choice here is not a few percent, it is three orders of magnitude.


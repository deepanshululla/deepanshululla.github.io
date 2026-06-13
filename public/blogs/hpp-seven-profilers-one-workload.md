# One Workload, Seven Profilers: cProfile, line_profiler, py-spy, scalene, memray, viztracer

**Published:** June 13, 2026

The first rule of optimization is measure, do not guess, and *High Performance Python* (3rd ed.) devotes its whole second chapter to the tools that let you measure. The trouble is that there are a lot of them, they overlap, and each one answers a slightly different question. So I pointed seven of them at a single workload, the CPU-bound Julia-set fractal, and lined up what each one tells you that the others do not. This is a field guide to which profiler to reach for, grounded in one program profiled every way at once, on CPython 3.14 and Apple Silicon.

The workload is fixed throughout: a 1000x1000 grid at 300 iterations, with the book's fixture checksum `sum(output) == 33,219,980` so every run is verifiably computing the same thing. It runs at ≈99% single-core utilization, so nearly all of its time is in code you can actually optimize.

*The `julia_set.py` workload and every saved profile, flame graph, and call graph shown here live in the companion repo: [`chapter_2_profiling_to_find_bottlenecks`](https://github.com/deepanshululla/high-performance-python/tree/main/chapter_2_profiling_to_find_bottlenecks). The commands below are the exact ones used to produce them.*

## The first split: deterministic vs sampling

Before the individual tools, the one distinction that organizes all of them:

- A **deterministic** (instrumenting) profiler records *every* call or line by injecting measurement into the execution path. Accurate, but it can inflate runtime massively (`line_profiler` can be ≈10x). `cProfile` and `line_profiler` are this kind.
- A **sampling** profiler periodically peeks at the call stack (≈100 Hz) instead of instrumenting every call, so its overhead is near zero and it can attach to an already-running process. `py-spy` and `scalene` work this way.

That tradeoff (granularity vs overhead, and whether you can attach to a live process) decides most of your tool choice.

## cProfile: where does the time go, by function

`cProfile` is the built-in deterministic profiler. It records every call's timing into a `.prof` stats file, which you sort two ways:

- **tottime** (total time): time in a function's *own* body, excluding callees. Sort by this to find the direct hotspot.
- **cumtime** (cumulative time): the function plus everything it calls. High cumtime with low tottime marks a coordinator frame that orchestrates work but is not itself the bottleneck.

```bash
# print the stats sorted by total time, no code changes needed
python -m cProfile -s tottime julia_set.py

# or save a .prof file to inspect later (pstats, snakeviz, flameprof, gprof2dot)
python -m cProfile -o julia.prof julia_set.py
```

```python
# reading a saved .prof in code
import pstats
pstats.Stats("julia.prof").sort_stats("cumtime").print_stats(10)
```

This is your first stop: it tells you which function to look at. It does not tell you which *line*.

## line_profiler: which line inside that function

Once cProfile names the hot function, `line_profiler` (run via `kernprof`) breaks it down per source line with hit counts. You mark the function with `@profile` and read off which line accumulated the time. For the Julia set this lands squarely on the inner `while abs(z) < 2 and n < maxiter` loop, run ≈34 million times. The price is the ≈10x runtime inflation, so you use it surgically on one function, not the whole program.

```python
# mark only the function you want costed (no import needed; kernprof injects @profile)
@profile
def calculate_z(maxiter, zs, cs):
    ...
```

```bash
# -l = line-by-line, -v = print the report when done
kernprof -l -v julia_set.py
```

## py-spy: profile without touching the code

`py-spy` is a sampling profiler that needs no code changes and can attach to a running process by PID, which makes it the tool for production. Its columns mirror cProfile (**%Own** is like tottime, **%Total** is like cumtime), and it reports GIL contention directly. For the single-threaded Julia set it prints "GIL: 100%", which is the concrete reason threading will not speed this up: only one thread executes Python bytecode at a time.

```bash
py-spy top -- python julia_set.py      # live top-style view, no output file
py-spy record -o pyspy_julia.svg -- python julia_set.py   # sample into a flame graph
py-spy dump --pid <PID>                # one-shot stack snapshot of a live process
```

![py-spy sampling flame graph of the Julia set](/blogs/images/hpp-pyspy-julia.svg)
*py-spy's flame graph: width is time, the wide bar near the bottom is where the program lives.*

## scalene: is this line spending time in Python or in C?

`scalene` is a low-overhead sampling profiler with a feature the others lack: it splits each line's time into **Python** (interpreter) work vs **native** (C) work, and captures CPU and memory in one run. On the Julia set this is illuminating, it shows that `abs()` spends its time in CPython's C code, not in the interpreter loop. That Python-vs-native column is exactly the signal that tells you whether a line is a candidate for vectorization or compilation (lots of Python time) or already bottoming out in C (lots of native time).

```bash
scalene run -o scalene-julia.json julia_set.py   # profile CPU (Python vs native) + memory
scalene view --cli -r scalene-julia.json         # terminal report, active lines
scalene view --standalone scalene-julia.json     # self-contained HTML report
```

## memray: who allocated all that memory

When the question is memory rather than time, `memray` (Bloomberg's allocator-level profiler) intercepts every `malloc`/`calloc`/`mmap` and flame-graphs the *allocation sites*. Unlike older WSGI middleware it works with async/ASGI apps, which is why it is the right tool for a memory leak in a modern web service: a true leak shows a monotonically rising object count until the OS OOM-kills the process (exit code 137 = 128 + SIGKILL). For the Julia set it pinpoints the boxed-object cost, each complex number is a ≈40-byte heap object, which is the memory penalty that motivates numpy's unboxed arrays in the next chapter.

```bash
memray run -o julia.bin julia_set.py        # record every allocation into a capture file
memray stats julia.bin                       # CLI summary of the biggest allocators
memray flamegraph -o julia_memray.html julia.bin   # interactive allocation flame graph
```

```bash
# the low-overhead RSS time-series view (memory_profiler / mprof), with labeled phases
mprof run --python python julia_set.py
mprof plot --output mprof_julia.png mprofile_*.dat
```

![mprof memory time-series of the Julia run with labeled phases](/blogs/images/hpp-mprof-julia.png)
*A memory time-series (mprof) of the run, with labeled phases showing where RSS grows and where `del` releases it.*

## viztracer: what happened, in what order

The profilers above aggregate. `viztracer` instead records the entry/exit timestamp of every call and renders it as an interactive, zoomable timeline (Perfetto-style, viewed with `vizviewer`). It answers a different question: not "where is the time" but "what was the *sequence* and nesting of calls over time." Reach for it when ordering and call structure matter, not just totals.

```bash
viztracer --ignore_c_function -o viztracer_julia.json julia_set.py   # record the timeline
vizviewer viztracer_julia.json     # open the zoomable Perfetto-style view
```

## The visualizers: turning .prof into a picture

A `cProfile` stats file is hard to read as text, so several tools render it:

- **flameprof** converts it to a static SVG flame graph (frames stacked by depth, sized by cumulative time, wide bars near the bottom are where the program lives).
- **snakeviz** draws an interactive icicle graph (a flame graph oriented downward) in the browser.
- **gprof2dot + Graphviz** turns it into a call-graph PNG, nodes are functions, edges show who calls whom, and a reddish spine marks the hot path to the hottest leaf.

```bash
flameprof julia.prof > julia_flame.svg            # static SVG flame graph
snakeviz julia.prof                                # interactive icicle in the browser
gprof2dot -f pstats julia.prof | dot -Tpng -o julia_profile.png   # call-graph PNG
```

![gprof2dot call graph of the Julia run](/blogs/images/hpp-julia-callgraph.png)
*A call graph: the reddish spine traces the hot path down to the hottest leaf function.*

![Static flame graph of the Julia run](/blogs/images/hpp-julia-flame.svg)
*A flame graph from the same `.prof`: height is call depth, width is cumulative time.*

## A decision guide

Putting it together, the question you are asking picks the tool:

| Your question | Reach for |
| --- | --- |
| Which function is hot? | `cProfile` (sort by tottime/cumtime) |
| Which line inside it? | `line_profiler` |
| Profile a running/production process? | `py-spy` (no code change, attaches by PID) |
| Is this line Python or C time? | `scalene` |
| Where is memory allocated / is there a leak? | `memray` (or `mprof` for an RSS time-series) |
| What is the call sequence over time? | `viztracer` |
| Just show me a picture of the .prof | `flameprof`, `snakeviz`, or `gprof2dot` |

## Conclusion

There is no single best profiler, only a best one for the question you are asking, and the first thing to settle is whether you need a deterministic tool (precise, slow, code-marked) or a sampling one (cheap, attachable, statistical). The order I tend to reach for: `cProfile` to find the hot function, `line_profiler` for the hot line, `py-spy` when I cannot edit or stop the process, `scalene` to learn whether a line is Python or C, and `memray` when the problem is memory. Your mileage and preferences will vary. The Julia set is a toy, but the toolbox is the part worth keeping: measure first, with the instrument that answers your actual question.


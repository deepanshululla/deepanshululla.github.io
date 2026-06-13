# The Vehicle Costs More Than the Math: pandas Row Iteration and the concat Quadratic Trap

**Published:** June 13, 2026

There is a recurring surprise in dataframe code: the arithmetic you are doing per row is almost never what makes the job slow. The *vehicle* you choose to move over the rows, and the way you accumulate the results, dominate the runtime. This post works through two measurements from *High Performance Python* (3rd ed.), Chapter 7, on pandas 3.0 and Apple Silicon: the four common ways to iterate rows (and why three of them are slow), and the `pd.concat`-in-a-loop pattern that quietly turns a linear job into a quadratic one.

The running example is the book's real consulting workload: fit an Ordinary Least Squares slope to every row of a DataFrame, where each row is a synthetic user's 14 days of phone usage. The full job is a million users across hundreds of time windows, so how you apply that tiny function decides whether the work takes minutes or hours.

*Runnable benchmarks for this post: row iteration is [`ex02_row_iteration`](https://github.com/deepanshululla/high-performance-python/tree/main/chapter_7_pandas_dask_polars/ex02_row_iteration) and the concat trap is [`ex04_concat_quadratic`](https://github.com/deepanshululla/high-performance-python/tree/main/chapter_7_pandas_dask_polars/ex04_concat_quadratic) in the companion repo.*

## Part 1: the row-iteration vehicle sets the speed

Run the identical per-row OLS slope over 20,000 rows, four ways:

| method | time | speedup vs `iloc` |
| --- | ---: | ---: |
| `iloc` loop | ≈0.41 s | 1.0x |
| `iterrows` | ≈0.42 s | ≈1.0x |
| `apply(axis=1)` | ≈0.28 s | ≈1.5x |
| `apply(axis=1, raw=True)` | ≈0.25 s | ≈1.6x |

![Four row-iteration methods: iloc and iterrows tied at the back, apply and raw=True ahead](/blogs/images/hpp-pandas-row-iteration.png)
*`iloc` and `iterrows` are effectively tied at the back; `apply` is a clear step up; `raw=True` shaves a little more off the top. This is the book's Table 7-1 in miniature.*

Why the gap, when the OLS math is byte-for-byte identical in all four? Because of what each vehicle builds around that math.

Every time you write `df.iloc[i]` or step through `df.iterrows()`, pandas constructs a brand-new `Series` object for that row: it locates the row, wraps its values in a fresh object with its own index and metadata, and hands it back. Do that 20,000 times and the per-row object churn, not the regression, is where the time goes. `apply(axis=1)` skips the Python-level intermediate references and is quicker for it. `apply(axis=1, raw=True)` goes one step further and hands your function the bare NumPy array underneath the row, so even the internal Series construction disappears.

That last point matters far beyond the small margin it wins here. A bare NumPy array is the *only* form Numba or Cython can compile. `raw=True` is precisely what strips the un-compilable pandas layer out of the hot path, which is what unlocks the [much larger compilation wins downstream](https://github.com/deepanshululla/high-performance-python/tree/main/chapter_7_pandas_dask_polars/ex03_numba_compile) (Numba takes the same per-row apply from ≈255 ms to ≈10 ms, a ≈26x win). So the ordering is not just iloc < iterrows < apply < raw on speed; it is also a ladder toward being able to compile at all.

## Part 2: the concat quadratic trap

Once each row produces a result, you have to collect the results somewhere. The tempting thing is to grow a Series as you go, concatenating each new value:

```python
# The trap: grow the Series one element at a time
result = pd.Series(dtype=float)
for i in range(n):
    result = pd.concat([result, pd.Series([compute(i)])])

# The fix: accumulate in a list, build the Series once
acc = []
for i in range(n):
    acc.append(compute(i))
result = pd.Series(acc)
```

Accumulating 8,000 per-row OLS results both ways:

| approach | time | vs list |
| --- | ---: | ---: |
| append to a list, build one Series | ≈0.17 s | 1.0x |
| `pd.concat` on every iteration | ≈0.64 s | ≈3.8x slower |

![concat-in-a-loop vs list-then-build, and per-chunk slowdown](/blogs/images/hpp-pandas-concat-quadratic.png)
*The concat-on-every-iteration approach is ≈3.8x slower; the companion measurement shows each successive 10% block of a pure concatenation running slower than the one before it.*

A pandas Series is backed by a single contiguous array, and you cannot grow a contiguous array in place. So every `pd.concat` allocates a brand-new array one element longer and copies *all* the elements already accumulated. Copying N elements on iteration N, summed over the run, is 1 + 2 + ... + N which is about N^2/2: classic O(N^2). A Python list does not have this problem, because `list.append` is amortized O(1) (CPython geometrically over-allocates the backing array, so most appends touch no new memory), and you pay a single allocation when you build the Series once at the end.

### An honesty note on the ratio

At 8,000 rows the headline ≈3.8x is dominated by `concat`'s high *fixed* per-call overhead, not yet by the copy. To see the quadratic term itself, you have to isolate the concatenation and push to ≈60,000 elements: time each successive 10% block of a pure concat and the final block runs roughly 1.5x slower than the first, each chunk slower than the last because the Series it copies keeps getting longer. The fixed overhead makes concat lose immediately; the quadratic copy makes it lose catastrophically at scale.

## Conclusion

In dataframe code, it's usually worth looking at the vehicle before optimizing the math. Choosing `apply(raw=True)` over `iloc` was a ≈1.6x win here and the gateway to compilation; replacing iterative `pd.concat` with list-then-build was a ≈3.8x win that grows without bound as the data does. Neither change touches the actual computation. The rule of thumb I take away is to be a little suspicious of any loop that rebuilds a contiguous structure each iteration: append to something amortized O(1) (a Python list), and materialize the expensive immutable structure once at the end. As always, the numbers above are from one machine — the ordering is the durable part, not the exact ratios.


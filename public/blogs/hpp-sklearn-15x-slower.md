# scikit-learn's LinearRegression Is 15x Slower Than lstsq, and 85% of It Is Input Validation

**Published:** June 13, 2026

Reach for `sklearn.linear_model.LinearRegression` to fit a line and you are, at the very bottom of the call stack, running the same `numpy.linalg.lstsq` solve you could have called directly. Yet on a small, clean input the scikit-learn version is many times slower. This is the opening surprise of *High Performance Python* (3rd ed.), Chapter 7; reproducing it on Apple Silicon with CPython 3.14 happened to widen the gap further than the book's (the exact multiple depends on the machine, so treat "15x" as my number, not a universal one). The reason is worth understanding, because it is a trade you make constantly without noticing — and, as we'll see, usually a trade worth making.

*The runnable benchmark for this post lives in the companion repo: [`chapter_7_pandas_dask_polars/ex01_ols_sklearn_vs_lstsq`](https://github.com/deepanshululla/high-performance-python/tree/main/chapter_7_pandas_dask_polars/ex01_ols_sklearn_vs_lstsq).*

## What it measures

Fit a single OLS slope to one synthetic 14-element row (the book's "hours used per day" data), averaged over 2,000 calls, two ways:

| version | per call | peak memory | projected to 730M calls |
| --- | ---: | ---: | ---: |
| scikit-learn `LinearRegression` | ≈170 us | ≈13.8 KB | ≈34 hours |
| numpy `linalg.lstsq` | ≈11 us | ≈4.0 KB | ≈2 hours |

![scikit-learn vs lstsq on a log axis, ≈15x gap](/blogs/images/hpp-sklearn-vs-lstsq.png)
*Two bars on a logarithmic y-axis (each gridline is 10x the one below). The friendly, popular API is the expensive one.*

The book reports a 7x gap on its hardware; here it comes out around 15x. The exact multiple is machine-dependent, but the shape is identical, and the projection is the part that stings: the real job is a million users times up to 730 time windows, roughly 730 million calls. At ≈170 us each that is ≈34 hours; at ≈11 us each it is ≈2 hours. The same answer, computed the same way at the bottom, costs you a day and a half of wall-clock time.

```python
from sklearn.linear_model import LinearRegression
import numpy as np

# The reflex: friendly, validated, ≈170 us/call
def slope_sklearn(y):
    x = np.arange(len(y)).reshape(-1, 1)
    return LinearRegression().fit(x, y).coef_[0]

# The terse version: same solve underneath, ≈11 us/call
def slope_lstsq(y):
    x = np.vstack([np.arange(len(y)), np.ones(len(y))]).T
    return np.linalg.lstsq(x, y, rcond=None)[0][0]
```

## Where the time actually goes

Profile `LinearRegression.fit` with `line_profiler`, as the book does, and the `linalg.lstsq` solve, the part that does the actual mathematics, is only about an eighth of scikit-learn's runtime. The other ≈85% is spent in two helper methods, `_validate_data` and `_preprocess_data`, which:

- scan the input for NaN and Inf,
- check that the array is 2-D and non-empty,
- look for sparse inputs,
- mean-center the data for numerical stability.

None of that is wasted work in general. Those checks have saved every one of us from feeding a mis-shaped or dirty array into an estimator and then chasing a nonsensical result for an hour. But on a clean, tiny, 14-element row they are pure overhead, and they run on *every single call*. The maths is microscopic, so the fixed safety cost dominates completely. That is the trade laid bare: you are spending execution time to buy developer safety, and the friendlier the API, the more of that tax it collects up front.

## When the trade flips

The point is not "never use scikit-learn." For a single fit on a large, possibly-dirty dataset, the validation is a rounding error against the solve and the safety is free insurance. The trade only flips when two things are both true: the computation per call is tiny, and you make an enormous number of calls. That is precisely the regime of this workload, hundreds of millions of trivial fits, where the per-call tax is the whole bill. The skill is recognizing which regime you are in. A good heuristic: if you are about to call a high-level estimator inside a tight loop over many small inputs, profile one call first and see how much of it is the math.

## Conclusion

`LinearRegression` and `lstsq` end in the same solve, but scikit-learn wraps it in ≈85% input validation that runs on every call. On one large clean fit that overhead vanishes; across 730 million tiny fits it is the difference between 2 hours and 34. Library safety is a per-call tax, invisible until the call count is huge and the computation is small. When you find yourself there, drop to the primitive that does just the math you need, and let validation happen once at the boundary instead of on every iteration.


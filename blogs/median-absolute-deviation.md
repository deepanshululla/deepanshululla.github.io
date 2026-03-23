# Median absolute deviation (MAD) of Errors

**Published:** 2019-11-10

![Statistical error measurement](https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=400&fit=crop&q=80)

Median Absolute deviation is one of the other techniques specifically used for analyzing the performance of regression models.

```mermaid
graph TD
    A[Input Data: X1, X2, ..., Xn] --> B[Step 1: Compute median of data]
    B --> C[X_median = median of X]
    C --> D["Step 2: Compute absolute deviations |Xi - X_median|"]
    D --> E["Step 3: Take median of absolute deviations"]
    E --> F[MAD Result]
```

#### **Computing MAD of errors**

For a univariate data set X1, X2, ..., Xn, the MAD is defined as the median of the absolute deviations from the data's median,

**X_median = median(X)**

**Median Absolute deviation = median(|Xi-X_median|)**

that is, starting with the residuals (deviations) from the data's median, the MAD is the median of their absolute values.

**Example**

Consider the data (1, 1, 2, 2, 4, 6, 9). It has a median value of 2.

The absolute deviations about 2 are (1, 1, 0, 0, 2, 4, 7) which in turn have a median value of 1 (because the sorted absolute deviations are (0, 0, 1, 1, 2, 4, 7)).

So the median absolute deviation for this data is 1.

Computing MAD with scipy and numpy:

```python
import numpy as np
from scipy.stats import median_abs_deviation

data = np.array([1, 1, 2, 2, 4, 6, 9])

# Using scipy (scale=1.0 gives the raw MAD without normalization)
mad_scipy = median_abs_deviation(data, scale=1.0)
print(f"MAD (scipy): {mad_scipy}")
# MAD (scipy): 1.0

# Manual computation with numpy
median_val = np.median(data)
abs_deviations = np.abs(data - median_val)
mad_manual = np.median(abs_deviations)
print(f"Median:      {median_val}")
print(f"Abs devs:    {abs_deviations}")
print(f"MAD (manual):{mad_manual}")
# Median:      2.0
# Abs devs:    [1. 1. 0. 0. 2. 4. 7.]
# MAD (manual): 1.0
```

**Why is it important**

```mermaid
graph LR
    subgraph Standard Deviation and R-Squared
        A1[Data with outlier] --> A2[Squaring amplifies outlier effect]
        A2 --> A3[Distorted result]
    end
    subgraph MAD
        B1[Data with outlier] --> B2[Median ignores extreme values]
        B2 --> B3[Robust result]
    end
```

If we recall the formula for calculating Sum of Squares Residual

The issue with R-Squared is it contains SSresidue which is 

So even if one of the errors is an outlier, it can screw up the calculation of SSresidue.

So coefficient of distribution is prone to outliers.

### Understanding MAD of errors

```mermaid
graph TD
    A[Predicted values y_hat] --> B[Compute errors: ei = yi - yi_hat]
    C[Actual values y] --> B
    B --> D[Find median of errors: e_median]
    D --> E["Compute |ei - e_median| for each point"]
    E --> F[MAD of Errors = median of absolute deviations]
    F --> G{MAD Value}
    G -->|Small or near 0| H[Good model fit]
    G -->|Large| I[Poor model fit]
```

Assuming Error e, to be a random variable with being a vector of size n. Let e1, e2, e3.. en represent the computation of errors for each point in a univariate data set X1, X2, ..., Xn, .

Let |ei| represent the absolute value of ei.

the MAD of errors would be defined as the median of the absolute deviations from the data's median,

e_median = median(e)

Median Absolute deviation of Errors = median(|e<sub>i</sub>-e_median|)

In other words, if the median is analogous to mean, the Median Average Deviation is analogous to the standard deviation.

So if |ei| is small or approximately equal to zero for i={1..n}; that's the best case.

However if |ei| is large then it signifies a problem

Computing MAD of prediction errors:

```python
import numpy as np
from scipy.stats import median_abs_deviation

def mad_of_errors(y_true, y_pred):
    """Median Absolute Deviation of prediction errors.
    A robust alternative to standard deviation for measuring model fit.
    """
    errors = np.array(y_true) - np.array(y_pred)
    med = np.median(errors)
    return np.median(np.abs(errors - med))

y_true = np.array([3.0, -0.5, 2.0, 7.0, 4.5])
y_pred = np.array([2.5,  0.0, 2.0, 8.0, 4.0])
errors = y_true - y_pred

print(f"Errors:    {errors}")
print(f"MAD of errors: {mad_of_errors(y_true, y_pred):.4f}")
print(f"Scipy MAD:     {median_abs_deviation(errors, scale=1.0):.4f}")
# Errors:    [ 0.5 -0.5  0.  -1.   0.5]
# MAD of errors: 0.5000
# Scipy MAD:     0.5000
```
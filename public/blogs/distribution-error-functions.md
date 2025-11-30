# Distribution of error functions

**Published:** 2019-09-22

We can plot error distributions like probability density function
and cumulative density function and make important deductions
based on it.

We can use plot Probability Density functions(PDF) and Cumulative density function (CDF) by using the error function as a random variable

### Using PDF of error distribution

An ideal pdf for error distributions would be a curve which is positively skewed. 

What that means that most of the errors are small and very few errors are large.

On the other hand, if error distribution is negatively skewed it means most of the errors are large and that's not a good thing.

### Using CDF of error distribution

Let's say we want to compare error functions of different models. One good way to do it is to find and plot CDF of all these error functions. 

The curve which is on top of the other curves(in this case the green curve) would be the most ideal here. The one on top of other curves would show the least amount of errors.

Further, If we see 80% of errors for the green curve lie for X< -1.

Hence, this means 80% of errors in the green error CDF like below -1 which for other curves is higher than -1.

import numpy as np
from pylab import *

# Create some test data
dx = 0.01
X  = np.arange(-2, 2, dx)
Y  = exp(-X ** 2)

# Normalize the data to a proper PDF
Y /= (dx * Y).sum()

# Compute the CDF
CY = np.cumsum(Y * dx)

# Plot both
plot(X, Y)
plot(X, CY, 'r--')

show()
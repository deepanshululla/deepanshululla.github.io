# Maths 101: Part 3: Random variables and Normal Distribution

**Published:** 2019-01-26

### **Random Variables**
The term random variable is not very descriptive.

A better term is measurement function.Consider tossing a fair six-sided die. There are only six outcomes possible,

Ω = {1, 2, 3, 4, 5, 6}

As we know, if the die is fair, then the probability of each outcome is 1/6. To say this formally, the measure of each set (i.e., {1}, {2}, . . . , {6}) is

P({1}) = P({2}) . . . = P({6}) = 1/6.

In other words, every number on the dice is equally probable.

Here we can define a measurement function.

In general, The measurement function maps a set into a number on the real line.

For example, In a throw of dice, we can define our random variable, we can define our measurement function as the probability of each outcome

X --> Value of random variable

{1} → 1/6

{2} → 1/6

;

:

{6} →  1/6

Random variables are of different types.

They could be

- Discrete
- Continuous

If you don't know what these are don't worry we will cover this in future parts.

The throwing dice is an example of discrete random variables. There are also continuous random variables. For eg, the height of students in a class etc.

The way the data is distributed in the graph is called the distribution of the data.

Random variables are also classified by their distributions for eg. Gaussian, uniform, log normal etc.

Examples of Gaussian distribution would include the height of students in a class and examples of uniform distribution would include tossing a coin or throwing a dice where each outcome is equally probable.

 

That being said it doesn't mean all uniform random variable are discrete and all Gaussian random variable is continuous. We can have a continuous uniform random variable.

 

### **Normal Distribution**
In probability theory, the normal (or Gaussian or Gauss or Laplace–Gauss) distribution is a very common continuous probability distribution.

Normal distributions are important in statistics and are often used in the natural and social sciences to represent real-valued random variables whose distributions are not known.

A random variable with a Gaussian distribution is said to be normally distributed and is called a normal deviate.

#### The 68-95-99.7 rule for a Normal Distribution
The normal distribution is commonly associated with the 68-95-99.7 rule which you can see in the image above.

Further one can see that roughly 68% of the data lies within 1 standard deviation (σ) of the mean (μ).

Similarly, we can say that around 95% of the data is within 2 standard deviations (σ) of the mean (μ), and 99.7% of the data is within 3 standard deviations (σ) of the mean (μ).

#### 
#### Skewness
is the measure of how much distributions look departed from the symmetry. Distributions can be positive or negative skewed.

For example, for measurements that cannot be negative, which is usually the case, we can infer that the data have a skewed distribution if the standard deviation is more than half

the mean.

Such an asymmetry is referred to as positive skewness.

The opposite, negative skewness, is rare.

#### Kurtosis
In layman terms, Kurtosis is a measure of the “peakedness” of the probability distribution.

However that is not accurate, read **Peter Westfall's comments below why that is not the case.**

Distributions with negative or positive excess kurtosis are called platykurtic distributions or leptokurtic distributions, respectively.

 

 

Hope you liked it and let us know what you think in the comments.

**Link to All Maths 101 posts**

Maths 101: Part 1: Data Types and their visualization

Math 101: Part 2: Measures of central tendency and Skewness

Maths 101: Part 3: Random variables and Normal Distribution

Maths 101: Part 4: PDF, Central Limit Theorem and Chebyshev’s inequality
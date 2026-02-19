# Maths 101: Part 4: PDF, Central Limit Theorem and Chebyshev\u2019s inequality

**Published:** 2019-02-09

![Central limit theorem](https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop&q=80)

#### Populations and Samples
The main difference between a population and a sample has to do with how

observations are assigned to the data set

*Population Includes all of the elements from a set of data.*

*Sample Consists of one or more observations from the population.*

```mermaid
graph TD
    A[Population: All Elements] -->|Draw a subset| B[Sample 1]
    A -->|Draw a subset| C[Sample 2]
    A -->|Draw a subset| D[Sample 3]
    B --> E[Sample Mean 1]
    C --> F[Sample Mean 2]
    D --> G[Sample Mean 3]
    E --> H[Estimate Population Mean]
    F --> H
    G --> H
    style A fill:#4a90d9,color:#fff
    style H fill:#2ecc71,color:#fff
```

### Probability Density function(PDF)
The PDF, or density of a continuous random variable, is a function that describes

the relative likelihood of a random variable X to take on a given value x.

In the mathematical fields of probability and statistics, a random variate x is a particular

outcome of a random variable X: the random variates which are other outcomes of

the same random variable might have different values.

The PDF also defines the expected value E[X] of a continuous distribution of X.

The expected value is a function of the probability distribution of the observed

value in our population. Moreover The sample mean of our sample is the observed mean value of our data.

Further If the experiment has been designed correctly, the sample mean

should converge to the expected value as more and more samples are included in the

analysis.

```mermaid
graph LR
    A[Random Variable X] --> B[PDF: f of x]
    B --> C[Area Under Curve = Probability]
    B --> D[Expected Value E of X]
    D --> E[Sample Mean Converges to E of X]
    style B fill:#4a90d9,color:#fff
    style E fill:#2ecc71,color:#fff
```

### **Central Limit Theorem**
In probability theory, the central limit theorem (CLT) establishes that, in some situations, when independent random variables are added, their properly normalized sum tends toward a normal distribution (informally a "bell curve") even if the original variables themselves are not normally distributed.

The theorem is a key ("central") concept in probability theory because it implies that probabilistic and statistical methods that work for normal distributions can be applicable to many problems involving other types of distributions.

For example, suppose that a sample is obtained containing a large number of observations, each observation being randomly generated in a way that does not depend on the values of the other observations, and that the arithmetic average of the observed values is computed.

If this procedure is performed many times, the central limit theorem says that the distribution of the average will be closely approximated by a normal distribution.

A simple example of this is that if one flips a coin many times the probability of getting a given number of heads in a series of flips will approach a normal curve, with mean equal to half the total number of flips in each series. (In the limit of an infinite number of flips, it will equal a normal curve.)

```mermaid
graph TD
    A[Any Distribution] --> B[Take Many Samples of Size n]
    B --> C[Compute Sample Mean for Each]
    C --> D[Distribution of Sample Means]
    D --> E[Approximates Normal Distribution]
    E --> F[Mean = Population Mean]
    E --> G[Std Dev = Sigma / sqrt of n]
    style A fill:#e74c3c,color:#fff
    style E fill:#2ecc71,color:#fff
```

### Chebyshev's inequality
In probability theory, Chebyshev's inequality (also called the Bienayme-Chebyshev inequality) guarantees that, for a wide class of probability distributions, no more than a certain fraction of values can be more than a certain distance from the mean.

Specifically, no more than 1/k2 of the distribution's values can be more than k standard deviations away from the mean (or equivalently, at least 1-1/(k^2) of the distribution's values are within k standard deviations of the mean). The rule is often called Chebyshev's theorem, about the range of standard deviations around the mean, in statistics.

The inequality has great utility because it can be applied to any probability distribution in which the mean and variance are defined.

```mermaid
graph TD
    A[Chebyshev Inequality] --> B[k=1: At most 100% outside 1 std dev]
    A --> C[k=2: At most 25% outside 2 std devs]
    A --> D[k=3: At most 11.1% outside 3 std devs]
    B --> E[At least 0% within 1 std dev]
    C --> F[At least 75% within 2 std devs]
    D --> G[At least 88.9% within 3 std devs]
    style A fill:#4a90d9,color:#fff
    style F fill:#2ecc71,color:#fff
    style G fill:#2ecc71,color:#fff
```

Note the only requirement for applying Chebyshev's inequality is that it has fixed mean.

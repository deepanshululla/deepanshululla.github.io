# Maths 101 : Part 7: Estimating Confidence Intervals

**Published:** 2019-03-23

In statistics, a confidence interval (CI) is a type of interval estimate which we compute using the statistics of the observed data.

The interval has an associated confidence level that, loosely speaking, quantifies the level of confidence that the value of the parameter lies in the interval.

For eg, if we want to determine the average salary of people in a country, we would say with 95% confidence that the mean salary lies between 60,000$ and 80,000$.

The % value is what I call confidence value and the range (60k-80k) is called a confidence interval.

Let's understand it with an example.

Let's say we have a population of data which contain weights of all students in a class.

In this population, we can pick a random variable which is a sample(randomly selected) of n=10 students {x1,x2,...x10}.

Now if we find the mean of the sample and compare it to mean of the population. We will see that the mean of the sample is very similar to mean of the population(not equal to(It may or may not be equal), but similar to).

µ(sample) ≅ µ(population)

In fact, as we increase the number of students in the sample (n), we see the mean of the sample becomes closer to mean of the population.

#### **Point Estimate vs Interval estimate**

The question of confidence intervals (or interval estimates) comes in when we don't know the real mean value of the population and all we know is the mean of the sample.

Here we can say with some degree of certainty/confidence/higher probability that the mean of the population is within a particular range.

**Example**

Let's say for our sample of n = 10 students, our mean of the sample is µ = 160 lbs and the standard deviation is σ=10 lbs.

Now since we know that the distribution is Gaussian for weights of students in a general population, we can say

The mean of the population

lies between [140,180 ] lbs with 95.4% probability.

This estimation is called point estimate and the range is called confidence interval.

 

### **Methods of finding confidence intervals**
 

#### **Case 1: if we know the standard deviation of the population**.
If σ(population) is known, we can say that if we have taken n samples,

In that case, we can say,

Here if we want to have a confidence level of 95%, we will have to take the value of Z as 2.

 

#### **Case 2: If we don't know the standard deviation of the population**
Confidence interval using bootstrapping
Let's say we want to find the 95% confidence interval for the median.

So when we find the sample of size n: S: {x1,x2,x3...xn}

n=10

From this we will take a sample of size m:

{x11,x12,...x1m} such that m<=n

So what we do is create samples of our sampled data using a uniform random variable. These samples may contain repetitions.

Similarly we can take k such samples

{x21,x22,...x2m}

{x31,x32,...x3m}

:

:

:

{xk1,xk2,...xkm}

Then we find the medians of these k sample sets that we created.

{x21,x22,...x2m} --> m1

{x31,x32,...x3m} -->m2

:

:

:

{xk1,xk2,...xkm} --> mk

So now we have a set of k medians {m1,m2...mk}

Lets say k=1000.

After that, we sort these samples and then we can say our confidence interval lies between m25 and m975.

A similar calculation is made for calculating the variance, mean and standard deviation. This method is called non-parametric technique since it doesn't make any assumptions about the data.
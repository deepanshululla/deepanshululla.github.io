# Dimensionality Reduction In Machine Learning: Some mathematical prerequisites: Mean Vector, Covariance Matrix and Column Standardization

**Published:** 2019-06-01

This is part 2 of Introduction to Dimensionality Reduction. In this blog post, we would several different mathematical prerequisites that one must know before trying to understand machine learning.

 

#### Mean Vector

The sample mean is a vector each of whose elements is the sample mean of one of the random variables – that is, each of whose elements is the arithmetic average of the observed values of one of the variables.

mean-vector1

**Lets say we have two vectors**

**x1 = [2.2, 4.2,...]**

**x2 = [1.2, 3.2,...]**

**x_mean = 1/2(x1+x2)**

**= 0.5* [3.4, 7.4, ..]**

**= [1.7,3.7, .. ]**

So essentially we summed up elements at ith index of the first array and the corresponding index of the second array.

**So we can say every array can be considered as a vector with each of its indices as one of the dimensions**.

If we plot all these arrays and their indices in a multidimensional space,we would see that they look like a 3d scattered plot. 

We can define mean vector for that scattered group geometrically something like this picture below.

#### Data preprocessing: Column Standardization

**Column standardization is a type of feature normalization where we move the data in such a way that the mean of the data becomes 0 and the standard deviation becomes 1.**

featuref1f2f3f4X=110a123X=220a214X=330a344X=430a344X=nxanz

**Let a1, a2... an, represent n values of a feature f****j**

Let's say we apply column standardization on these and we get a new feature

**f****j standardized**

Let a1', a2'... an' represent n values of a feature fj standardized

then the mean of all such vectors would be defined as

**mean(a1',a2'...an') =0**

and the standard deviation 

**std(a1',a2'...an') =1**

**The way we do it is by subtracting each element from the mean and dividing by standard deviation. On doing so for the new vector, the mean becomes 0 and the standard deviation becomes 1.**

So how do we obtain a1', a2'... an'

let's say mean(a1', a2'... an') be amean

and standard deviation(a1', a2'... an') be astd

**a****i****' = (a****i****- a****mean****)/a****std**

Geometrically speaking we move the distribution to the origin and constrict it in a hypercube of unit 1. Hence it is also called mean centering.

We may need to squish or expand the data depending upon if the standard dev of the data is greater or less than 1.

#### Covariance Matrix

Let's say we have a matrix X

featuresf1f2f3f4X=1x11x12x13x14X=2x21x22x23x24X=3x31x32x33x34

we can define its covariance matrix S

featuresf1f2f3f41s11s12s13s142s21s22s23s243s31s32s33s344s41s42s43s44

where xi,j are ith row and jth column in X

and si,j are ith row and jth column in S

The dimensions of  X here are n*d where n is number of points and d is number of dimensions(or features)

Whereas the covariance matrix is of size d*d. Hence covariance matrix is always a square matrix

***Covariance has two properties***

**1) Cov(X,Y)=Cov(Y,X)**

**2) Cov(X,X)= Var(X)**

**This means s(i,j) = s(j,i)**

Another interesting property is for a column normalized vector X,

**covariance matrix S=(1/n)*****(X****transpose**** ***** *X)**

We will leave the proof as an exercise but proving it should be trivial.

Stay tuned for the next post on dimensionality reduction. We would start describing a classical way of doing Dimensionality Reduction called Principal component Analysis.
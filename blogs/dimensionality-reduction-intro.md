# Dimensionality Reduction: Part 1: Introduction and defining data as data frame

**Published:** 2019-05-11

### Introduction to Dimensionality Reduction

There are several ways we can define Dimensionality Reduction. One way to define it is:

*Dimensionality Reduction refers to the process of converting a set of data having vast dimensions into data with lesser dimensions ensuring that it conveys similar information concisely.*

The other way which I prefer more is:

**Dimensionality reduction is the process of reducing the number of random variables(features) under consideration, by obtaining a unique set of principal variables(features). These new features may or may not be the same as the original features. **

**The process can be done either by feature selection and feature extraction.**

In this blog post, we will explore and try to understand what dimensionality reduction is. Also, we will cover how to represent a dataset in the matrix format.

**There are two techniques we will learn to do dimensionality reduction**

**1) Principal Component Analysis(PCA)**

**2) t-Distributed Stochastic Neighbor Embedding (t-SNE)**

t-SNE is more state of the art technology but PCA is still used as well.

Let us understand this with an example.

Let's say we have data which has 2 or 3 dimensions. This kind of data is easier to visualize using scatter plots or pair plots.

**However, consider a dataset which has 1000 dimensions. Firstly, It is not at all easy to visualize a dataset more than 3 dimensions.**

True we can do pair plots, but the number of pair plots exponentially increases as a number of dimensions increases.

Hence, having a lot of features lose the overall meaningfulness of the dataset by having so many pair plots since they become impossible for a human to analyze them.

This is one of the use cases for Dimensionality Reduction. To visualize a higher dimensional dataset.

These techniques are typically used while solving machine learning problems to obtain better features for a classification or regression task.

#### **Why having too many features or dimensions is bad?**:The Curse of Dimensionality

The curse of dimensionality refers to all the problems that arise when working with data in the higher dimensions, that did not exist in the lower dimensions.

The common theme of these problems is that when the dimensionality increases, the volume of the space increases so fast that the available data becomes sparse. 

High dimensionality visualization(KDnuggets)

This sparsity is problematic for any method that requires statistical significance. In order to obtain a statistically sound and reliable result, the amount of data needed to support the result often grows exponentially with the dimensionality.

 Also, organizing and searching data often relies on detecting areas where objects form groups with similar properties; in high dimensional data, however, all objects appear to be sparse and dissimilar in many ways, which prevents common data organization strategies from being efficient.

The second issue is difficulty in visualizing high dimensional data.

The third and last issue as number of features, the performance of features decreases when we hit an optimal number of features.

Curse of dimensionality(towardsdatasciece.com)

#### **Representing Data as a data frame**

Column and Row vector

The difference between a column and row vector is not that much significant when it comes to programming in python.

However mathematically, In linear algebra In linear algebra, a **column vector** or **column** matrix is an m × 1 matrix, that is, a matrix consisting of a single **column** of m elements.

Similarly, a row vector is a 1 x m matrix, that is, a matrix consisting of a single **row** of m elements.

**Representing dataset as a matrix**

We can represent the different data points and the features they have in the form of a matrix.

** ****F1****F2****…****Fm****X1****X2****:****Xn**

**Here X1, X2 to  Xn are data points whereas F1, F2 to Fm are different features.**

Essentially each data point is a row and each feature is a column.

For eg in Iris dataset, we can represent dataset as a matrix in the following format.

** ****Petal length****Petal Width****Sepal length****Sepal width****Flower-1****Flower-2****:****Flower-n**

However, more often than not, a dataset also contains labels or output values.

**Dataset D is mathematically expressed as**

**D= { xi,yi}ni=1**

Here xi is an input value whereas yi is an output value

** ****F1****F2****…****Fm**
**Class Label**

**X1****X2****:****Xn**

Furthermore, most of the labeled dataset also contains well class labels. In the case of Iris dataset, the class labels are the flower names.

In the case of Iris dataset, xi  can be any real number whereas yi is a value from a set of flower names.

** ****Petal length****Petal Width****Sepal length****Sepal width****Flower type****Flower-1**Virginia**Flower-2**Sentosa**:**

So how does this relate to dimensionality reduction? Petal length, Petal width, Sepal Length, Sepal width are all features of the dataset. 

We can use dimensionality reduction to create a new set of features that can be used to accurately differentiate between flowers without using pair plots.

Hence the analysis we did here, we can easily eliminate all the pair plots by using dimensionality reduction
# Data Preprocessing and Cleaning: Part 1: Column Normalization

**Published:** 2019-04-20

Before applying any dimensionality reduction technique sometimes it is important to preprocess the data.

There are several ways which we can use for preprocessing data.

In this post, we will explore one of the common ways to do data preprocessing which is column normalization (or feature scaling).

### **Feature scaling**
Feature scaling is a method used to standardize the range of independent variables or features of data.

In data processing, it is also known as data normalization(or column normalization) and is generally performed during the data preprocessing step.

Column normalization is defined as the process of scaling all the features of a column within values of 0 and 1.

Calculations
Let's say there is a feature with values [a1,a2....an] for n items. This could be all the height of students in a class.

**The way to normalize is we find the min(amin) and max(amax) of all the features and then normalize it by substracting each element with amin and then dividing it by (amax-amin)**

Let

**a1,a2.... an --> be n-values of a feature vector fj.**

We then find amax  and amin

max(ai) = amax >= ai (i: 1->n)

min(ai) = amin <= ai (i: 1->n)

**In this way we can define a new feature which is a normalized version fj' **

a1',a2'.... an' will be the normalized values of this new feature

**Here ai' = (ai- amin)/ (amax- amin)**

As a result,** ai' lies in the range [0,1]**

Needless to say as amin' =0 and amax' =1

In this way, we created a new normalized vector from our original vector and the values of that normalized vector lie between 0 and 1.

#### Why do we need to do feature/column normalization?
We may have multiple sources of data of which we want to combine all of it, however not all of it is in the same unit system. For eg two datasets one with length in cm and one with length in meters.

So to put everything on the same scale. The second advantage is when it comes to regression as it converges faster to a minimum.

The normalized values would lie between 0 to 1 inclusive.

Geometrically after normalization, if we plot the features before(on the left) and after normalization(on the right) we will see all the points just shift to a small square between 0 to 1.

The one thing to however notice here is it doesn't change the relationship between the different features.

For eg for two features if we plot it and they lie on y=mx+c, even after normalization they will still lie on the same line.

As one can see, The relationship between X and Y is not affected because of feature scaling.

This is it for this part. We learned about column normalization. Hope you liked it. Comment what you would like to read about and keep sharing.
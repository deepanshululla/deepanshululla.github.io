# Coursera Week 1: Intro to Neural Networks Notes

**Published:** 2023-10-14

## Executive Summary

- A neural network is just a lego-like formation of smaller functions(neurons).

- Neural networks are very good for supervised learning use cases. Given enough data they can very accurately map to this dataset.

- Many NN problems are all about cleverly selecting input and output for a problem. Neural networks are good at unstructured data.

- For images, we often use CNN. For any temporal data that occurs in a sequence like audio, speech, and text sequence models like RNN, LSTM are used.

## Week 1: Introduction

Let's say you have a data set with six houses, so you know the size of the houses in square feet or square meters and you know the price of the house and you want to fit a function to predict the price of a house as a function of its size.

You can do this in linear regression but the way to do it in deep learning is to use a single function called "neuron" that can be used to capture the behavior. The shape of the function here is RELU(Rectified Linear Unit). And all that the neuron does is it inputs the size, computes this linear function, takes a max of zero, and then outputs the estimated price.

So if this is a single neuron, neural network, really a tiny little neural network, a larger neural network is then formed by taking many of the single neurons and stacking them together. So, if you think of this neuron that's being like a single Lego brick, you then get a bigger neural network by stacking together many of these Lego bricks.

An example of how a NN problem looks like.
We give the model inputs and output price Y for some items in training set and all intermediate layers it finds by itself.

The circles in the middle, These are called hidden units in the neural network, that each of them takes its inputs all four input features. So for example, rather than saying this first node represents family size and family size depends only on the features X1 and X2. Instead, we're going to say, well neural network, you decide whatever you want this node to be. And we'll give you all four input features to compute whatever you want.
So we say that layer that this is input layer and this layer in the middle of the neural network are densely connected. Because every input feature is connected to every one of these circles in the middle. And the remarkable thing about neural networks is that, given enough data about x and y, given enough training examples with both x and y, neural networks are remarkably good at figuring out functions that accurately map from x to y.

NN are highly successful for supervised learning usecases.

### Applications of Neural Networks

A lot of the value creation through neural networks has been through cleverly selecting what should be x and what should be y for your particular problem, and then fitting this supervised learning component into often a bigger system such as an autonomous vehicle. It turns out that slightly different types of neural networks are useful for different applications. For example, in the real estate application that we saw in the previous video, we use a universally standard neural network architecture, right? Maybe for real estate and online advertising might be a relatively standard neural network, like the one that we saw.
For image applications we'll often use convolutional neural networks, often abbreviated CNN. And for sequence data. So for example, audio has a temporal component, right? Audio is played out over time, so audio is most naturally represented as a one-dimensional time series or as a one-dimensional temporal sequence. And so for sequence data, you often use an RNN, a recurrent neural network. Language, English and Chinese, the alphabets or the words come one at a time. So language is also most naturally represented as sequence data. And so more complex versions of RNNs are often used for these applications.

And then, for more complex applications, like autonomous driving, where you have an image, that might suggest more of a CNN, convolution neural network, structure and radar info which is something quite different. You might end up with a more custom, or some more complex, hybrid neural network architecture.

There is structured data(databases) and unstructured data(pixel values or individual words). Deep learning is good at unstructured data.

### Scale Drives Deep learning Progress

If you want to hit this very high level of performance then you need two things first:

- Lot of data (both X and labelled data Y)

- size of the neural network, meaning just a new network, a lot of hidden units, a lot of parameters, a lot of connections In fact, today one of the most reliable ways to get better performance in a neural network is often to either train a bigger network or throw more data at it. However that only works up to a point because eventually you run out of data or eventually then your network is so big that it takes too long to train.

Sometimes for small training datasets it is quite possible doing better feature engineering can lead to better results. And even SVM can perform better than a neural network with better-engineered features.

- Algorithmic innovations like switching from Sigmoid to RELU have sped up gradient descent which in turn has reduced time to train neural networks.

- Faster GPU and hardware have also accerated the DL.

- Finally, we can better experiment because of the model training speed.
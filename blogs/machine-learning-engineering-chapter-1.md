# Machine Learning Engineering by Andriy Burkov: Chapter 1 Notes

**Published:** July 13, 2024

Machine learning can also be defined as the process of solving a practical problem by,
1) collecting a dataset, and
2) algorithmically training a statistical model based on that dataset

Learning can be supervised, semi-supervised, unsupervised, and reinforcement.

### **Supervised Learning**

In supervised learning the data analyst works with collection of labelled examples and {$(x_1,y_1),(x_2,y_2)$…}
Each element $x_i$ among N is called a feature vector.
In supervised learning, the problem of predicting a class is called classification, while the problem of predicting a real number is called regression. The value that has to be predicted by a supervised model is called a target.

A feature vector is a vector in which each dimension j from 1 to D contains a value that
describes the example. Each such value is called a feature and is denoted as $x^j$

### Unsupervised Learning

In unsupervised learning the data analyst works with collection of unlabelled examples and {$x_1,x_2…$}
Again, x is a feature vector, and the goal of an unsupervised learning algorithm
is to create a model that takes a feature vector x as input and either transforms it into another vector or into a value that can be used to solve a practical problem
For example, in clustering, the model returns the ID of the cluster for each feature vector in the dataset. Clustering is useful for finding groups of similar objects in a large collection of objects, such as images or text documents

- Clustering is useful for finding groups of similar objects in a large collection of objects, such as images or text document

- In dimensionality reduction, the model’s output is a feature vector with fewer dimensions than the input.

- In outlier detection, the output is a real number that indicates how the input feature vector is different from a “typical” example in the dataset

### Reinforcement learning

Reinforcement learning is a subfield of machine learning where the machine (called an agent) “lives’ ’ in an environment and is capable of perceiving the state of that environment as a vector of features. The machine can execute actions in non-terminal states.
Different actions bring different rewards and could also move the machine to another state of the environment. A common goal of a reinforcement learning algorithm is to learn an optimal policy.

An optimal policy is a function (similar to the model in supervised learning) that takes the feature vector of a state as input and outputs an optimal action to execute in that state. The action is optimal if it maximizes the expected average long-term reward.
Reinforcement learning solves a particular problem where decision making is sequential, and the goal is long-term, such as game playing, robotics, resource management, or logistics

### Terminologies

#### Data used directly or indirectly

Data can be used directly or indirectly. Directly-used data is a basis for forming a dataset of examples. Indirectly-used data is used to enrich those examples

For eg if we want to create a NER system, the collection of word sequences is the data used toform training examples directly, while the data contained in dictionaries, lookup tables, and gazetteers is used indirectly: we can use it to extend feature vectors with additional features, but we cannot use it to create new feature vectors.

#### Raw vs Tidy Data

Raw data is a collection of entities in their natural form; they cannot always be directly employable for machine learning. For instance, a Word document or a JPEG file are pieces of raw data; they cannot be directly used by a machine learning algorithm.
tidy dataset can be seen as a spreadsheet where each row is an example, and each column is one of the properties of an example. In addition to being tidy, most machine learning algorithms require numerical data, as opposed
to categorical. Feature engineering is the process of transforming data into a form that machine learning algorithms can use.

#### Training and holdout sets

the first thing you do in your machine learning project is shuffle the examples and split the dataset into three
distinct sets:
1) training
2) validation, and
3) test

The training set is usually the biggest one; the learning algorithm uses the training set to produce the model.

The validation and test sets are roughly the same size, much smaller than the size of the training set. The learning
algorithm is not allowed to use examples from the validation or test sets to train the model. That is why those two sets are also called holdout sets.

The use of test set is to make sure the learning algorithm doesn't memorize the training examples and then uses that "memory" to predict the labels of an unseen input.

We need two holdout sets and not one because we use the validation set to
1) choose the learning algorithm, and
2) find the best configuration values for that learning algorithm(known as hyperparameters). We use the test set to assess the model before delivering it to the client or putting it in production.

#### Baseline

In machine learning, a baseline is a simple algorithm for solving a problem, usually based on a heuristic, simple summary statistics, randomization, or very basic machine learning algorithm.

#### ML pipeline

In practice, machine learning is implemented as a pipeline that contains chained stages of data transformation, from data partitioning to missing-data imputation, to class imbalance and dimensionality reduction, to model training.

The hyperparameters of the entire pipeline are usually optimized; the entire pipeline can be deployed and used for predictions.

#### Parameters vs Hyperparameters

Hyperparameters are inputs of machine learning algorithms or pipelines that influence the performance of the model. They don’t belong to the training data and cannot be learned from it.
For example, the maximum depth of the tree in the decision tree learning algorithm, the misclassification penalty in support vector machines, k in the k-nearest neighbors algorithm, the target dimensionality in dimensionality reduction, and the choice of
the missing data imputation technique are all examples of hyperparameters.

Parameters, on the other hand, are variables that define the model trained by the learning algorithm. Parameters are directly modified by the learning algorithm based on the training data. The goal of learning is to find such values of parameters that make the model optimal in a certain sense.

Examples of parameters are w and b in the equation of linear regression

$y=wx+b$
. In this equation,$x$ is the input of the model, and $y$ is its output (the prediction)

#### Shallow vs Deep learning

A shallow learning algorithm learns the parameters of the model directly from the features of the training examples. Most machine learning algorithms are shallow.
The notorious exceptions are neural network learning algorithms, specifically those that build neural networks with more than one layer between input and output. Such neural networks are called deep neural networks. In deep networks most model parameters are learned not directly from the features of training examples but from outputs of preceding layers.

#### Training Vs Scoring

When we apply a ML algorithm to a dataset in order to obtain a model, we talk about model training or simply training. When we apply a trained model to an input example, (or sometimes a sequence of examples) in order to obtain a prediction (or predictions) to somehow transform an input we talk about scoring.

#### Model based vs Instance based learning

Most supervised learning algorithms are model based. A typical model is a support vector machine(SVM). Model based learning algorithms use the training data to create a model with parameters learned from training data. In SVM, the two parameters are w(a vector) and b(a real number). After the model is trained it can be saved on disk while the training data can be discarded.

Instance-based learning algorithms use the whole dataset as the model. One instance- based algorithm frequently used in practice is k-Nearest Neighbors (kNN). In classification, to predict a label for an input example, the kNN algorithm looks at the close neighborhood of the input example in the space of feature vectors and outputs the label that it saw most
often in this close neighborhood

#### When to use or not use ML model

You should consider using machine learning to solve a business problem when the problem is
too complex for coding, the problem is constantly changing, it is a perceptive problem, it is
an unstudied phenomenon, the problem has a simple objective, and it is cost-effective.

There are many situations when machine learning should, probably, not be used: when
explainability is needed, when errors are intolerable, when traditional software engineering
is a less expensive option, when all inputs and outputs can be enumerated and saved in a
database, and when data is hard to get or too expensive.

#### What is ML engg

Machine learning engineering (MLE) is the use of scientific principles, tools, and techniques of machine learning and traditional software engineering to design and build complex computing systems. MLE encompasses all stages from data collection, to model training, to making the model available for use by the product or the consumers.

A machine learning project life cycle consists of the following stages:
1) goal definition,
2) data collection and preparation,
3) feature engineering,
4) model training,
5) model evaluation,
6) model deployment,
7) model serving,
8) model monitoring,
9) model maintenance
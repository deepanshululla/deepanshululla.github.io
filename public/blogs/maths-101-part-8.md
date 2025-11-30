# Maths 101: Part 8: Hypothesis testing

**Published:** 2019-06-29

## 
## Hypothesis Testing

Hypothesis tests, also called significance tests, are ubiquitous in the traditional statistical analysis of published research. Their purpose is to help you learn whether random chance might be responsible for an observed effect.

### **KEY TERMS**
#### **Null hypothesis**
The hypothesis that chance is to blame.

#### **Alternative hypothesis**
The counterpoint to the null hypothesis (what you hope to prove).

#### **One-way test**
Hypothesis test that counts chance results only in one direction.

#### **Two-way test**
Hypothesis test that counts chance results in two directions.

#### **Example of how we do hypothesis testing**
Suppose we need to compare two classes of students whose heights are given. The problem we are trying to solve is to find out which class has a higher height. To do that what we do is

Step1: Define a parameter for measurement.
For eg, in this case, we took mean which is our test statistic. Let's say the mean of the two classes are µ2 and µ.

We can say if µ2 > µ1 the heights of class2 students are more. By calculating the means of those samples we find that µ2 - µ1 = 10cm. Now, this is the ground truth.

Step 2: We define a null hypothesis
We call it H0. We define the hypothesis that "there is no difference in the class heights".

Step 3: Find out the p-value which is the probability that µ2 - µ1 >=10cm given H0.
If p>0.9 we can say that our null hypothesis is acceptable if it is lower something like 0.05(lower than 5%) we can reject the hypothesis.

#### How to calculate the p-value for hypothesis testing

Step 1: Combine the 50 samples from class 1 and class 2 into one bigger sample of 100 samples.

Step 2: Now from these 100 samples, we randomly distribute the entire data into two subsets each with 50 elements.

**Since we have chosen both of the subsets randomly there should not be any difference in the class sizes of the two subsets.**

Lets µ1,µ2 be the means of those random subsets we just found.

Let µ2 - µ1=δ1

Step 3: We repeat the process several times(let's say k=10000 times). Now we find out deltas for each of the times.

We repeat this experiment k times. This gives us a set of k δ's

{δ1,δ2,δ3,...δk}

Then we sort those deltas.

{δ'1,δ'2,δ'3,...δ'k}

such that δ'1<δ'2<δ'3<...δ'k

Step 4: We find out where our difference of 10cm lie in those deltas

Let's say k=10000, In this example, let's say 10cm lies at 8001 points after sorting. Hence we can say there are 2000 deltas>10cm.

So the probability of µ2-µ1>=10cm given that there is no difference in class heights is 2000/10000=0.2 which is 20% which indicates our hypothesis is acceptable.

### **How do we choose our hypothesis**
We choose hypothesis in such a way that it is easier to simulate

#### Hypothesis Testing: Coin Toss Example

Suppose we are testing a hypothesis for coin toss example. Our task is to find out if the coin is biased towards heads or not.

Step 1:

Design our experiment: To test it we flip the coin 5 times and we count the number of heads.

This count of heads we are defining is called the test statistic. Our observation lets say here is 5 Heads in 5 coin tosses.

Step 2:

We define our null hypothesis as the coin is not biased towards the head. Here are observations are X=5 and the assumption here is coin is not biased towards heads

P(observation/null-hypothesis) = P((X=5)/(coin is not biased towards heads))

Step 3:

So we find the probability of 5 heads in a row is 3%. This probability is also called the p-value.

P(X=5/H0) = 1/(2^5) = 1/32 =0.03 = 3%

P(X=1)= P(heads) = 0.5

This means there is a 3% chance of getting 5 heads in 5 throws if the coin is not biased towards heads.

P((observation by experiment)/assumption) =0.03 (or 3%)

Since it is so small we can say our assumption that the coin is biased is not true and we can comfortably reject the hypothesis.

Since the p-value is so low (less than 5%) we can reject the hypothesis

All images are subject to copyright to their respective authors.
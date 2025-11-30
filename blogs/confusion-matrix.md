# Confusion Matrix

**Published:** 2019-07-27

## Confusion Matrix

Confusion Matrix is a group or matrix of metrics in supervised learning scenarios which determine how good a model is in predictions.

Lets consider a binary classifier with results 1 or 0.

A confusion matrix here will be a 2x2 matrix where along one axis you have actual values and along an orthrogonal axis you have predicted values.

Let's define some keyterms here 

**True positive (TP)**

The actual number of positives in the dataset.

**True negative (TN)**

The actual number of negatives in the dataset.

**False positive (FP)**

Is a situation where the actual value is negative but our predicted result is positive. It is sort of like a false alarm

**false negative (FN)**

is a situation where the actual value is positive but our model predicted it as negative.

Lets take an example from our favorite TV series, Silicon Valley

So Jian Yang's app is an example of binary classifier. It predicts whether an item is hotdog or not.

Here True positive will be the number of times the app correctly predicts hotdog and it is actually an hotdog.

True negative will be when it predicts it is not an hotdog and it is actually not a hotdog.

False Positive will be when it predicts something which is not an hotdog like pizza, but it actually was hotdog.

False negative will be when it incorrectly predicts something as hotdog when it was not a hotdog.

### Multiclass Classifier

Lets say in a hypothetical universe where Jian yang pursued his idea(sorry about the spoilers) and decided hotdog and not hotdog app is not good enough but he should also support other food items.

Like if it is pizza or not, pasta or not and so on.

Now this would be an example of multiclass classifier and its confusion matrix would look something like this.

The elements along the diagonal are values which were predicted correctly.

The diagonal is called principal diagonal and The elements along this diagonal are called principal diagonal elements. The other elements are called off diagonal elements.

For our classifier to do well, principal diagonal elements should be higher.

### TPR, TNR, Recall, FNR, FPR

Lets define some more keyterms here

However for our usecase these 6 terms are specifically important

**True Positive Rate**

The percentange of correctly predicted postives over total positives.

**True Negative Rate**

The percentange of correctly predicted negatives over total negatives.

**False Positive Rate**

The percentange of incorrectly predicted postives(false positives) over total negatives.

**False Negative Rate**

The percentange of incorrectly predicted negatives(false negatives) over total positives.

**Precision**

The percentage of true positives over the sum of predicted positives and false positives. Basically, finding out, of all the points that were predicted positive, how many were actually positive.

**Recall**

The percentage of true positives over actual positives. Of all the actually positive points, how many were predicted positive.

In our example of Hotdog or not, let's say Jian Yang took 1000 samples.

  
    Actual Values ↓
    Predictions→
    Predicted Hotdog
    Predicted Not hotdog
    Total
  
  
    
    
    
    
    
  
  
    Hotdog
    
    750(True Positive)
    80(False Negative)
    830
  
  
    Not Hotdog
    
    20(False Positive)
    150(True Negative)
    170
  
  
    Total
    
    770
    230
    
  

In this example,

RationTPR = 750/(750+80) = 750/830FNR = 80/(750+80) = 80/830TNR = 150/(150+20) = 150/170FPR = 20/(150+20) = 20/170Precision = 750/(750+20) = 750/770Recall = 750/(750+80) = 750/830

These are the mostly important keyterms and we can make similar calculations for others.

### Importance of different metrics

So out of TPR, FNR, TNR and FPR which of the metrics is more important.

The answer is it depends on the domain.

For eg if we are talking about cancer prediction, it is very important that we don't miss a possibly cancerous patient.

Hence we need TPR to be high and FNR to be low. We want to really reduce false negatives and hence FNR which would mean we don't want to miss on a patient which could have cancer.

However we are sort of okay here with high false positives which mean we detected cancer but the patient didn't have cancer. In that case we will have to say the patient must undergo more tests.

In hotdog or not example, we would want higher TPR and higher TNR which means we want to minimize both false positives and false negatives.

### F1 score

Both precision and recall lie between 0 and 1. Another thing here to note is both precision and recall care entirely about the positive class.

We also want both precision and recall to be high.

F1 score is the harmonic mean of precision and recall.

F1 = 2*((P*R)/P+R)
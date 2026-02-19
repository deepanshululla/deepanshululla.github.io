# Logarithmic loss (or cross-entropy)

**Published:** 2019-08-25

![Cross-entropy and loss functions](https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop&q=80)

Logarithmic loss (or cross-entropy) measures the performance of a classification model where the prediction input is a probability value between 0 and 1.

The goal of our machine learning models is to minimize this value. It is also heavily used in Kaggle competitions to estimate the score of submissions.

A perfect model would have a log loss of 0. Log loss increases as the predicted probability diverge from the actual label. So predicting a probability of .012 when the actual observation label is 1 would be bad and result in a high log loss.

```mermaid
graph TD
    A[Model Output: Predicted Probability] --> B{Actual Label}
    B -->|y = 1| C["-log of predicted prob"]
    B -->|y = 0| D["-log of 1 minus predicted prob"]
    C --> E[High prob = Low loss]
    C --> F[Low prob = High loss]
    D --> G[Low prob = Low loss]
    D --> H[High prob = High loss]
    E --> I[Average over all samples]
    F --> I
    G --> I
    H --> I
    I --> J[Log Loss Value]
    style E fill:#90EE90
    style G fill:#90EE90
    style F fill:#FF6B6B
    style H fill:#FF6B6B
```

We compute log loss by this formula for binary classifiers:

Lets take an example

x(Input)y(Actual label)y^(Prediction or probability of class label=1)x110.95x200.91x310.87x410.65x500.7

log loss = -[(log(0.95) + log(0.09)+log(0.87)+log(0.65)+log(0.3))]/5

Log loss can be defined as average negative log of probability of correct clas label.

here is a plot of -log(x)

As we can see form above figure, the  smaller the log loss, the better it is. 

```mermaid
graph LR
    A[Prediction: 0.95] -->|Actual: 1| B["Loss = -log 0.95 = 0.05"]
    C[Prediction: 0.5] -->|Actual: 1| D["Loss = -log 0.5 = 0.69"]
    E[Prediction: 0.01] -->|Actual: 1| F["Loss = -log 0.01 = 4.6"]
    style B fill:#90EE90
    style D fill:#FFD700
    style F fill:#FF6B6B
```

### Multiclass Log loss

The formula we discussed above only holds for binary classifiers. For multiclass log loss estimation we use:
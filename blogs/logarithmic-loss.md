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

Here is how to compute log loss both manually and with scikit-learn:

```python
import numpy as np
from sklearn.metrics import log_loss

y_actual = np.array([1, 0, 1, 1, 0])
y_probs  = np.array([0.95, 0.91, 0.87, 0.65, 0.7])

# Manual computation
# For each sample: -[y*log(p) + (1-y)*log(1-p)]
losses = -(y_actual * np.log(y_probs) + (1 - y_actual) * np.log(1 - y_probs))
manual_log_loss = np.mean(losses)
print(f"Manual log loss: {manual_log_loss:.4f}")

# Using sklearn (produces the same result)
sklearn_log_loss = log_loss(y_actual, y_probs)
print(f"Sklearn log loss: {sklearn_log_loss:.4f}")
```

### Multiclass Log loss

The formula we discussed above only holds for binary classifiers. For multiclass log loss estimation we use:

Here is multiclass log loss computation in Python:

```python
import numpy as np
from sklearn.metrics import log_loss

# Three classes: 0, 1, 2
y_actual = [0, 1, 2, 1, 0]
# Predicted probability for each class per sample
y_probs = [
    [0.85, 0.10, 0.05],
    [0.05, 0.90, 0.05],
    [0.10, 0.20, 0.70],
    [0.15, 0.60, 0.25],
    [0.70, 0.20, 0.10],
]

loss = log_loss(y_actual, y_probs)
print(f"Multiclass log loss: {loss:.4f}")
```
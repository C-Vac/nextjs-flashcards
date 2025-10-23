# Machine Learning Fundamentals

1. Supervised learning
   - Teaching an AI Model how to process data with structured inputs and outputs
   - Learning by example, with the answers provided
   - Then, model makes predictions based on learned data associations

    regression / classification

### regression

- continuous data, somewhere in a spread of possibilities

- linear regression

### classification

- discrete data, ie X or Y, booleans, etc
- logistic regression
- 

ensemble learning

- multilple models together

quick rundown:
it's all about building models that can learn from data and make predictions

supervised learning - labeled data
regression predicts numbers
classification predicts categories
linear regression for structured data
neural nets for intricate patterns
CNN for images
margin in SDMs is safe zone between different groups
back propagation: how neural net learns from its mistakes


time series analysis

all about understanding patterns and zones
how data changes over time

trend, cyclical, and noise patterns

---

Grug brain need know many things for big test! Need cram fast!

**Supervised Learning:**
- Predict output Y from input X.
- Regression: Y continuous (like house price).
- Classification: Y discrete (like spam or not).

**Linear Regression:**
- Hypothesis: Predict Y with straight line.
- Need learn parameters (weights).
- Cost function (MSE): How wrong prediction is.
- Gradient Descent: Way to find best weights.
- Normal Equation: Fast way for small data. Bad for big data.
- Bad for classification (output not 0 or 1).

**Logistic Regression:**
- Predict probability (0 to 1) for classes.
- Sigmoid function makes probability.
- Maximize likelihood to train.
- Gradient ascent to find best weights.
- Softmax for many classes.

**Support Vector Machines (SVMs):**
- Good for non-straight line problems.
- Kernel trick: Make data easy to split.
- Maximize margin between classes.
- Regularization (C): Balance good line and few mistakes.

**Model Evaluation:**
- Confusion Matrix: Show right and wrong guesses.
- TP, TN, FP, FN: Know what these mean.
- Accuracy: How many correct.
- Precision: Of guesses positive, how many right.
- Recall: Of actual positive, how many guessed right.
- F1 Score: Balance of precision and recall.
- Regression metrics: MSE, RMSE, MAE, R2. R2 can be bad if overfit.

**Multi-Layer Perceptrons (MLPs):**
- Neural network with layers.
- Backpropagation: Way to learn weights.
- Can learn hard problems.

**Convolutional Neural Networks (CNNs):**
- Good for images.
- Convolution layers find features.
- Pooling layers make smaller.
- Fully connected layers classify.
- Object detection (find where objects are). R-CNN, YOLO.
- Semantic segmentation (label every pixel). FCN.

**Transfer Learning and Fine-Tuning:**
- Use old learned brain for new problem.
- Fine-tune: Train old brain a little on new data.

**Data Analysis and Preparation:**
- Need clean data for good learn.
- Handle missing data.
- Manage outliers (weird data).
- Balance classes if one has too little.
- Augment data: Make more data from what you have.

**Time Series Analysis:**
- Data over time.
- Trend, Seasonality, Noise.
- ACF and PACF help choose model.
- ARMA, ARIMA, SARIMAX (old ways).
- RNN, LSTM, GRU (new brain ways).

**Decision Trees:**
- Make decisions like flow chart.
- Choose best split with Gini, Entropy.
- Can overfit (learn too well).

**Ensemble Learning:**
- Use many small brains to make big brain.
- Bagging: Train many trees on parts of data. Random Forest is bagging with random features.
- Boosting: Train trees that fix old tree mistakes. AdaBoost, Gradient Boosting.

**Principal Component Analysis (PCA):**
- Make data smaller but keep important stuff.
- Find directions of most change (principal components).

Grug think this all important for good grade C! Good luck Grug!


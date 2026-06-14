# model_train.py
import pandas as pd
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier, plot_importance
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, roc_auc_score
import joblib
df = pd.read_csv("phishing_dataset.csv")  # add this line
X = df.drop(["url", "label", "dom","has_ip"], axis=1)
y = df["label"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
neg = (y_train == 0).sum()
pos = (y_train == 1).sum()
model = XGBClassifier(n_estimators=300, max_depth=5, learning_rate=0.08,
                      subsample=0.8, colsample_bytree=0.8,
                      eval_metric="logloss", random_state=42,
                      scale_pos_weight=neg/pos)
model.fit(X_train, y_train)
y_pred   = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy}")
# Save model — add this if not already done
joblib.dump(model, "phishing_model.pkl")
print("Model saved.")
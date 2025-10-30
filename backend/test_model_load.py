import joblib
import warnings
from sklearn.exceptions import InconsistentVersionWarning
warnings.filterwarnings("ignore", category=InconsistentVersionWarning)

model = joblib.load("toxic_comment_model.pkl")
vectorizer = joblib.load("tfidf_vectorizer.pkl")

sample = ["you are an idiot"]
features = vectorizer.transform(sample)
pred = model.predict_proba(features)[0][1]
print("Prediction Score:", pred)

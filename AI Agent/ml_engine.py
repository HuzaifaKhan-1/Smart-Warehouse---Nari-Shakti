import joblib
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

clf_model = joblib.load(os.path.join(BASE_DIR, "models/xgboost_spoilage_model.pkl"))
reg_model = joblib.load(os.path.join(BASE_DIR, "models/remaining_life_model.pkl"))

produce_encoder = joblib.load(os.path.join(BASE_DIR, "models/produce_encoder.pkl"))
target_encoder = joblib.load(os.path.join(BASE_DIR, "models/target_encoder.pkl"))


def predict_batch(temp, humidity, days, produce_type):

    produce_encoded = produce_encoder.transform([produce_type])[0]

    interaction = temp * humidity

    features = np.array([[temp, humidity, days, produce_encoded, interaction]])

    # ML Predictions
    risk_pred = clf_model.predict(features)[0]
    risk_label = target_encoder.inverse_transform([risk_pred])[0]

    remaining_days = max(0, float(reg_model.predict(features)[0]))

    return risk_label, round(remaining_days, 2)
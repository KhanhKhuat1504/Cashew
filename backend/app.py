from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS

# Paths to the saved model and scaler
MODEL_PATH = "./model.joblib"  # Update path
SCALER_PATH = "./scaler.pkl"  # Update path

# Load the model and scaler
model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

# Define label mapping
label_mapping = ["ADL", "Near Fall", "Fall"]


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        accelerometer = data.get("accelerometer", {})
        gyroscope = data.get("gyroscope", {})

        # Extract features
        features = [
            accelerometer.get("x", 0),
            accelerometer.get("y", 0),
            accelerometer.get("z", 0),
            gyroscope.get("x", 0),
            gyroscope.get("y", 0),
            gyroscope.get("z", 0),
        ]

        # Convert to NumPy array and reshape
        features_np = np.array(features).reshape(1, -1)

        # Scale features
        features_scaled = scaler.transform(features_np)

        # Make prediction
        prediction = model.predict(features_scaled)[0]

        # Map prediction to label
        if prediction < 0 or prediction >= len(label_mapping):
            predicted_activity = "Unknown"
            fall_detected = False
        else:
            predicted_activity = label_mapping[prediction]
            fall_detected = predicted_activity == "Fall"

        return jsonify(
            {"fall_detected": fall_detected, "predicted_activity": predicted_activity}
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

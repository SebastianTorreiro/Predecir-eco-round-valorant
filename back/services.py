import os
import pickle
import numpy as np

# Place your actual trained model files (.pkl, .joblib, etc.) in the backend folder
MODEL_PATH = os.path.join(os.path.dirname(__file__), "linear_regression_model.pkl")

class PredictionService:
    def __init__(self):
        self.model = None
        self.load_model()

    def load_model(self):
        """
        Loads the pre-trained linear regression model.
        If the model file does not exist, it falls back to a mock prediction.
        """
        if os.path.exists(MODEL_PATH):
            try:
                with open(MODEL_PATH, "rb") as f:
                    self.model = pickle.load(f)
                print("Model loaded successfully.")
            except Exception as e:
                print(f"Error loading model from {MODEL_PATH}: {e}")
                self.model = None
        else:
            print(f"Model file not found at {MODEL_PATH}. Using mock regression mode.")
            self.model = None

    def predict(self, team_credits: float, first_blood_time: float) -> float:
        """
        Runs the linear regression model prediction.
        Replace this placeholder logic with your actual model inference.
        """
        if self.model is not None:
            # Example using a scikit-learn model:
            # features = np.array([[team_credits, first_blood_time]])
            # return float(self.model.predict(features)[0])
            pass

        # --- MOCK LINEAR REGRESSION PLACEHOLDER ---
        # e.g., prediction = intercept + coef1 * team_credits + coef2 * first_blood_time
        # Let's say: base eco round win probability (or rating) starts at 0.1
        # Each credit increases it, first blood time (in seconds) affects it negatively or positively.
        intercept = 10.0
        coef_credits = 0.002
        coef_time = -0.05
        
        prediction = intercept + (coef_credits * team_credits) + (coef_time * first_blood_time)
        return float(prediction)

# Single instance to be used across the application
prediction_service = PredictionService()

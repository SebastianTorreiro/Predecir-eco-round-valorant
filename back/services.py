import os
import pickle
import numpy as np

from schemas import EcoRoundInput, EcoRoundOutput

MODEL_PATH = os.path.join(os.path.dirname(__file__), "modelo_entrenado.pkl")

class PredictionService:
    def __init__(self):
        self.model = None
        self.load_model()

    def load_model(self):
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

    def predict_economy_round(self, datos: EcoRoundInput) -> EcoRoundOutput:
        if self.model is None:
           return EcoRoundOutput(prediction=1, probability=0.5)
        
        features = np.array([[datos.team_credits, datos.first_blood_time]])
        prediccion = int(self.model.predict(features)[0])
        probability = float(self.model.predict_proba(features)[0][1])
        return EcoRoundOutput(prediction=prediccion, probability=probability)

prediction_service = PredictionService()

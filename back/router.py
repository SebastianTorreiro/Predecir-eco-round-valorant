from fastapi import APIRouter, HTTPException
from .schemas import PredictionInput, PredictionOutput
from .services import prediction_service

router = APIRouter(
    prefix="/predict",
    tags=["Prediction"]
)

@router.post("/", response_model=PredictionOutput)
def predict_eco_round(data: PredictionInput):
    """
    Receives prediction inputs (team_credits and first_blood_time),
    validates them, passes them to the linear regression model service,
    and returns the prediction result.
    """
    try:
        prediction_value = prediction_service.predict(
            team_credits=data.team_credits,
            first_blood_time=data.first_blood_time
        )
        return PredictionOutput(prediction=prediction_value)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during prediction: {str(e)}"
        )

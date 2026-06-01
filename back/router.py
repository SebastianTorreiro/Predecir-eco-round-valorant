from fastapi import APIRouter, HTTPException
from schemas import EcoRoundInput, EcoRoundOutput
from services import prediction_service

router = APIRouter(
    prefix="/predict",
    tags=["Prediction"]
)

@router.post("/", response_model=EcoRoundOutput)
def predict_eco_round(data: EcoRoundInput):

    try:
        prediction_value = prediction_service.predict_economy_round(data)
        return EcoRoundOutput(prediction=prediction_value.prediction, probability=prediction_value.probability)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during prediction: {str(e)}"
        )

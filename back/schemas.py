from pydantic import BaseModel, ConfigDict, Field, StrictFloat

class EcoRoundInput(BaseModel):

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "team_credits": 3000,
                "first_blood_time": 10.2
            }
        }
    )
    team_credits: StrictFloat = Field(
        description="Current credits of the team. Must be non-negative and at most 45,000.",
        ge=0,
        le=45000 
    )
    first_blood_time: StrictFloat = Field(
        description="Time of the first blood in seconds. Must be non-negative and at most 100.",
        ge=0,
        le=100
    )

class EcoRoundOutput(BaseModel):
    prediction: int = Field(
        description="Predicted value of the logistic regression model."
    )
    probability: float = Field(
        description="Probability of winning the round."
    )
        

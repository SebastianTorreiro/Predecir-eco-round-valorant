from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from router import router as predict_router

app = FastAPI(
    title="Valorant Eco Round Prediction API",
    description="Backend API for predicting Valorant eco round outcomes using linear regression.",
    version="1.0.0"
)

# Configure CORS so the frontend can interact with this API.
# In production, specify actual allowed origins instead of ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the prediction router
app.include_router(predict_router)

@app.get("/")
def read_root():
    return {
        "message": "Valorant Eco Round Prediction API is running.",
        "docs_url": "/docs"
    }

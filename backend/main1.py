from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from farmer_ai_api import router as farmer_router
from ml_service import get_dashboard_stats, predict_price, predict_spoilage, get_warehouse_recommendations, get_all_warehouses_formatted
from pydantic import BaseModel

# Create FastAPI app
app = FastAPI()

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register AI router
app.include_router(farmer_router)

class BatchRiskInput(BaseModel):
    temperature: float
    humidity: float
    storage_days: int

@app.get("/")
def home():
    return {"message": "AgriFresh AI Backend Running"}

@app.get("/dashboard-summary")
def dashboard_summary():
    """
    Returns high-level stats for the dashboard.
    """
    return get_dashboard_stats()

@app.get("/price-predict")
def price_predict(crop: str = Query(..., description="Crop name for price prediction")):
    """
    Returns predicted market price for a crop.
    """
    price = predict_price(crop)
    return {"crop": crop, "predicted_price": price}

@app.post("/batch-risk")
def batch_risk(data: BatchRiskInput):
    """
    Predicts spoilage risk for a batch.
    """
    risk_percentage = predict_spoilage(data.temperature, data.humidity, data.storage_days)
    return {"spoilage_risk_percentage": risk_percentage}

@app.get("/warehouse-recommend")
def warehouse_recommend(lat: float, lon: float, crop: str):
    """
    Returns AI-recommended warehouses based on proximity, price, vacancy, and risk.
    """
    recommendations = get_warehouse_recommendations(lat, lon, crop)
    return recommendations

@app.get("/warehouses")
def get_warehouses():
    """
    Returns all warehouses with full data for the finder page.
    """
    return get_all_warehouses_formatted()
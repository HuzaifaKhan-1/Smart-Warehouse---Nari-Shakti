from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from farmer_ai_api import router as farmer_router
from ml_service import (
    get_dashboard_stats,
    predict_price,
    predict_spoilage,
    get_warehouse_recommendations,
    get_all_warehouses_formatted
)

app = FastAPI(title="Smart Warehouse Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register farmer AI router
app.include_router(farmer_router)


class BatchRiskInput(BaseModel):
    temperature: float
    humidity: float
    storage_days: int


@app.get("/")
def home():
    return {"message": "Smart Warehouse AI Backend Running"}


@app.get("/dashboard-summary")
def dashboard_summary():
    return get_dashboard_stats()


@app.get("/price-predict")
def price_predict(crop: str = Query(...)):
    price = predict_price(crop)
    return {"crop": crop, "predicted_price": price}


@app.post("/batch-risk")
def batch_risk(data: BatchRiskInput):
    risk_percentage = predict_spoilage(
        data.temperature,
        data.humidity,
        data.storage_days
    )
    return {"spoilage_risk_percentage": risk_percentage}


@app.get("/warehouse-recommend")
def warehouse_recommend(lat: float, lon: float, crop: str):
    return get_warehouse_recommendations(lat, lon, crop)


@app.get("/warehouses")
def get_warehouses():
    return get_all_warehouses_formatted()
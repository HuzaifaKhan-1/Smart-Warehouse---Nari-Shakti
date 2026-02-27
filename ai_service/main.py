from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
from datetime import datetime

app = FastAPI(title="AgriFresh AI Microservice")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5000",
        "http://127.0.0.1:5000",
        "http://localhost:5500",
        "http://127.0.0.1:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SensorHistory(BaseModel):
    temperature_history: list[float] = []
    humidity_history: list[float] = []
    produce_type: str = ""
    storage_duration_days: int = 0

class SpoilageOutput(BaseModel):
    spoilage_risk: str
    remaining_days: int
    confidence: float

class AnalysisInput(BaseModel):
    batchId: str
    produce: str
    temperature: float
    humidity: float
    storage_days: int

@app.get("/")
def read_root():
    return {"status": "AI Service Online", "engine": "FastAPI v1.0"}

@app.post("/analyze")
def analyze_batch(data: AnalysisInput):
    # Logic to simulate AI analysis based on inputs
    risk = "Low"
    days = 15
    priority = "P3"
    
    # Simple rule-based logic for demo
    if data.temperature > 17 or data.humidity > 70:
        risk = "Moderate"
        days = 7
        priority = "P2"
        action = "Increase Ventilation"
    
    if data.temperature > 20:
        risk = "High"
        days = 2
        priority = "P1"
        action = "Dispatch Immediately"
    elif risk == "Moderate":
        action = "Monitor Closely"
    else:
        action = "Maintain Storage"

    # Specific produce logic
    if data.produce.lower() == "tomato" and data.temperature > 15:
        risk = "High"
        days = 3
        priority = "P1"
        action = "Dispatch to Local Market"

    return {
        "spoilage_risk": risk,
        "remaining_days": days,
        "priority": priority,
        "recommended_action": action,
        "confidence": round(0.88 + random.random() * 0.1, 2)
    }

@app.post("/predict/spoilage", response_model=SpoilageOutput)
def predict_spoilage(data: SensorHistory):
    avg_temp = sum(data.temperature_history) / len(data.temperature_history) if data.temperature_history else 15
    risk = "Low"
    days = 15
    if data.produce_type.lower() == "tomato":
        if avg_temp > 18:
            risk = "High"
            days = 2
        elif avg_temp > 15:
            risk = "Moderate"
            days = 5
    return {
        "spoilage_risk": risk,
        "remaining_days": days,
        "confidence": round(0.85 + random.random() * 0.1, 2)
    }

@app.post("/optimize/inventory")
def optimize_inventory(batch_data: dict):
    return {
        "dispatch_batch": batch_data.get("id", "Unknown"),
        "reason": "High spoilage risk detected in history",
        "priority": "P1",
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

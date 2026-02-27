from fastapi import FastAPI
from pydantic import BaseModel
import random
from datetime import datetime

app = FastAPI(title="AgriFresh AI Microservice")

class SensorHistory(BaseModel):
    temperature_history: list[float]
    humidity_history: list[float]
    produce_type: str
    storage_duration_days: int

class SpoilageOutput(BaseModel):
    spoilage_risk: str
    remaining_days: int
    confidence: float

@app.get("/")
def read_root():
    return {"status": "AI Service Online", "engine": "FastAPI v1.0"}

@app.post("/predict/spoilage", response_model=SpoilageOutput)
def predict_spoilage(data: SensorHistory):
    # Mocked ML Model Logic
    # In production, this would load a joblib/pickle scikit-learn model
    
    avg_temp = sum(data.temperature_history) / len(data.temperature_history) if data.temperature_history else 15
    
    # Rule-based + Random jitter for simulation
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
    # Logic to recommend dispatch priority
    return {
        "dispatch_batch": batch_data.get("id", "Unknown"),
        "reason": "High spoilage risk detected in history",
        "priority": "P1",
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

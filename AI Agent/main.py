from fastapi import FastAPI
from pydantic import BaseModel
from pipeline import analyze_batch

app = FastAPI()

# Define request body structure
class BatchInput(BaseModel):
    produce: str
    temperature: float
    humidity: float
    storage_days: int


@app.post("/analyze")
def analyze(data: BatchInput):
    
    result = analyze_batch(
        temp=data.temperature,
        humidity=data.humidity,
        days=data.storage_days,
        produce=data.produce
    )

    return result
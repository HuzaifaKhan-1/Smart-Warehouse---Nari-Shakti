from fastapi import FastAPI
from pydantic import BaseModel
from pipeline import analyze_batch

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request body structure
class BatchInput(BaseModel):
    produce: str
    temperature: float
    humidity: float
    storage_days: int


@app.post("/api/ai/analyze")
def analyze(data: BatchInput):
    result = analyze_batch(
        temp=data.temperature,
        humidity=data.humidity,
        days=data.storage_days,
        produce=data.produce
    )
    return result




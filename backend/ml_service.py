import pickle
import joblib
import os
import numpy as np
import pandas as pd
import math

# Define paths to models
MODEL_DIR = os.path.join(os.path.dirname(__file__), "Farmer_model")

# Load models and encoder
def load_pkl(filename):
    path = os.path.join(MODEL_DIR, filename)

    if not os.path.exists(path):
        print(f"Model not found: {filename}")
        return None

    try:
        model = joblib.load(path)
        print(f"Loaded model: {filename}")
        return model
    except Exception as e:
        print(f"Failed to load {filename}: {e}")
        return None

print("Loading ML Models for Warehouse Service...")
crop_model = load_pkl("crop_model.pkl")
price_model = load_pkl("price_model.pkl")
spoilage_model = load_pkl("spoilage_model.pkl")
warehouse_model = load_pkl("warehouse_model.pkl")
crop_encoder = load_pkl("crop_encoder.pkl")

# Warehouse Data (Coordinates added for distance calculation)
WAREHOUSES = [
    {"id": 1, "name": "Nashik Central Hub", "city": "Nashik, MH", "lat": 19.99, "lon": 73.78, "vacancy": 21, "base_prices": {"Tomato": 180, "Onion": 140, "Grapes": 220}, "temp": 15.2, "risk": 18},
    {"id": 2, "name": "Pune Agri Storage", "city": "Pune, MH", "lat": 18.52, "lon": 73.85, "vacancy": 54, "base_prices": {"Tomato": 240, "Potato": 210, "Onion": 195}, "temp": 16.8, "risk": 31},
    {"id": 3, "name": "Kolhapur Cold Store", "city": "Kolhapur, MH", "lat": 16.70, "lon": 74.24, "vacancy": 8, "base_prices": {"Grapes": 160, "Tomato": 175, "Potato": 150}, "temp": 12.1, "risk": 9},
    {"id": 4, "name": "Solapur Agri Godown", "city": "Solapur, MH", "lat": 17.65, "lon": 75.90, "vacancy": 72, "base_prices": {"Tomato": 145, "Onion": 130, "Wheat": 110, "Potato": 125}, "temp": 22.4, "risk": 74},
    {"id": 5, "name": "Satara Cold Chain", "city": "Satara, MH", "lat": 17.68, "lon": 73.98, "vacancy": 45, "base_prices": {"Potato": 195, "Tomato": 210, "Onion": 180}, "temp": 14.5, "risk": 22}
]

def calculate_distance(lat1, lon1, lat2, lon2):
    """Haversine formula to calculate distance in km."""
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return round(R * c, 1)

def get_all_warehouses_formatted(farmer_lat=16.85, farmer_lon=74.58):
    """
    Returns all warehouses formatted for the frontend with distance and AI scoring.
    """
    results = []
    for wh in WAREHOUSES:
        dist = calculate_distance(farmer_lat, farmer_lon, wh["lat"], wh["lon"])
        primary_crop = list(wh["base_prices"].keys())[0] if wh["base_prices"] else "Tomato"
        price = wh["base_prices"].get(primary_crop, 200)
        
        # Calculate AI score if model exists
        score = 0.5
        if warehouse_model:
            try:
                score = warehouse_model.predict([[dist, price, wh["vacancy"], wh["risk"]]])[0]
            except:
                pass
        
        results.append({
            "id": wh["id"],
            "name": wh["name"],
            "city": wh["city"].split(",")[0],
            "dist": dist,
            "crop": primary_crop,
            "vacancy": wh["vacancy"],
            "price": price,
            "temp": wh["temp"],
            "tempOk": wh["temp"] < 20,
            "risk": wh["risk"],
            "status": "avail" if wh["vacancy"] > 10 else "filling",
            "zones": [
                {"n": "A1", "s": "avail"},
                {"n": "A2", "s": "avail"},
                {"n": "B1", "s": "filling"}
            ],
            "prices": wh["base_prices"],
            "aiText": f"Optimal warehouse for {primary_crop} storage. AI Suitability: {round(score*100)}%",
            "ai_score": float(score)
        })
    
    # Sort by AI score descending
    results.sort(key=lambda x: x["ai_score"], reverse=True)
    return results

def predict_price(crop_name: str):
    if price_model is None or crop_encoder is None:
        return 180.0
    try:
        encoded_crop = crop_encoder.transform([crop_name])[0]
        prediction = price_model.predict([[encoded_crop]])[0]
        return float(prediction)
    except:
        return 180.0

def predict_spoilage(temperature: float, humidity: float, storage_days: int):
    if spoilage_model is None:
        return 15.0
    try:
        risk = spoilage_model.predict([[temperature, humidity, storage_days]])[0]
        return float(np.clip(risk, 0, 100))
    except:
        return 25.0

def get_warehouse_recommendations(lat, lon, crop):
    # This is similar but specific to a crop and user location
    results = get_all_warehouses_formatted(lat, lon)
    # Filter for crop if needed, or just return top
    return results

def get_dashboard_stats():
    return {
        "active_batches": 2,
        "risk_batches": 1,
        "best_price": 180,
        "field_status": "NORMAL",
        "ai_accuracy": 94
    }

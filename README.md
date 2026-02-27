# AgriFresh – AI Powered Smart Warehouse Intelligence Platform

🎯 **Project Overview**
Build a full-stack, AI-driven, IoT-integrated Smart Agricultural Warehouse Management System designed to reduce post-harvest losses.

## 🚀 Getting Started

### 1. Frontend (Static)
The frontend is built with **Vanilla JavaScript** and **CSS Glassmorphism**.
- Simply open `frontend/index.html` in your browser.
- Use the **Demo Simulation Mode** on the dashboard to trigger AI alerts and temperature spikes.

### 2. Backend (Node.js)
```bash
cd backend
npm install
npm start
```
Endpoints:
- `POST /api/sensor-data`: Ingest IoT telemetry.
- `GET /api/alerts`: Retrieve real-time breach alerts.
- `GET /api/ai/spoilage-risk/:batchId`: Get predictive risk scores.

### 3. AI Microservice (Python/FastAPI)
```bash
cd ai_service
pip install fastapi uvicorn pydantic
python main.py
```
Models:
- **Spoilage Prediction**: Classification based on temp history and crop type.
- **Inventory Optimizer**: Recommends dispatch priority (P1-P3).

## 🛠 Features
- **AI Warehouse Manager**: A conversational agent that interprets sensor data and gives natural language advice.
- **Dynamic Heatmap**: Real-time 2D grid of warehouse zones with risk-based color coding.
- **QR Traceability**: End-to-end farm-to-market journey tracking.
- **Market Intelligence**: Integration of mandi prices for optimal dispatch timing.

## 🎨 UI/UX Design
- **Theme**: High-tech Dark Mode.
- **Aesthetics**: Glassmorphism, Neon Green Accents, Smooth AOS Animations.
- **Mobile Friendly**: Fully responsive layout.

## 🗄 Database
Relational PostgreSQL schema included in `database/schema.sql`. Includes tables for:
- `inventory_batches`
- `sensor_logs`
- `spoilage_predictions`
- `agent_decisions`

---
*Developed for the high-end AgriTech SaaS market.*

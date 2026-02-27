const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock database for demo (until PostgreSQL is connected)
const sensorLogs = [];
const alerts = [];

// IoT Ingestion Endpoint
app.post('/api/sensor-data', (req, res) => {
    const { warehouse_id, zone_id, temperature, humidity, timestamp } = req.body;

    if (!warehouse_id || !zone_id || temperature === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const newData = {
        warehouse_id,
        zone_id,
        temperature,
        humidity,
        timestamp: timestamp || new Date().toISOString()
    };

    sensorLogs.push(newData);

    // Check for breaches
    if (temperature > 18) {
        alerts.push({
            type: 'CRITICAL',
            message: `Temperature spike in Zone ${zone_id}: ${temperature}°C`,
            timestamp: new Date().toISOString()
        });
    }

    res.status(201).json({
        message: "Data logged successfully",
        alert_triggered: temperature > 18
    });
});

// AI Insights Proxy (would connect to FastAPI)
app.get('/api/ai/spoilage-risk/:batchId', async (req, res) => {
    // In real app: fetch from FastAPI
    // For now: Mocked response
    const risk = Math.random() > 0.8 ? "High" : "Low";
    res.json({
        batchId: req.params.batchId,
        spoilage_risk: risk,
        remaining_days: risk === "High" ? 2 : 14,
        confidence: 0.92
    });
});

app.get('/api/alerts', (req, res) => {
    res.json(alerts);
});

app.get('/', (req, res) => {
    res.send('AgriFresh API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

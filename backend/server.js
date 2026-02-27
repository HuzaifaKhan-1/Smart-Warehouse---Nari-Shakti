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

// --- Analytics Endpoints ---

// Section A: Demand vs Supply Forecast
app.get('/api/analytics/demand-supply', (req, res) => {
    res.json({
        weeks: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
        demand: [450, 520, 610, 780, 850, 920, 1050, 1100],
        supply: [400, 480, 550, 600, 720, 800, 850, 900],
        projection: [null, null, null, null, null, null, 1050, 1200], // Last 2 points are projection
        gap_percentage: 12,
        recommendation: "Increase Tomato dispatch prioritization for Week 4 to meet projected 12% demand gap."
    });
});

// Section B: Stock Utilization
app.get('/api/analytics/utilization', (req, res) => {
    res.json({
        total_capacity: 5000,
        used_capacity: 4200,
        remaining_capacity: 800,
        produce: [
            { name: 'Tomato', percentage: 38, value: 1596 },
            { name: 'Onion', percentage: 22, value: 924 },
            { name: 'Potato', percentage: 15, value: 630 },
            { name: 'Grapes', percentage: 10, value: 420 },
            { name: 'Empty Space', percentage: 15, value: 630 }
        ],
        smart_insight: "Tomato occupies 38% of total storage. Consider rebalancing if demand drops."
    });
});

// Section C: Spoilage Risk Distribution
app.get('/api/analytics/risk-distribution', (req, res) => {
    res.json({
        total_batches: 142,
        risk_score_summary: 24,
        distribution: [
            { label: 'Safe', percentage: 72, count: 102 },
            { label: 'Warning', percentage: 14, count: 20 },
            { label: 'High Risk', percentage: 14, count: 20 }
        ],
        insight: "14% of batches are in high-risk category. AI recommends dispatch within 48 hours."
    });
});

// Section D: AI Model Performance
app.get('/api/analytics/model-performance', (req, res) => {
    res.json({
        spoilage_model: {
            accuracy: 96,
            precision: 94,
            recall: 92,
            f1_score: 93,
            false_positive: 2,
            false_negative: 4
        },
        optimization_model: {
            accuracy: 92,
            loss_reduction: 28,
            dispatch_efficiency: 89
        },
        confusion_matrix: {
            tp: 85, fp: 5,
            fn: 8, tn: 92
        }
    });
});

// Section E: Loss Reduction Over Time
app.get('/api/analytics/loss-reduction', (req, res) => {
    res.json({
        months: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
        before_ai: [150000, 165000, 145000, 170000, 160000, 155000],
        after_ai: [150000, 140000, 110000, 95000, 80000, 72000],
        revenue_preserved: [0, 25000, 35000, 75000, 80000, 83000],
        metrics: {
            total_loss_prevented: 298000,
            percentage_reduction: 53.5,
            tons_saved: 42.8,
            co2_reduction: 12.4
        }
    });
});

app.get('/', (req, res) => {
    res.send('AgriFresh API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

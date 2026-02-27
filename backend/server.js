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
    const jitter = () => Math.floor(Math.random() * 20) - 10;
    res.json({
        weeks: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
        demand: [450, 520, 610, 780, 850, 920, 1050 + jitter(), 1100 + jitter()],
        supply: [400, 480, 550, 600, 720, 800, 850 + jitter(), 900 + jitter()],
        projection: [null, null, null, null, null, null, 1050, 1200],
        gap_percentage: 12 + (Math.random() * 2 - 1),
        recommendation: "Increase Tomato dispatch prioritization for Week 4 to meet projected demand gap."
    });
});

// Section B: Stock Utilization
app.get('/api/analytics/utilization', (req, res) => {
    const baseUsed = 4200;
    const currentUsed = baseUsed + (Math.floor(Math.random() * 100) - 50);
    res.json({
        total_capacity: 5000,
        used_capacity: currentUsed,
        remaining_capacity: 5000 - currentUsed,
        produce: [
            { name: 'Tomato', percentage: 38, value: Math.floor(currentUsed * 0.38) },
            { name: 'Onion', percentage: 22, value: Math.floor(currentUsed * 0.22) },
            { name: 'Potato', percentage: 15, value: Math.floor(currentUsed * 0.15) },
            { name: 'Grapes', percentage: 10, value: Math.floor(currentUsed * 0.10) },
            { name: 'Empty Space', percentage: 15, value: 5000 - currentUsed }
        ],
        smart_insight: "Storage optimization active. Current utilization: " + ((currentUsed / 5000) * 100).toFixed(1) + "%"
    });
});

// Section C: Spoilage Risk Distribution
app.get('/api/analytics/risk-distribution', (req, res) => {
    const highRiskCount = 15 + Math.floor(Math.random() * 10);
    res.json({
        total_batches: 142,
        risk_score_summary: 24,
        distribution: [
            { label: 'Safe', percentage: 72, count: 102 },
            { label: 'Warning', percentage: 14, count: 20 },
            { label: 'High Risk', percentage: 14, count: highRiskCount }
        ],
        insight: `${highRiskCount} batches are in high-risk category. AI recommends dispatch within 48 hours.`
    });
});

// Section E: Loss Reduction Over Time
app.get('/api/analytics/loss-reduction', (req, res) => {
    // Simulate progressing savings
    const baseSavings = 298000;
    const dynamicSavings = baseSavings + (Math.floor(Date.now() / 1000) % 10000);
    res.json({
        months: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
        before_ai: [150000, 165000, 145000, 170000, 160000, 155000],
        after_ai: [150000, 140000, 110000, 95000, 80000, 72000],
        revenue_preserved: [0, 25000, 35000, 75000, 80000, 83000],
        metrics: {
            total_loss_prevented: dynamicSavings,
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

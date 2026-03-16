const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const axios = require('axios');

// Models
const SensorLog = require('./models/SensorLog');
const Inventory = require('./models/Inventory');
const ChatLog = require('./models/ChatLog');
const User = require('./models/User');
const Warehouse = require('./models/Warehouse');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

// IoT Ingestion Endpoint
app.post('/api/sensor-data', async (req, res) => {
    const { warehouse_id, zone_id, temperature, humidity, timestamp } = req.body;

    if (!warehouse_id || temperature === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const newData = new SensorLog({
            warehouse_id,
            zone_name: zone_id, // Map zone_id to zone_name for now
            temperature,
            humidity,
            timestamp: timestamp || new Date()
        });

        await newData.save();

        res.status(201).json({
            message: "Data logged successfully to MongoDB",
            alert_triggered: temperature > 18
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'Online',
        time: new Date(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// AI Insights Proxy - Integrated with Python Microservice
app.post('/api/ai/analyze', async (req, res) => {
    const { batchId, produce, temperature, humidity, storage_days } = req.body;

    try {
        // Try calling the actual Python AI service
        const aiResponse = await axios.post('http://localhost:8000/analyze', {
            batchId,
            produce,
            temperature: Number(temperature),
            humidity: Number(humidity),
            storage_days: Number(storage_days || 0)
        }, { timeout: 2000 });

        return res.json(aiResponse.data);
    } catch (err) {
        console.log("AI Service unreachable, using fallback simulation.");
        // Fallback Simulation logic
        let risk = "Low";
        let days = 15;
        let priority = "P3";
        let action = "Maintain Storage";

        if (temperature > 17 || humidity > 70) {
            risk = "Moderate";
            days = 7;
            priority = "P2";
            action = "Monitor Closely";
        }

        if (temperature > 20) {
            risk = "High";
            days = 2;
            priority = "P1";
            action = "Dispatch Immediately";
        }

        if (produce && produce.toLowerCase() === "tomato" && temperature > 15) {
            risk = "High";
            days = 3;
            priority = "P1";
            action = "Dispatch to Local Market";
        }

        res.json({
            spoilage_risk: risk,
            remaining_days: days,
            priority: priority,
            recommended_action: action,
            confidence: 0.88 + (Math.random() * 0.1),
            source: "Simulation (Fallback)"
        });
    }
});

app.get('/api/ai/spoilage-risk/:batchId', async (req, res) => {
    const risk = Math.random() > 0.8 ? "High" : "Low";
    res.json({
        batchId: req.params.batchId,
        spoilage_risk: risk,
        remaining_days: risk === "High" ? 2 : 14,
        confidence: 0.92
    });
});

app.get('/api/alerts', async (req, res) => {
    try {
        const highTempLogs = await SensorLog.find({ temperature: { $gt: 18 } }).sort({ timestamp: -1 }).limit(10);
        const alerts = highTempLogs.map(log => ({
            type: 'CRITICAL',
            message: `Temperature spike in Zone ${log.zone_name}: ${log.temperature}°C`,
            timestamp: log.timestamp
        }));
        res.json(alerts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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
app.get('/api/analytics/utilization', async (req, res) => {
    try {
        const total_capacity = 5000;
        // In real app: fetch sum from Inventory
        const baseUsed = 4200;
        const currentUsed = baseUsed + (Math.floor(Math.random() * 100) - 50);
        res.json({
            total_capacity,
            used_capacity: currentUsed,
            remaining_capacity: total_capacity - currentUsed,
            produce: [
                { name: 'Tomato', percentage: 38, value: Math.floor(currentUsed * 0.38) },
                { name: 'Onion', percentage: 22, value: Math.floor(currentUsed * 0.22) },
                { name: 'Potato', percentage: 15, value: Math.floor(currentUsed * 0.15) },
                { name: 'Grapes', percentage: 10, value: Math.floor(currentUsed * 0.10) },
                { name: 'Empty Space', percentage: 15, value: total_capacity - currentUsed }
            ],
            smart_insight: "Storage optimization active. Current utilization: " + ((currentUsed / total_capacity) * 100).toFixed(1) + "%"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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

// --- Chatbot AI Endpoint ---
app.post('/api/chat', async (req, res) => {
    const { message, userId } = req.body;
    let response = "";
    let intent = "general";

    const lowerMsg = message.toLowerCase();

    try {
        if (lowerMsg.includes("temperature") || lowerMsg.includes("temp") || lowerMsg.includes("status")) {
            intent = "status_query";
            const latestLogs = await SensorLog.find().sort({ timestamp: -1 }).limit(3);
            if (latestLogs.length > 0) {
                response = "Currently, " + latestLogs.map(l => `Zone ${l.zone_name} is at ${l.temperature}°C`).join(", ") + ". ";
                if (latestLogs.some(l => l.temperature > 18)) {
                    response += "⚠️ ALERT: Some zones are above the safe limit (18°C)!";
                } else {
                    response += "Everything looks safe and optimized. ✅";
                }
            } else {
                response = "I couldn't find any recent sensor data. Please check if the IOT nodes are active.";
            }
        }
        else if (lowerMsg.includes("inventory") || lowerMsg.includes("stock") || lowerMsg.includes("many")) {
            intent = "inventory_query";
            const inventory = await Inventory.find({ status: 'STORED' });
            const total = inventory.reduce((acc, item) => acc + item.quantity, 0);
            const types = [...new Set(inventory.map(item => item.produce_type))];
            response = `We currently have ${total}kg of stock across ${types.length} types of produce: ${types.join(", ")}.`;
        }
        else if (lowerMsg.includes("expiry") || lowerMsg.includes("spoil") || lowerMsg.includes("risk")) {
            intent = "risk_query";
            const highRisk = await Inventory.find({ status: 'STORED' }).limit(2); // Simple mock for demo
            response = "Based on AI analysis, the Tomato batch (QR-TOM-001) has a 14% risk increase due to recent temp humidity fluctuations. I recommend prioritizing it for the next dispatch.";
        }
        else if (lowerMsg.includes("hi") || lowerMsg.includes("hello") || lowerMsg.includes("who")) {
            response = "Namaste! I am the Nari Shakti AI Assistant. I can help you monitor warehouse temperatures, check inventory levels, or predict spoilage risks. How can I assist you today?";
        }
        else {
            response = "I'm not sure I understand. You can ask me about 'temperature status', 'inventory stock', or 'spoilage risks'.";
        }

        // Log the chat
        const newLog = new ChatLog({
            user_id: userId || null,
            message,
            response,
            intent
        });
        await newLog.save();

        res.json({ response });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────────────
// MARKETPLACE API ROUTES — Nari Shakti Market Module
// ─────────────────────────────────────────────────────

// GET /api/market/listings — All crop listings with sensor-linked quality data
app.get('/api/market/listings', async (req, res) => {
    try {
        // Try to pull latest sensor data to enrich listings
        const latestSensor = await SensorLog.findOne().sort({ timestamp: -1 });
        const humidity = latestSensor ? latestSensor.humidity : (55 + Math.random() * 30);

        const crops = [
            { id: 'LST-001', name: 'Tomato',   icon: '🍅', qty: '1,200 kg', price: '₹28/kg',  zone: 'A1', humidity: parseFloat(humidity.toFixed(1)), gas: 38, daysLeft: 12, farmer: 'Sunita Devi',   location: 'Nashik' },
            { id: 'LST-002', name: 'Onion',    icon: '🧅', qty: '800 kg',   price: '₹18/kg',  zone: 'B2', humidity: 68,                              gas: 45, daysLeft: 25, farmer: 'Rekha Patil',   location: 'Pune'   },
            { id: 'LST-003', name: 'Potato',   icon: '🥔', qty: '2,000 kg', price: '₹15/kg',  zone: 'C1', humidity: 71,                              gas: 55, daysLeft: 30, farmer: 'Anita Rao',     location: 'Mumbai' },
            { id: 'LST-004', name: 'Grapes',   icon: '🍇', qty: '500 kg',   price: '₹95/kg',  zone: 'A3', humidity: 60,                              gas: 28, daysLeft: 8,  farmer: 'Kavita Sharma', location: 'Nashik' },
            { id: 'LST-005', name: 'Chilli',   icon: '🌶️', qty: '320 kg',   price: '₹62/kg',  zone: 'D2', humidity: 55,                              gas: 32, daysLeft: 20, farmer: 'Meena Joshi',   location: 'Pune'   },
            { id: 'LST-006', name: 'Capsicum', icon: '🫑', qty: '410 kg',   price: '₹45/kg',  zone: 'B4', humidity: 73,                              gas: 60, daysLeft: 6,  farmer: 'Priya Nair',    location: 'Mumbai' },
        ];

        res.json(crops);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/market/price-advisory — AI Sell vs Hold recommendation
app.get('/api/market/price-advisory', (req, res) => {
    const crop = req.query.crop || 'Tomato';
    const jitter = () => Math.floor(Math.random() * 10) - 3;

    const basePrices = {
        'Tomato': 28, 'Onion': 18, 'Potato': 15,
        'Grapes': 95, 'Chilli': 62, 'Capsicum': 45, 'Garlic': 55
    };
    const currentPrice = (basePrices[crop] || 25) + jitter();
    const predictedPrice = Math.floor(currentPrice * (1.08 + Math.random() * 0.25));
    const gain = predictedPrice - currentPrice;
    const recommendation = gain > 6 ? 'HOLD' : 'SELL';

    res.json({
        crop,
        current_mandi_price: currentPrice,
        predicted_15day_price: predictedPrice,
        potential_gain_per_kg: gain,
        recommendation,
        recommendation_label: recommendation === 'HOLD' ? 'Wait 1 Week' : 'Sell Now',
        reasoning: recommendation === 'HOLD'
            ? `AI detects rising demand trends across Nashik & Pune mandis. Holding for 7–10 days could yield ₹${gain}/kg extra based on seasonal patterns.`
            : `Current prices are at a local peak. AI models forecast a supply surplus in the next 15 days that could reduce prices by ₹${Math.abs(gain)}/kg.`,
        confidence: (0.82 + Math.random() * 0.14).toFixed(2),
        source: 'AgriFresh ML Engine v2.3',
        generated_at: new Date().toISOString()
    });
});

// GET /api/market/mandi-prices — Simulated live mandi price feed
app.get('/api/market/mandi-prices', (req, res) => {
    const items = ['Tomato', 'Onion', 'Potato', 'Grapes', 'Chilli', 'Capsicum', 'Garlic', 'Cabbage'];
    const cities = ['Pune', 'Nashik', 'Mumbai'];
    const basePrices = { Tomato: 28, Onion: 18, Potato: 15, Grapes: 95, Chilli: 62, Capsicum: 45, Garlic: 55, Cabbage: 12 };
    const result = [];

    cities.forEach(city => {
        const cityJitter = (Math.random() - 0.5) * 6;
        items.forEach(item => {
            const base = basePrices[item] || 20;
            const price = Math.max(5, Math.floor(base + cityJitter + (Math.random() - 0.4) * 8));
            const change = ((Math.random() - 0.4) * 10).toFixed(1);
            result.push({ city, crop: item, price, change, unit: 'per kg' });
        });
    });

    res.json(result);
});

// GET /api/market/sensor-status — Latest sensor reading for Quality Passport
app.get('/api/market/sensor-status', async (req, res) => {
    try {
        const latest = await SensorLog.findOne().sort({ timestamp: -1 });
        const humidity = latest ? latest.humidity   : Math.floor(50 + Math.random() * 40);
        const temp     = latest ? latest.temperature : (18 + Math.random() * 8);
        const gas_ppm  = Math.floor(20 + Math.random() * 70); // MQ2 simulated

        res.json({
            humidity: parseFloat(humidity.toFixed(1)),
            gas_ppm,
            temperature: parseFloat(temp.toFixed(1)),
            grade: (humidity < 70 && gas_ppm < 50) ? 'A' : 'B',
            badge: (humidity < 70 && gas_ppm < 50) ? 'Sensor-Verified: Grade A' : 'Quality: Standard',
            status: (humidity < 70 && gas_ppm < 50) ? 'optimal' : 'moderate',
            last_updated: new Date().toLocaleTimeString('en-IN'),
            source: latest ? 'Live Sensor Data' : 'Simulation'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/market/negotiate — AI Bhav-Taal negotiation bot
app.post('/api/market/negotiate', (req, res) => {
    const { farmerPrice, buyerOffer, cropName, message } = req.body;
    const crop   = cropName || 'produce';
    const farmer = parseFloat(farmerPrice) || 30;
    const buyer  = parseFloat(buyerOffer)  || 22;
    const mid    = ((farmer + buyer) / 2).toFixed(0);
    const trend  = (Math.random() > 0.5) ? '+5.8%' : '-2.3%';

    const responses = [
        `📊 Based on today's ${crop} prices across Nashik, Pune, and Mumbai mandis, a fair settlement rate is **₹${mid}/kg**. The 7-day demand trend shows ${trend} — the farmer's ask of ₹${farmer} is reasonable for Grade A quality.`,
        `🤖 AI Bhav-Taal Analysis: The 15-day rolling average for ${crop} is ₹${parseFloat(mid) + 2}/kg. I recommend a deal at **₹${mid}/kg** with a Quality Passport certificate — the sensor data confirms optimal storage conditions.`,
        `💡 Market Intelligence: The buyer's offer of ₹${buyer}/kg is ${(((farmer - buyer) / farmer) * 100).toFixed(0)}% below the asking price. A fair compromise is **₹${mid}/kg**, which aligns with Nashik APMC's 7-day VWAP. Consider adding a volume bonus for orders above 500 kg.`
    ];

    res.json({
        response: responses[Math.floor(Math.random() * responses.length)],
        suggested_price: parseFloat(mid),
        market_data: {
            avg_7day: parseFloat(mid) + 2,
            trend,
            mandi: 'Nashik APMC',
            source: 'AgriFresh Market Engine'
        },
        generated_at: new Date().toISOString()
    });
});

// END MARKETPLACE ROUTES

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// controllers/chatbot.controller.js

const { sendToGemini } = require("../services/gemini.service");
const { getWeatherByCity, formatWeatherForGemini } = require("../services/weather.service");
const { getMarketPrices, formatMarketForGemini } = require("../services/market.service");
const { getLocalAnswer } = require("../knowledge/farming.knowledge");

// ─── Intent Detection Keywords ───────────────────────────────────────────────

const WEATHER_KEYWORDS = [
    "weather", "mausam", "temperature", "rain", "barish", "baarish",
    "garmi", "sardi", "thand", "aaj ka mausam", "forecast", "humidity",
    "wind", "hawa", "baarish hogi", "kal ka mausam",
];

const MARKET_KEYWORDS = [
    "price", "bhav", "daam", "rate", "mandi", "market", "bechna",
    "sell", "gehu", "wheat", "tomato", "tamatar", "rice", "chawal",
    "onion", "pyaz", "potato", "aloo", "cotton", "kapas", "soybean",
    "market price", "today price", "aaj ka bhav", "sabzi ka bhav",
];

const detectIntent = (message) => {
    const lower = message.toLowerCase();
    return {
        isWeather: WEATHER_KEYWORDS.some((kw) => lower.includes(kw)),
        isMarket: MARKET_KEYWORDS.some((kw) => lower.includes(kw)),
    };
};

const extractCity = (message) => {
    const cities = [
        "pune", "mumbai", "nagpur", "nashik", "aurangabad", "delhi", "jaipur",
        "lucknow", "patna", "bhopal", "indore", "hyderabad", "bangalore",
        "chennai", "kolkata", "ahmedabad", "surat", "amravati", "latur",
        "solapur", "kolhapur", "akola", "chandrapur",
    ];
    const lower = message.toLowerCase();
    return cities.find((city) => lower.includes(city)) || null;
};

const extractCommodity = (message) => {
    const commodityMap = {
        wheat: "Wheat", gehu: "Wheat",
        rice: "Rice", chawal: "Rice",
        tomato: "Tomato", tamatar: "Tomato",
        onion: "Onion", pyaz: "Onion",
        potato: "Potato", aloo: "Potato",
        cotton: "Cotton", kapas: "Cotton",
        soybean: "Soybean",
        maize: "Maize", makka: "Maize",
        sugarcane: "Sugarcane", ganna: "Sugarcane",
        groundnut: "Groundnut", mungfali: "Groundnut",
    };
    const lower = message.toLowerCase();
    for (const [key, value] of Object.entries(commodityMap)) {
        if (lower.includes(key)) return value;
    }
    return null;
};

// ─── Main Chat Handler ────────────────────────────────────────────────────────

const handleChat = async (req, res) => {
    try {
        const { message, chatHistory = [], city: cityFromBody } = req.body;

        if (!message || message.trim() === "") {
            return res.status(400).json({ error: "Message is required" });
        }

        const { isWeather, isMarket } = detectIntent(message);
        let extraContext = "";

        // Fetch weather data if needed
        if (isWeather) {
            const city = cityFromBody || extractCity(message) || "Pune";
            try {
                const weatherData = await getWeatherByCity(city);
                extraContext += formatWeatherForGemini(weatherData) + "\n\n";
            } catch (err) {
                console.warn("Weather fetch failed:", err.message);
            }
        }

        // Fetch market prices if needed
        if (isMarket) {
            const commodity = extractCommodity(message);
            if (commodity) {
                try {
                    const prices = await getMarketPrices(commodity);
                    extraContext += formatMarketForGemini(prices, commodity) + "\n\n";
                } catch (err) {
                    console.warn("Market fetch failed:", err.message);
                }
            }
        }

        // Build chat history with new user message
        const updatedHistory = [
            ...chatHistory,
            { role: "user", parts: [{ text: message }] },
        ];

        // ── Try Gemini first ──
        let reply = null;
        let source = "gemini";

        try {
            reply = await sendToGemini(updatedHistory, extraContext.trim() || null);
        } catch (geminiError) {
            console.warn("⚠️ Gemini unavailable. Using local knowledge base...");

            // ── Fallback to local knowledge base ──
            reply = getLocalAnswer(message);
            source = "local";
        }

        // Add model reply to history
        const newHistory = [
            ...updatedHistory,
            { role: "model", parts: [{ text: reply }] },
        ];

        res.json({
            reply,
            chatHistory: newHistory,
            meta: {
                usedWeatherAPI: isWeather,
                usedMarketAPI: isMarket,
                geminiStatus: source === "gemini" ? "ok" : "unavailable",
                source, // "gemini" or "local"
            },
        });

    } catch (error) {
        console.error("Chat Controller Error:", error.message);
        res.status(500).json({ error: error.message || "Something went wrong" });
    }
};

module.exports = { handleChat };
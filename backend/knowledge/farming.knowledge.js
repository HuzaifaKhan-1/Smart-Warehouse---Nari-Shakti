// knowledge/farming.knowledge.js
// Local farming knowledge base — used when Gemini API is unavailable

const farmingKnowledge = [
    // ─── Wheat ───────────────────────────────────────────────────────────────
    {
        keywords: ["wheat", "gehu", "गेहू", "गेहु"],
        answer: `🌾 **Wheat Farming Guide:**
- **Best Sowing Time:** October to December
- **Soil:** Well-drained loamy soil, pH 6-7.5
- **Fertilizer:** Apply DAP (50kg/acre) at sowing + Urea (25kg/acre) after 3 weeks
- **Irrigation:** 4-6 irrigations needed. First irrigation at 20-25 days after sowing
- **Common Diseases:** Rust, Smut — spray Mancozeb 0.2% if spotted
- **Harvest Time:** March to April when crop turns golden yellow
- **Yield:** 15-20 quintals per acre on average
💡 Tip: Use certified seeds like HD-2967 or PBW-343 for better yield.`,
    },

    // ─── Rice ────────────────────────────────────────────────────────────────
    {
        keywords: ["rice", "chawal", "paddy", "dhan", "चावल", "धान"],
        answer: `🌾 **Rice Farming Guide:**
- **Best Sowing Time:** June to July (Kharif season)
- **Soil:** Clay or clay-loam soil that retains water
- **Fertilizer:** NPK 120:60:40 kg/hectare
- **Water:** Rice needs standing water of 5cm in field
- **Common Pests:** Brown Plant Hopper — use Imidacloprid spray
- **Harvest Time:** 100-150 days after transplanting
- **Yield:** 20-25 quintals per acre
💡 Tip: Use SRI (System of Rice Intensification) method to save water and increase yield by 20%.`,
    },

    // ─── Tomato ──────────────────────────────────────────────────────────────
    {
        keywords: ["tomato", "tamatar", "टमाटर"],
        answer: `🍅 **Tomato Farming Guide:**
- **Best Season:** Rabi (Oct-Nov) and Kharif (June-July)
- **Soil:** Sandy loam to clay loam, pH 6.0-7.0
- **Spacing:** 60cm x 45cm between plants
- **Fertilizer:** FYM 25 tonnes/hectare + NPK 120:80:80 kg/hectare
- **Irrigation:** Drip irrigation recommended, every 2-3 days
- **Common Disease:** Early Blight, Late Blight — spray Copper Oxychloride
- **Harvest:** 60-80 days after transplanting
- **Yield:** 200-250 quintals per acre
💡 Tip: Stake plants at 30cm height to prevent stem breakage.`,
    },

    // ─── Onion ───────────────────────────────────────────────────────────────
    {
        keywords: ["onion", "pyaz", "kanda", "pyaaz", "प्याज", "कांदा"],
        answer: `🧅 **Onion Farming Guide:**
- **Best Season:** Rabi (Oct-Nov sowing), Kharif (June-July)
- **Soil:** Well-drained sandy loam, pH 6.0-7.5
- **Seed Rate:** 8-10 kg/hectare
- **Fertilizer:** NPK 100:50:50 kg/hectare
- **Irrigation:** Every 7-10 days, stop 15 days before harvest
- **Common Problem:** Purple Blotch — spray Mancozeb 0.25%
- **Harvest:** 90-120 days after transplanting
- **Storage:** Store in dry, cool, ventilated place
💡 Tip: Avoid waterlogging — it causes rotting.`,
    },

    // ─── Potato ──────────────────────────────────────────────────────────────
    {
        keywords: ["potato", "aloo", "aaloo", "आलू"],
        answer: `🥔 **Potato Farming Guide:**
- **Best Season:** October to December
- **Soil:** Sandy loam, pH 5.2-6.4
- **Seed Rate:** 20-25 quintals/hectare of healthy tubers
- **Fertilizer:** NPK 180:80:100 kg/hectare
- **Irrigation:** Every 10-12 days, stop 15 days before harvest
- **Common Disease:** Late Blight — spray Ridomil MZ at first sign
- **Harvest:** 70-90 days after planting
- **Yield:** 200-250 quintals per hectare
💡 Tip: Use certified disease-free seed tubers for best results.`,
    },

    // ─── Soybean ─────────────────────────────────────────────────────────────
    {
        keywords: ["soybean", "soya", "soyabean", "सोयाबीन"],
        answer: `🫘 **Soybean Farming Guide:**
- **Best Season:** Kharif — sow in June-July after first rain
- **Soil:** Well-drained black cotton soil, pH 6.0-7.5
- **Seed Rate:** 70-80 kg/hectare
- **Fertilizer:** NPK 30:60:40 kg/hectare (less nitrogen as it fixes its own)
- **Irrigation:** Critical at flowering (40 days) and pod filling stage
- **Common Pest:** Girdle Beetle — use Triazophos spray
- **Harvest:** 90-100 days after sowing
- **Yield:** 15-20 quintals per hectare
💡 Tip: Treat seeds with Rhizobium culture before sowing to boost nitrogen fixation.`,
    },

    // ─── Cotton ──────────────────────────────────────────────────────────────
    {
        keywords: ["cotton", "kapas", "kapas", "कपास"],
        answer: `🌿 **Cotton Farming Guide:**
- **Best Season:** Kharif — April to June
- **Soil:** Deep black cotton soil, pH 6.0-8.0
- **Spacing:** 90cm x 60cm
- **Fertilizer:** NPK 120:60:60 kg/hectare
- **Irrigation:** Every 15 days, critical at boll formation
- **Common Pest:** Bollworm — use Bt spray or approved insecticide
- **Harvest:** 160-180 days after sowing
- **Yield:** 15-20 quintals per hectare (seed cotton)
💡 Tip: Use Bt cotton varieties to reduce bollworm damage significantly.`,
    },

    // ─── Fertilizer ──────────────────────────────────────────────────────────
    {
        keywords: ["fertilizer", "khad", "urea", "dap", "खाद", "उर्वरक"],
        answer: `🌱 **Fertilizer Guide for Farmers:**
- **Urea (46% N):** Best for leafy growth. Apply in 2 splits — at sowing and 30 days later
- **DAP (18-46-0):** Best at sowing time. Provides both Nitrogen and Phosphorus
- **MOP (Potash):** Improves fruit quality and disease resistance
- **FYM (Farmyard Manure):** Apply 10-15 tonnes/hectare before sowing for soil health
- **Zinc Sulphate:** Apply 25kg/hectare if soil test shows zinc deficiency
⚠️ Always do a **soil test** before applying fertilizers to avoid over-application.
💡 Tip: Split urea application — don't apply all at once, reduces wastage by 30%.`,
    },

    // ─── Weather / Irrigation ────────────────────────────────────────────────
    {
        keywords: ["weather", "mausam", "rain", "barish", "irrigation", "sinchai", "मौसम", "बारिश", "सिंचाई"],
        answer: `🌦️ **Weather & Irrigation Tips:**
- **Before rain:** Do not apply fertilizers 2 days before expected rain
- **After heavy rain:** Check for waterlogging — drain fields immediately
- **Dry spell:** Irrigate at critical crop stages (flowering, grain filling)
- **Hot weather (>40°C):** Irrigate in evening to reduce evaporation
- **Cold wave:** Cover nursery beds with plastic sheets at night
- **Fog:** Spray fungicide to prevent fungal diseases in fog season
💡 Tip: Drip irrigation saves 40-50% water compared to flood irrigation.`,
    },

    // ─── Pest / Disease ──────────────────────────────────────────────────────
    {
        keywords: ["pest", "disease", "kida", "rog", "spray", "fungus", "कीड़ा", "रोग", "कीट"],
        answer: `🐛 **Pest & Disease Management:**
- **Yellow leaves:** May indicate nitrogen deficiency or viral disease
- **White powder on leaves:** Powdery mildew — spray Sulphur 80% WP
- **Holes in leaves:** Caterpillar attack — spray Chlorpyrifos
- **Wilting despite water:** Root rot — reduce irrigation, apply Trichoderma
- **Sticky insects on stems:** Aphids — spray Imidacloprid 0.3ml/litre
- **Brown spots on leaves:** Fungal blight — spray Mancozeb 0.2%
💡 Tip: Always spray pesticides in early morning or evening — never in hot afternoon sun.`,
    },

    // ─── Government Schemes ──────────────────────────────────────────────────
    {
        keywords: ["scheme", "yojana", "government", "sarkar", "subsidy", "pm kisan", "loan", "योजना", "सरकार", "सब्सिडी"],
        answer: `🏛️ **Government Schemes for Farmers:**
- **PM-KISAN:** ₹6,000/year direct to farmer's bank account in 3 installments. Register at pmkisan.gov.in
- **PM Fasal Bima Yojana:** Crop insurance against drought, flood, pest. Premium only 1.5-2%
- **Kisan Credit Card (KCC):** Low interest loan up to ₹3 lakh at 4% interest
- **Soil Health Card:** Free soil testing by government — apply at nearest Krishi Kendra
- **PM Krishi Sinchai Yojana:** 55% subsidy on drip/sprinkler irrigation
- **e-NAM:** Sell crops online at best price — register at enam.gov.in
💡 Tip: Contact your nearest **Krishi Vigyan Kendra (KVK)** for free expert advice and scheme registration help.`,
    },

    // ─── Market / Mandi Price ────────────────────────────────────────────────
    {
        keywords: ["price", "bhav", "mandi", "rate", "sell", "bechna", "market", "भाव", "मंडी", "दाम"],
        answer: `💰 **Market Price & Selling Tips:**
- **Check daily prices:** Visit agmarknet.gov.in or enam.gov.in for live mandi rates
- **Best time to sell:** Avoid selling immediately after harvest — prices are lowest then
- **Storage tip:** Store in dry, cool place to sell when prices rise
- **Grading:** Clean and grade your produce — higher grade = 15-20% better price
- **Direct selling:** Use e-NAM platform to sell directly without middlemen
- **FPO benefit:** Join a Farmer Producer Organisation for better bargaining power
💡 Tip: Prices usually rise 2-3 months after harvest season — if you can store safely, wait.`,
    },

    // ─── Soil Health ─────────────────────────────────────────────────────────
    {
        keywords: ["soil", "mitti", "ph", "organic", "compost", "मिट्टी", "भूमि"],
        answer: `🌍 **Soil Health Tips:**
- **Ideal pH:** Most crops prefer 6.0-7.5 pH
- **Too acidic (pH<6):** Apply lime (calcium carbonate) 200-400 kg/acre
- **Too alkaline (pH>8):** Apply gypsum 200 kg/acre + organic matter
- **Organic matter:** Add FYM, vermicompost, green manure to improve soil health
- **Crop rotation:** Change crops every season to prevent nutrient depletion
- **Soil test:** Do soil test every 2-3 years at government Krishi Kendra (free)
- **Cover crops:** Grow legumes (moong, urad) to add natural nitrogen to soil
💡 Tip: Never burn crop residue — incorporate it in soil to improve organic matter.`,
    },

    // ─── General Greeting ────────────────────────────────────────────────────
    {
        keywords: ["hello", "hi", "hey", "namaste", "namaskar", "helo", "नमस्ते"],
        answer: `👋 **Namaste! Welcome to AgriFresh Assistant!**
I am your personal farming advisor. I can help you with:
🌾 Crop advice (Wheat, Rice, Tomato, Onion, Potato, Cotton, Soybean)
🌦️ Weather-based farming tips
💰 Market prices and selling strategies
🐛 Pest and disease management
🏛️ Government schemes and subsidies
🌍 Soil health and fertilizer guidance

Please ask me anything about farming! 🙏`,
    },
];

/**
 * Find the best matching answer from local knowledge base
 * @param {string} message - User's message
 * @returns {string|null} - Matching answer or null if no match
 */
const getLocalAnswer = (message) => {
    const lower = message.toLowerCase();

    // Find best matching topic
    const match = farmingKnowledge.find((topic) =>
        topic.keywords.some((kw) => lower.includes(kw.toLowerCase()))
    );

    if (match) return match.answer;

    // Generic fallback if nothing matches
    return `🌾 **AgriFresh Assistant**
I'm currently operating in offline mode due to high server demand.

I can help you with these topics — please ask about any:
• 🌾 Crops: Wheat, Rice, Tomato, Onion, Potato, Cotton, Soybean
• 🌦️ Weather & Irrigation tips
• 🐛 Pest & Disease management
• 💰 Market prices & selling strategies
• 🏛️ Government schemes (PM-KISAN, Fasal Bima, KCC)
• 🌍 Soil health & Fertilizers

Please try asking again in a minute for full AI-powered responses! 🙏`;
};

module.exports = { getLocalAnswer };
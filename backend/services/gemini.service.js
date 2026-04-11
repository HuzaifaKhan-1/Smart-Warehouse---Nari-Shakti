// services/gemini.service.js

const axios = require("axios");
const { getGeminiURL, GEMINI_MODELS } = require("../config/gemini");
const { AGRIFRESH_SYSTEM_PROMPT } = require("../prompts/agrifresh.prompt");

// Track which model is currently working
let currentModelIndex = 0;

/**
 * Send a message to Gemini with automatic fallback across models
 * Retries up to 2 times per model, then moves to next model
 */
const sendToGemini = async (chatHistory, extraContext = null) => {
    let lastError = null;

    // Try each model in the fallback chain
    for (let m = 0; m < GEMINI_MODELS.length; m++) {
        // Start from last known working model
        const modelIndex = (currentModelIndex + m) % GEMINI_MODELS.length;
        const modelName = GEMINI_MODELS[modelIndex];
        
        // Retry same model up to 2 times
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                console.log(`🤖 Trying model: ${modelName} (attempt ${attempt})`);

                const url = getGeminiURL(modelName);

                // Inject extra context (weather/market) into last user message
                let contents = [...chatHistory];
                if (extraContext) {
                    const lastIndex = contents.length - 1;
                    const lastText = contents[lastIndex].parts[0].text;
                    contents[lastIndex] = {
                        role: "user",
                        parts: [{ text: `${lastText}\n\n[Real-time Data]:\n${extraContext}` }],
                    };
                }

                const payload = {
                    system_instruction: {
                        parts: [{ text: AGRIFRESH_SYSTEM_PROMPT }],
                    },
                    contents,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1024,
                    },
                };

                const response = await axios.post(url, payload, {
                    headers: { "Content-Type": "application/json" },
                    timeout: 15000, // 15 second timeout
                });

                const reply =
                    response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

                if (!reply) throw new Error("Empty response from Gemini");

                // ✅ Success — remember this working model for next time
                if (currentModelIndex !== modelIndex) {
                    console.log(`✅ Switched to working model: ${modelName}`);
                    currentModelIndex = modelIndex;
                }

                return reply;

            } catch (error) {
                const status = error.response?.status;
                const errMsg = error.response?.data?.error?.message || error.message;

                console.error(`❌ Model ${modelName} attempt ${attempt} failed: [${status}] ${errMsg}`);
                lastError = errMsg;

                // Don't retry on auth errors — API key is wrong
                if (status === 400 || status === 401 || status === 403) {
                    throw new Error(`Gemini Auth Error: ${errMsg}`);
                }

                // Wait before retrying same model
                if (attempt < 2) {
                    await new Promise((res) => setTimeout(res, 1500));
                }
            }
        }

        // Wait before trying next model
        console.log(`⏭️ Moving to next fallback model...`);
        await new Promise((res) => setTimeout(res, 1000));
    }

    // All models failed
    throw new Error(`All Gemini models unavailable. Last error: ${lastError}`);
};

module.exports = { sendToGemini };
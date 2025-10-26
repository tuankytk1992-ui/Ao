// File: netlify/functions/generate.js - CODE V4 (Tích hợp 6 công cụ)

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Khởi tạo Gemini AI (Sử dụng API Key đã cấu hình trong Netlify)
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// CÁC BOT MASTER GOALS (BỘ CHỈ HUY NỘI DUNG)
const BOT_MASTER_GOALS = {
    // 1. Công cụ SEO/Content
    TITLE_AI: "Write 10 compelling blog post titles in Vietnamese for an article about the user's input. The titles must be optimized for click-through rate (CTR) and curiosity, and be short and impactful.",
    SUMMARY_AI: "Summarize the following Vietnamese text provided by the user into 3 concise bullet points. The summary must capture the main ideas clearly.",
    REPHRASE_AI: "Rephrase the following Vietnamese sentence or short paragraph provided by the user. The rephrased version must maintain the original meaning but use completely different wording and structure to avoid plagiarism.",

    // 2. Công cụ Giải trí/Tâm linh (MỚI)
    ZODIAC_ANALYSIS: "Act as an experienced astrologer. Based on the user's input (a Zodiac Sign, e.g., 'Aries'), write a short, highly engaging, and positive analysis in Vietnamese focusing on their personality strengths, career prospects, and a piece of life advice for the week. Use sophisticated and alluring language.",
    TAROT_READING: "Act as a mysterious Tarot Card Reader. The user's input is a specific question (e.g., 'Will I find true love?'). Provide a deep, metaphorical, and highly personalized reading in Vietnamese that addresses their question, offering a guiding light for their 'vận số' (destiny). Structure the answer as a poetic prophecy.",
    CHRISTMAS_WISH: "Generate a beautiful, romantic, and emotionally warm Vietnamese Christmas message/wish (short paragraph) suitable for sending to a loved one. The message must evoke feelings of togetherness, hope, and 'tuyết đầu mùa' (first snow).",
};

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed. Use POST." }),
        };
    }

    try {
        const { prompt, tool, email } = JSON.parse(event.body);

        if (!prompt || !tool) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Prompt and Tool are required." }),
            };
        }

        const systemInstruction = BOT_MASTER_GOALS[tool];

        // Bot 5: Content Generator sử dụng Gemini để tạo nội dung
        const response = await ai.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction })
            .generateContent(prompt);
            
        const text = response.text.trim();
        
        return {
            statusCode: 200,
            body: JSON.stringify({ result: text }),
        };
    } catch (error) {
        // Bot 9: Error Handler
        console.error("AI Generation Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error during AI generation." }),
        };
    }
};

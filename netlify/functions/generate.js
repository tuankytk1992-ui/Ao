// E.1: Netlify Function để bảo mật API Key
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.handler = async (event) => {
    try {
        const { topic, tone } = JSON.parse(event.body);

        const prompt = `Bạn là một chuyên gia Marketing AI. Hãy tạo 3 tiêu đề SEO và 3 tiêu đề quảng cáo (Ad Copy) tối ưu cho chủ đề sau: "${topic}". Phong cách mong muốn: "${tone}". Trình bày kết quả rõ ràng, phân loại bằng **[SEO]** và **[Ad]**.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", 
            contents: prompt,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ result: response.text }),
        };
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Lỗi Serverless. Vui lòng kiểm tra API Key.' }),
        };
    }
};

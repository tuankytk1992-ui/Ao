// Cần GEMINI_API_KEY trong Netlify Environment Variables
const { GoogleGenAI } = require('@google/genai');
const fetch = require('node-fetch');

// 💡 ĐÃ CẬP NHẬT WEBHOOK MỚI CỦA CHỦ NHÂN (DailyAI)
const MAKE_WEBHOOK_URL = 'Https://hook.eu2.make.com/pqg839ưl3hxfny9nkfrowar9an724ipc';

// 💡 ĐÃ CẬP NHẬT: TẠM THỜI DÙNG LINK FANPAGE ĐỂ TĂNG TƯƠNG TÁC
const AFFILIATE_LINK = 'https://www.facebook.com/Gaixinhdanang'; 

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    try {
        const data = JSON.parse(event.body);
        const promptFromSheet = data.prompt;

        if (!promptFromSheet) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Thiếu trường "prompt" trong yêu cầu.' }),
            };
        }
        
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const systemInstruction = `Bạn là một chuyên gia viết nội dung kiếm tiền online. Nhiệm vụ của bạn là viết một bài đăng Facebook cực kỳ thu hút, dựa trên chủ đề xu hướng. Bài viết PHẢI HẤP DẪN, GÂY TÒ MÒ, và KHÔNG được vượt quá 350 từ. CUỐI BÀI viết phải có LỜI KÊU GỌI HÀNH ĐỘNG (CTA) rõ ràng, hướng người đọc đến Link Fanpage mới.
        
        Bạn chỉ được phép trả về nội dung dưới dạng một đối tượng JSON duy nhất có 3 trường sau:
        
        - "title_for_tracking": (Tóm tắt chủ đề để theo dõi, KHÔNG hiển thị ra ngoài MXH)
        - "af_link": (Chỉ được trả về ${AFFILIATE_LINK})
        - "content_ready_for_social": (Toàn bộ bài viết hấp dẫn, bao gồm cả CTA và chèn ${AFFILIATE_LINK} vào cuối bài)
        
        Hãy tuân thủ nghiêm ngặt chỉ output JSON.`;

        const fullPrompt = `Chủ đề xu hướng: "${promptFromSheet}"`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", 
            contents: fullPrompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
            },
        });
        
        const jsonText = response.text.trim();
        const articleData = JSON.parse(jsonText);
        
        const makeResponse = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(articleData),
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                status: 'Success', 
                message: 'Content generated and sent to Make.com',
                make_response: makeResponse.status,
                title: articleData.title_for_tracking
            }),
        };

    } catch (error) {
        console.error('LỖI LỚN TRONG PYTHIA:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                status: 'Error', 
                message: 'Lỗi xử lý nội dung', 
                details: error.message 
            }),
        };
    }
};

// ĐÃ SỬA LỖI: Tên gói thư viện đã được đổi từ @google/generative-ai sang @google/genai
const { GoogleGenAI } = require("@google/genai"); 

// Khởi tạo Gemini AI Client
// Key được tự động lấy từ Environment Variable GEMINI_API_KEY trên Netlify
const ai = new GoogleGenAI({}); 

/**
 * Hàm chính xử lý yêu cầu từ client (index.html)
 */
exports.handler = async (event) => {
    // Chỉ chấp nhận phương thức POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { prompt, tool } = JSON.parse(event.body);

        if (!prompt && tool !== "Tool 6: XMAS Wishes") {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing prompt or invalid tool." }),
            };
        }

        // 1. Định nghĩa System Instruction (Đóng vai)
        const systemInstruction = `
            Bạn là một Master AI Agent, chuyên cung cấp các dịch vụ chuyên biệt.
            - Phản hồi bằng tiếng Việt.
            - Phản hồi phải trực tiếp, chi tiết, và hữu ích.
            - Không giải thích về vai trò của bạn hoặc cách bạn hoạt động.
            - Luôn giữ vai trò của mình trong suốt quá trình phản hồi.
        `;

        // 2. Định nghĩa Prompt (Yêu cầu) theo từng công cụ
        let userPrompt;
        let model = "gemini-2.5-flash"; // Model mặc định

        switch (tool) {
            case "Tool 1: SEO Title":
                userPrompt = `Bạn là một chuyên gia SEO/Content. Hãy viết 10 tiêu đề bài viết (Headline) hấp dẫn, độc đáo, giật tít để đạt thứ hạng cao trên Google và thu hút người đọc dựa trên chủ đề sau: "${prompt}"`;
                break;
            case "Tool 2: Summary":
                userPrompt = `Bạn là một biên tập viên. Hãy tóm tắt ngắn gọn và chính xác bài viết sau, giữ nguyên ý chính và loại bỏ chi tiết thừa: "${prompt}"`;
                break;
            case "Tool 3: Rephrase":
                userPrompt = `Bạn là một nhà văn chuyên nghiệp. Hãy viết lại nội dung sau đây một cách mượt mà, sáng tạo và chuyên nghiệp hơn, giữ nguyên ý nghĩa gốc: "${prompt}"`;
                break;
            case "Tool 4: Zodiac":
                userPrompt = `Bạn là một nhà chiêm tinh học. Dựa trên ngày sinh "${prompt}", hãy xác định cung hoàng đạo và cung cấp một phân tích chi tiết về vận mệnh, tình duyên, công việc cho tuần tới của họ.`;
                break;
            case "Tool 5: Tarot Reading":
                userPrompt = `Bạn là một người đọc Tarot. Hãy rút ba lá bài Tarot (Quá khứ, Hiện tại, Tương lai) để trả lời câu hỏi sau: "${prompt}". Giải thích ý nghĩa của mỗi lá bài và đưa ra lời khuyên tổng thể.`;
                break;
            case "Tool 6: XMAS Wishes":
                // prompt là thông tin về người nhận (ví dụ: Ông bà, Anh A)
                userPrompt = `Bạn là một nhà soạn thảo thư chúc mừng. Hãy viết một lời chúc Giáng sinh ấm áp, chân thành và độc đáo cho ${prompt}. Lời chúc cần dài ít nhất 5 câu.`;
                break;
            default:
                userPrompt = `Hãy trả lời yêu cầu sau: ${prompt}`;
        }

        // 3. Gọi API Gemini
        const response = await ai.models.generateContent({
            model: model,
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7, // Độ sáng tạo
            },
        });

        // 4. Trả về kết quả cho client
        return {
            statusCode: 200,
            body: JSON.stringify({ result: response.text }),
        };

    } catch (error) {
        console.error("Gemini API Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error or Gemini API failed to respond." }),
        };
    }
};

// Khai báo thư viện cần thiết
const fetch = require('node-fetch');

// Hằng số cho API 
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ message: "Method Not Allowed" }) };
    }

    try {
        const data = JSON.parse(event.body);
        const command = data.command;
        const affiliateId = data.affiliate_id || 'AT1671569'; 

        if (command === "FULL_AUTO_POST") {

            // **GIẢ LẬP KẾT QUẢ THÀNH CÔNG**
            const simulatedContent = {
                content_ready_for_social: `Thời trang Hottrend Mới Nhất Tháng 11! Mua ngay qua link để ủng hộ:`, 
                af_link: `https://accesstrade.vn/s/hot-product-2025?id=${affiliateId}` 
            };

            return {
                statusCode: 200, 
                body: JSON.stringify(simulatedContent),
            };

        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Lệnh không hợp lệ (Không phải FULL_AUTO_POST)." }),
            };
        }

    } catch (error) {
        console.error("Lỗi xử lý:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Lỗi nội bộ server: " + error.message }),
        };
    }
};

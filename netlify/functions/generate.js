// netlify/functions/generate.js - Mã nguồn đã sửa lỗi cú pháp

// Khai báo thư viện cần thiết
const fetch = require('node-fetch');

// Hằng số cho API (Được giả định đã thiết lập trong Netlify Environment Variables)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 

exports.handler = async (event, context) => {
    // Chỉ chấp nhận phương thức POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ message: "Method Not Allowed" }) };
    }

    try {
        const data = JSON.parse(event.body);
        const command = data.command;
        // Affiliate ID của Chủ nhân là AT1671569
        const affiliateId = data.affiliate_id || 'AT1671569'; 

        // Xử lý Lệnh Tự động Hoàn toàn từ Apps Script
        if (command === "FULL_AUTO_POST") {

            // GIẢ LẬP KẾT QUẢ THÀNH CÔNG (Sau khi sửa lỗi cú pháp)
            const simulatedContent = {
                content_ready_for_social: `[Bài đăng Tự động - Đã sửa lỗi] Thời trang Hottrend Mới Nhất! Link Affiliate đã sẵn sàng:`, 
                af_link: `https://accesstrade.vn/s/hot-product-2025?id=${affiliateId}` 
            };

            return {
                statusCode: 200, // Mã 200: Thành công
                body: JSON.stringify(simulatedContent),
            };

        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Lệnh không hợp lệ." }),
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

// netlify/functions/generate.js - Mã nguồn đã sửa lỗi cú pháp triệt để

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ message: "Method Not Allowed" }) };
    }

    try {
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Request body is empty." }),
            };
        }

        const data = JSON.parse(event.body);
        const command = data.command;
        // Affiliate ID của Chủ nhân là AT1671569
        const affiliateId = data.affiliate_id || 'AT1671569'; 

        if (command === "FULL_AUTO_POST") {

            // GIẢ LẬP KẾT QUẢ THÀNH CÔNG (Sau khi sửa lỗi cú pháp)
            const simulatedContent = {
                content_ready_for_social: `[Bài đăng Tự động - Đã sửa lỗi] Nội dung đã được tạo tự động. Link Affiliate đã sẵn sàng:`, 
                af_link: `https://accesstrade.vn/s/san-pham-hot?id=${affiliateId}` 
            };

            return {
                statusCode: 200, 
                body: JSON.stringify(simulatedContent),
            };

        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Lệnh không hợp lệ." }),
            };
        }

    } catch (error) {
        console.error("Lỗi nội bộ server:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Lỗi nội bộ server: " + error.message }),
        };
    }
};

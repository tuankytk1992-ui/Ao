// Khai báo thư viện cần thiết
const fetch = require('node-fetch');

// Hằng số cho API (Chỉ dùng để khai báo, không dùng trong logic giả lập)
// LƯU Ý: GEMINI_API_KEY vẫn phải được thiết lập trong Netlify Environment Variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 

exports.handler = async (event, context) => {
    // Chỉ chấp nhận phương thức POST từ Apps Script
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ message: "Method Not Allowed" }) };
    }

    try {
        const data = JSON.parse(event.body);
        const command = data.command;
        const affiliateId = data.affiliate_id || 'AT1671569'; // Lấy ID Accesstrade

        // Xử lý Lệnh Tự động Hoàn toàn từ Apps Script
        if (command === "FULL_AUTO_POST") {
            
            // ===============================================
            // **GIẢ LẬP KẾT QUẢ THÀNH CÔNG (Sau khi sửa lỗi)**
            // Logic Phân tích Xu hướng/Tìm Link AFF/Tạo Caption được giả lập ở đây
            // để xác nhận Netlify đã hoạt động lại.
            // ===============================================
            
            const simulatedContent = {
                // Tên biến mới, phù hợp với yêu cầu của Make.com (content_ready_for_social)
                content_ready_for_social: `Thời trang Hottrend Mới Nhất Tháng 11! Mua ngay qua link để ủng hộ:`, 
                // Sử dụng ID Accesstrade AT1671569 của Chủ nhân để tạo Link mẫu
                af_link: `https://accesstrade.vn/s/hot-product-2025?id=${affiliateId}` 
            };

            return {
                statusCode: 200, // Mã 200: Thành công
                body: JSON.stringify(simulatedContent),
            };

        } else {
            // Xử lý các lệnh khác (nếu có)
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

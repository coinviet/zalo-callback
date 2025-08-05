// server.js
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

// ✅ Bật CORS cho tất cả domain gọi tới
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Route GET kiểm tra server
app.get("/", (req, res) => {
  res.send("✅ Server Railway hoạt động! Dùng POST để gửi callback từ Zalo Mini App.");
});

// ✅ Cho phép test cả POST / và POST /callback
const handleCallback = (req, res) => {
  try {
    const data = req.body;
    const timestamp = new Date().toISOString();
    const orderId = Date.now().toString();

    console.log(`📥 [${timestamp}] Đã nhận đơn hàng:`);
    console.log(JSON.stringify(data, null, 2));

    // 👉 Bạn có thể xử lý thêm ở đây: gửi Telegram, lưu DB, gửi email...

    res.status(200).json({ status: "received", order_id: orderId });
  } catch (err) {
    console.error("❌ Lỗi xử lý callback:", err);
    res.status(500).send("Internal Server Error");
  }
};

// ✅ Nhận từ Zalo hoặc curl ở 2 đường dẫn
app.post("/", handleCallback);
app.post("/callback", handleCallback);

// ✅ Bắt đầu server
app.listen(port, () => {
  console.log(`🚀 Server chạy tại http://localhost:${port}`);
});

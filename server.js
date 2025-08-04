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

// ✅ Route kiểm tra server
app.get("/", (req, res) => {
  res.send("✅ Server Node.js Railway đã sẵn sàng nhận callback.");
});

// ✅ Nhận callback từ Zalo Mini App
app.post("/callback", (req, res) => {
  try {
    const data = req.body;
    const timestamp = new Date().toISOString();
    const orderId = Date.now().toString();

    // ✅ Ghi log ra console (xem trên Railway Logs)
    console.log(`📥 [${timestamp}] Callback nhận được:`, JSON.stringify(data, null, 2));

    // ✅ Trả phản hồi đúng định dạng
    res.status(200).json({ order_id: orderId });
  } catch (err) {
    console.error("❌ Lỗi xử lý callback:", err);
    res.status(500).send("Internal Server Error");
  }
});

// ✅ Bắt đầu server
app.listen(port, () => {
  console.log(`🚀 Server chạy tại: http://localhost:${port}`);
});

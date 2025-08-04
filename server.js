const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 8000;

// ✅ Bật CORS thủ công
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("✅ Server Node.js đang chạy.");
});

app.post("/zalo-callback", (req, res) => {
  try {
    const data = req.body;
    const logsDir = path.join(__dirname, "logs");
    const logFile = path.join(logsDir, "zalo-callback.log");

    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}]\n${JSON.stringify(data, null, 2)}\n---\n`;

    console.log("📩 Dữ liệu từ Zalo gửi về:", data);
    fs.appendFileSync(logFile, logEntry);

    const orderId = Date.now().toString();
    res.status(200).json({ order_id: orderId });
  } catch (err) {
    console.error("❌ Lỗi xử lý:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`🚀 Server chạy tại http://localhost:${port}`);
});

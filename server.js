const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const fetch = require("node-fetch");

// ✅ TOKEN & CHAT_ID thực tế
const TELEGRAM_BOT_TOKEN = "8376432611:AAGU7l5Crf_JCqueN-PLj85HR4uenkChgcE";
const TELEGRAM_CHAT_ID = "6940639835";
const TELEGRAM_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Bật CORS cho test/debug
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// ✅ Gửi tin nhắn về Telegram
const sendTelegramMessage = async (text) => {
  await fetch(TELEGRAM_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: "Markdown",
    }),
  });
};

// ✅ Format nội dung đơn hàng
const formatOrderMessage = (data) => {
  const { order_id, user_id, status, total_amount, note, items, extra_info } = data;

  const name = extra_info?.address?.name || "Không rõ";
  const phone = extra_info?.address?.phone || "Không có";
  const address = extra_info?.address?.detail || "Không có địa chỉ";

  const itemLines = items
    .map((item) => `• ${item.name} × ${item.quantity} = ${(item.price * item.quantity).toLocaleString()}₫`)
    .join("\n");

  return `
🛒 *Đơn hàng mới từ Mini App Tech Care*
🔢 Mã đơn: *${order_id}*
👤 Khách: *${name}*
📞 SĐT: *${phone}*
📍 Địa chỉ: ${address}
🗒 Ghi chú: ${note || "Không có"}

📦 Sản phẩm:
${itemLines}

💵 Tổng tiền: *${(total_amount || 0).toLocaleString()}₫*
📌 Trạng thái: *${status || "unknown"}*
`;
};

// ✅ Hàm xử lý đơn hàng
const handleCallback = async (req, res) => {
  try {
    const data = req.body;
    const logTime = new Date().toISOString();
    console.log(`📥 [${logTime}] Đã nhận đơn hàng:`);
    console.log(JSON.stringify(data, null, 2));

    // ✅ Gửi về Telegram
    const message = formatOrderMessage(data);
    await sendTelegramMessage(message);

    // ✅ Trả lời lại cho Zalo
    res.status(200).json({
      status: "received",
      order_id: data.order_id || Date.now().toString(),
    });
  } catch (err) {
    console.error("❌ Lỗi xử lý đơn hàng:", err);
    res.status(500).send("Internal Server Error");
  }
};

// ✅ Route kiểm tra server sống
app.get("/", (req, res) => {
  res.send("✅ Server Railway đang hoạt động – sẵn sàng nhận đơn hàng.");
});

// ✅ Nhận callback đơn hàng Zalo (POST / và /callback đều được)
app.post("/", handleCallback);
app.post("/callback", handleCallback);

// ✅ Khởi chạy server
app.listen(port, () => {
  console.log(`🚀 Server chạy tại http://localhost:${port}`);
});

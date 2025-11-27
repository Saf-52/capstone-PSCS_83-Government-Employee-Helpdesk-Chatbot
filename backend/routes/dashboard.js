const express = require("express");
const router = express.Router();
const Chat = require("../models/chatModel"); // ✅ correct relative path

// 📊 Get dashboard statistics
router.get("/stats", async (req, res) => {
  try {
    const chats = await Chat.find();

    const totalChats = chats.length;
    const userMessages = chats.filter((c) => c.sender === "user").length;
    const botMessages = chats.filter((c) => c.sender === "bot").length;

    // Show the last 10 conversations
    const last10 = chats.slice(-10).map((c) => ({
      message: c.message,
      response: c.response,
      time: c.timestamp,
    }));

    res.json({
      totalChats,
      userMessages,
      botMessages,
      recent: last10,
    });
  } catch (err) {
    console.error("❌ Dashboard error:", err.message);
    res.status(500).json({ error: "Failed to load stats" });
  }
});

module.exports = router;
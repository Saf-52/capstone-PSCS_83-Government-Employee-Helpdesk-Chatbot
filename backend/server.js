// ✅ Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");

// ✅ Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/helpdesk";
const RASA_URL = process.env.RASA_URL || "http://localhost:5005/webhooks/rest/webhook";

// ✅ Connect to MongoDB
mongoose
  .connect(MONGO_URI, { dbName: "helpdesk" })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ✅ Define Chat schema & model
const chatSchema = new mongoose.Schema({
  sender: String,
  message: String,
  response: String,
  timestamp: { type: Date, default: Date.now },
});
const Chat = mongoose.model("Chat", chatSchema);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Government Helpdesk Backend is Running 🚀");
});

// ✅ Chat route — Communicates with Rasa
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ response: "Message is required" });

    console.log("📩 Incoming user message:", message);

    // Send message to Rasa backend
    const rasaResponse = await axios.post(RASA_URL, {
      sender: "user",
      message,
    });

    const botReply =
      rasaResponse.data && rasaResponse.data[0] && rasaResponse.data[0].text
        ? rasaResponse.data[0].text
        : "🤖 No response from Rasa";

    // Save conversation to MongoDB
    await Chat.create({ sender: "user", message, response: botReply });

    console.log("💬 Bot response:", botReply);
    res.json({ response: botReply });
  } catch (err) {
    console.error("❌ Error communicating with Rasa:", err.message);
    res.status(500).json({ response: "⚠️ Server not reachable or Rasa is down" });
  }
});

// ✅ Import & use Dashboard Routes
const dashboardRoutes = require("./routes/dashboard");
app.use("/api/dashboard", dashboardRoutes);

// ✅ Start the backend server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`🔗 Connected to Rasa at: ${RASA_URL}`);
});

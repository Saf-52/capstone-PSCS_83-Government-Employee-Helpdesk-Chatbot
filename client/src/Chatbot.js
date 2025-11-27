import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "./App.css";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (transcript && listening) setInput(transcript);
  }, [transcript, listening]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", { message: input });
      const botMessage = { sender: "bot", text: res.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Server not reachable. Please try again later." },
      ]);
    }

    setInput("");
    resetTranscript();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <header className="chat-header">💬 Chat with Helpdesk</header>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <button className="send-btn" onClick={handleSend}>Send</button>

        {/* ✅ UPDATED MIC BUTTON (Toggle Start/Stop) */}
        <button
          className={`mic-btn ${listening ? "listening" : ""}`}
          onClick={() => {
            if (listening) {
              SpeechRecognition.stopListening(); // 🔴 Stop
            } else {
              SpeechRecognition.startListening({
                continuous: true,
                language: "en-IN",
              }); // 🎤 Start
            }
          }}
        >
          {listening ? "🛑" : "🎤"}
        </button>
      </div>
    </div>
  );
}

export default Chatbot;

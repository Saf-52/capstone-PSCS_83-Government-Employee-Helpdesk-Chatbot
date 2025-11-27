import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Chatbot from "./Chatbot";
import Dashboard from "./Dashboard";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <h2>🏛️ Government Helpdesk Chatbot</h2>
          <div className="nav-links">
            <Link to="/">💬 Chat</Link>
            <Link to="/dashboard">📊 Dashboard</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Chatbot />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

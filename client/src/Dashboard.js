import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./Dashboard.css";

function Dashboard() {
  const [data, setData] = useState(null);

  // Fetch analytics data from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dashboard/stats")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Dashboard fetch error:", err));
  }, []);

  if (!data) return <div className="dashboard">Loading dashboard...</div>;

  const COLORS = ["#0078FF", "#FFB400"];

  const messageData = [
    { name: "User Messages", value: data.userMessages },
    { name: "Bot Messages", value: data.botMessages },
  ];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>📊 Government Helpdesk Analytics Dashboard</h1>
        <p>Real-time statistics from your chatbot system</p>
      </header>

      {/* Summary cards */}
      <div className="stats-container">
        <div className="stat-box glass">
          <h3>💬 Total Chats</h3>
          <p>{data.totalChats}</p>
        </div>
        <div className="stat-box glass">
          <h3>👤 User Messages</h3>
          <p>{data.userMessages}</p>
        </div>
        <div className="stat-box glass">
          <h3>🤖 Bot Responses</h3>
          <p>{data.botMessages}</p>
        </div>
      </div>

      {/* Charts section */}
      <div className="chart-section">
        
        {/* PIE CHART */}
        <div className="chart-card glass">
          <h3>📈 Messages Ratio</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={messageData}
                dataKey="value"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {messageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* UPDATED RECENT CONVERSATIONS BAR CHART */}
        <div className="chart-card glass">
          <h3>📊 Recent Conversations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data.recent.map((d) => ({
                message: d.message.slice(0, 15) + "...",
                length: d.response.length,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="message" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="length" fill="#00BFFF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent message list */}
      <div className="recent-section glass">
        <h3>🕓 Recent User Queries</h3>
        {data.recent.length === 0 ? (
          <p>No recent chats available</p>
        ) : (
          <ul>
            {data.recent.map((chat, i) => (
              <li key={i}>
                <strong>User:</strong> {chat.message} <br />
                <strong>Bot:</strong> {chat.response} <br />
                <small>{new Date(chat.time).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

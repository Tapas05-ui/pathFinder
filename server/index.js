require("dotenv").config();
const express  = require("express");
const cors     = require("cors");
const mongoose = require("mongoose");

const authRoutes    = require("./routes/auth");
const chatRoutes    = require("./routes/chat");
const roadmapRoutes = require("./routes/roadmap");
const checkinRoutes = require("./routes/checkin");

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth",    authRoutes);
app.use("/api/chat",    chatRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/checkin", checkinRoutes);

// Health check
app.get("/", (_req, res) => res.json({ message: "PathFinder API running 🚀" }));

// 404 handler — catches any unknown route and shows a clear message
app.use((_req, res) => {
  res.status(404).json({ message: `Route ${_req.method} ${_req.originalUrl} not found` });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
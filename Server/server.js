// src/app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morganMiddleware = require("./config/morgan");
const connectDB = require("./config/database");
const authRoutes = require("./routes/auth.routes");
const leaderboardRoutes = require("./routes/leaderboard.routes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morganMiddleware.dev);
} else {
  app.use(morganMiddleware.prod);
}

// Routes
app.use("/auth", authRoutes);
app.use("/leaderboard", leaderboardRoutes);

const startServer = async () => {
  try {
    await connectDB(); // Wait for MongoDB connection

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

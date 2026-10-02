import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import pool from "./config/database";
import resourceRoutes from "./routes/resourceRoutes";

dotenv.config();

const app = express();

// ================================
// Middleware
// ================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================================
// Home Route
// ================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ResourceX Backend API is running 🚀",
  });
});

// ================================
// Health Check
// ================================

app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT 1 AS connected"
    );

    res.json({
      success: true,
      message: "ResourceX backend and MySQL are connected 🚀",
      database: rows,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// ================================
// Resource API
// ================================

app.use("/api/resources", resourceRoutes);

// ================================
// 404 Handler
// ================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ================================
// Error Handler
// ================================

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Server error:", err);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
);

// ================================
// Export App
// ================================

export default app;
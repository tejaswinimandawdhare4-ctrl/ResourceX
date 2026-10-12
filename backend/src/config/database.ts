import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Use Railway DATABASE_URL only if reachable or in Railway environment
const isRailwayInternal = process.env.DATABASE_URL?.includes("railway.internal");
const pool =
  process.env.DATABASE_URL && (!isRailwayInternal || process.env.RAILWAY_ENVIRONMENT)
    ? mysql.createPool(process.env.DATABASE_URL)
    : mysql.createPool({
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "resourcex",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

export default pool;
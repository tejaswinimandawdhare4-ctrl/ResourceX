import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/database";

const JWT_SECRET = process.env.JWT_SECRET || "resourcex_jwt_secret_fallback";
const SALT_ROUNDS = 10;

// =====================================================
// REGISTER
// POST /api/auth/register
// =====================================================

export const register = async (req: Request, res: Response) => {
  try {
    const {
      business_name,
      business_type,
      email,
      password,
      city,
      role, // "provider" | "seeker"
    } = req.body;

    if (!business_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "business_name, email, and password are required",
      });
    }

    // Check if email already exists
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if ((existing as any[]).length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user with uppercase enum for MySQL
    const dbRole = (role || "provider").toUpperCase() === "SEEKER" ? "SEEKER" : "PROVIDER";
    const [userResult] = await pool.query(
      `INSERT INTO users (email, password_hash, role, is_active) VALUES (?, ?, ?, TRUE)`,
      [email, passwordHash, dbRole]
    );

    const userId = (userResult as any).insertId;

    // Create business record
    const [bizResult] = await pool.query(
      `INSERT INTO businesses (user_id, business_name, business_type, city, is_verified)
       VALUES (?, ?, ?, ?, FALSE)`,
      [userId, business_name, business_type || "Hotel", city || "Mumbai"]
    );

    const businessId = (bizResult as any).insertId;
    const clientRole = dbRole.toLowerCase() as "provider" | "seeker";

    // Issue JWT
    const token = jwt.sign(
      { userId, businessId, email, role: clientRole },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: userId,
        email,
        role: clientRole,
        businessId,
        businessName: business_name,
        businessType: business_type || "Hotel",
        city: city || "Mumbai",
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
};

// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const [rows] = await pool.query(
      `SELECT u.id, u.email, u.password_hash, u.role, u.is_active,
              b.id AS business_id, b.business_name, b.business_type,
              b.city, b.is_verified, b.rating
       FROM users u
       LEFT JOIN businesses b ON b.user_id = u.id
       WHERE u.email = ?`,
      [email]
    );

    const users = rows as any[];

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "This account has been deactivated. Contact support.",
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Issue JWT
    const clientRole = ((role || user.role || "provider").toString().toLowerCase() === "seeker"
      ? "seeker"
      : "provider") as "provider" | "seeker";

    const token = jwt.sign(
      {
        userId: user.id,
        businessId: user.business_id,
        email: user.email,
        role: clientRole,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: clientRole,
        businessId: user.business_id,
        businessName: user.business_name,
        businessType: user.business_type,
        city: user.city,
        isVerified: user.is_verified,
        rating: user.rating,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
};

// =====================================================
// GET CURRENT USER
// GET /api/auth/me
// =====================================================

export const getMe = async (req: Request, res: Response) => {
  try {
    // req.user is set by the auth middleware
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const [rows] = await pool.query(
      `SELECT u.id, u.email, u.phone, u.role, u.is_active,
              b.id AS business_id, b.business_name, b.business_type,
              b.contact_person, b.contact_phone, b.city, b.address,
              b.description, b.is_verified, b.rating, b.total_reviews,
              b.completed_exchanges
       FROM users u
       LEFT JOIN businesses b ON b.user_id = u.id
       WHERE u.id = ?`,
      [userId]
    );

    const users = rows as any[];

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const user = users[0];

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        phone: user.contact_phone || user.phone || "",
        role: (user.role || "provider").toString().toLowerCase() === "seeker" ? "seeker" : "provider",
        businessId: user.business_id,
        businessName: user.business_name,
        businessType: user.business_type,
        contactPerson: user.contact_person || "",
        contactPhone: user.contact_phone || user.phone || "",
        city: user.city,
        address: user.address || "",
        description: user.description || "",
        isVerified: !!user.is_verified,
        rating: user.rating,
        totalReviews: user.total_reviews,
        completedExchanges: user.completed_exchanges,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};

// =====================================================
// UPDATE USER PROFILE
// PUT /api/auth/profile
// =====================================================

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const {
      business_name,
      business_type,
      contact_person,
      contact_phone,
      city,
      address,
      description,
    } = req.body;

    // Check if business exists for user
    const [bizRows] = await pool.query<any[]>(
      "SELECT id FROM businesses WHERE user_id = ?",
      [userId]
    );

    if (bizRows.length === 0) {
      await pool.query(
        `INSERT INTO businesses (user_id, business_name, business_type, contact_person, contact_phone, city, address, description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          business_name || "My Business",
          business_type || "Hotel",
          contact_person || null,
          contact_phone || null,
          city || "Mumbai",
          address || null,
          description || null,
        ]
      );
    } else {
      await pool.query(
        `UPDATE businesses
         SET business_name = COALESCE(?, business_name),
             business_type = COALESCE(?, business_type),
             contact_person = ?,
             contact_phone = ?,
             city = COALESCE(?, city),
             address = ?,
             description = ?
         WHERE user_id = ?`,
        [
          business_name,
          business_type,
          contact_person || null,
          contact_phone || null,
          city,
          address || null,
          description || null,
          userId,
        ]
      );
    }

    // Fetch updated user & business
    const [rows] = await pool.query<any[]>(
      `SELECT u.id, u.email, u.phone, u.role, u.is_active,
              b.id AS business_id, b.business_name, b.business_type,
              b.contact_person, b.contact_phone, b.city, b.address,
              b.description, b.is_verified, b.rating, b.total_reviews,
              b.completed_exchanges
       FROM users u
       LEFT JOIN businesses b ON b.user_id = u.id
       WHERE u.id = ?`,
      [userId]
    );

    const user = rows[0];

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user.id,
        email: user.email,
        phone: user.contact_phone || user.phone || "",
        role: (user.role || "provider").toString().toLowerCase() === "seeker" ? "seeker" : "provider",
        businessId: user.business_id,
        businessName: user.business_name,
        businessType: user.business_type,
        contactPerson: user.contact_person || "",
        contactPhone: user.contact_phone || user.phone || "",
        city: user.city,
        address: user.address || "",
        description: user.description || "",
        isVerified: !!user.is_verified,
        rating: user.rating,
        totalReviews: user.total_reviews,
        completedExchanges: user.completed_exchanges,
      },
    });
  } catch (error) {
    console.error("UpdateProfile error:", error);
    return res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};

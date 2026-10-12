import pool from "../config/database";
import bcrypt from "bcrypt";

async function runMigration() {
  console.log("Running auth migration...");
  try {
    // 1. Check if is_active column exists on users
    const [cols] = await pool.query<any[]>(
      "SHOW COLUMNS FROM users LIKE 'is_active'"
    );

    if (cols.length === 0) {
      await pool.query(
        "ALTER TABLE users ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE"
      );
      console.log("✓ Added is_active column to users table");
    } else {
      console.log("✓ is_active column already exists");
    }

    // 2. Set default password for users with null password_hash
    const hash = await bcrypt.hash("demo1234", 10);
    const [updateResult] = await pool.query<any>(
      "UPDATE users SET password_hash = ? WHERE password_hash IS NULL",
      [hash]
    );
    console.log(`✓ Set default demo password (demo1234) for ${updateResult.affectedRows} users`);

    // 3. Create a demo user for ops@hotelhorizon.in if not already present
    const [existingOps] = await pool.query<any[]>(
      "SELECT id FROM users WHERE email = 'ops@hotelhorizon.in'"
    );

    if (existingOps.length === 0) {
      const [uRes] = await pool.query<any>(
        "INSERT INTO users (email, password_hash, role, is_active) VALUES ('ops@hotelhorizon.in', ?, 'PROVIDER', TRUE)",
        [hash]
      );
      const userId = uRes.insertId;
      await pool.query(
        "INSERT INTO businesses (user_id, business_name, business_type, city, is_verified, rating) VALUES (?, 'Hotel Horizon Mumbai', 'Hotel', 'Mumbai', TRUE, 4.8)",
        [userId]
      );
      console.log("✓ Created demo account: ops@hotelhorizon.in / demo1234");
    } else {
      console.log("✓ ops@hotelhorizon.in account already exists");
    }

    console.log("Migration completed successfully!");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    process.exit(0);
  }
}

runMigration();

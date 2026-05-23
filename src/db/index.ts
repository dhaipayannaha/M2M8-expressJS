import { Pool } from "pg"
import config from '../config/index.js';

export const pool = new Pool({
  connectionString: config.database.connectionString
})

export const initDB = async () => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50),
      email VARCHAR(50) NOT NULL UNIQUE,
      password text NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      age INT,
      role VARCHAR(15) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "profiles" (
      id SERIAL PRIMARY KEY,
      user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      bio TEXT,
      address TEXT,
      phone VARCHAR(15),
      gender VARCHAR(10),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )`);
    console.log("Database initialized successfully")
  } catch (error) {
    console.log(error);
  }
}
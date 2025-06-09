import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
// import dotenv from "dotenv"; // Assuming dotenv is handled elsewhere or via Next.js

// dotenv.config(); // Assuming dotenv is handled elsewhere or via Next.js

// Use environment variables for database connection
const connectionString = process.env.DATABASE_URL;

// Check if connection string is defined
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not defined.");
}

// Create the pool connection
const pool = new Pool({
  connectionString: connectionString,
  ssl: false // Disable SSL
});

// Create drizzle instance
export const db = drizzle(pool, { schema });

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

// Ensure Neon URL is provided
if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL must be set in .env");
}

// PostgreSQL pool (Neon recommended)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Needed for Neon + Railway
  },
});

// Drizzle using Node Postgres
export const db = drizzle(pool, {
  schema,
  logger: false,
});

export { schema };

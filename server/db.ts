import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { env } from "./config/env.js";
import * as schema from "../shared/schema.js";

const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql, { schema });

// Health check function
export async function checkDbHealth(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}
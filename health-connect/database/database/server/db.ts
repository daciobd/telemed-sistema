import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { z } from "zod";
import * as schema from "@shared/schema";

const env = z.object({ 
  DATABASE_URL: z.string() 
}).parse(process.env);

export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool, { schema });
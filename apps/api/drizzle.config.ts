import dotenv from "dotenv";
dotenv.config();

import type { Config } from "drizzle-kit";

export default {
  schema: "src/shared/db/schema.ts",
  out: "drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DB_URL as string
  }
} satisfies Config;

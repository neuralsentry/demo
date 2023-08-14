import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import { config } from "@/shared/config";

const client = postgres(config.db.url);

export const db = drizzle(client);

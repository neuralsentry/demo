import dotenv from "dotenv";
dotenv.config();

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const sql = postgres(process.env.DB_URL as string, { max: 1 });
const db = drizzle(sql);

async function main() {
  await migrate(db, { migrationsFolder: "drizzle" });
}

main()
  .then(() => {
    console.log("Migration complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.log("Migration failed!");
    console.log("Error:", error);
    process.exit(1);
  });

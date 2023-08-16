import dotenv from "dotenv";
dotenv.config();

import chalk from "chalk";
import postgres from "postgres";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";

import { cve, func, model, modelPrediction } from "../src/shared/db/schema";

const postgresql = postgres(process.env.DB_URL as string, { max: 1 });
const db = drizzle(postgresql);

const dropTables = sql`TRUNCATE ${cve}, ${func}, ${model}, ${modelPrediction}
RESTART IDENTITY CASCADE;`;

async function main() {
  console.log(chalk.blue("[*] Cleaning Database..."));
  await db.execute(dropTables);
}

main()
  .then(() => {
    console.log(chalk.green("[+] Database Cleaned"));
    process.exit(0);
  })
  .catch((err) => {
    console.log(chalk.red("[!] Failed Database Clean"));
    console.error(err);
    process.exit(1);
  });

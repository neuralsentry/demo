import dotenv from "dotenv";
dotenv.config();

import chalk from "chalk";
import fs from "fs/promises";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import { cve, func, model, modelPrediction } from "../src/shared/db/schema";

const sql = postgres(process.env.DB_URL as string, { max: 1 });
const db = drizzle(sql);

async function main() {
  const cves: any[] = JSON.parse(await fs.readFile("./bin/cves.json", "utf-8"));
  const functions: any[] = JSON.parse(
    await fs.readFile("./bin/functions.json", "utf-8")
  );
  const models: any[] = JSON.parse(
    await fs.readFile("./bin/models.json", "utf-8")
  );
  const modelPredictions: any[] = JSON.parse(
    await fs.readFile("./bin/model_predictions.json", "utf-8")
  );

  await db
    .insert(cve)
    .values(cves.map(({ cve, ...c }) => ({ ...c, name: cve })));
  await db
    .insert(func)
    .values(
      functions.map(({ cve, ...f }) => ({ ...f, cve_name: cve ?? undefined }))
    );
  await db.insert(model).values(models);

  const batchSize = 1000;
  for (let i = 0; i < modelPredictions.length; i += batchSize) {
    await db
      .insert(modelPrediction)
      .values(modelPredictions.slice(i, i + batchSize));
  }
}

main()
  .then(() => {
    console.log(chalk.green("[+] Database Seeded"));
    process.exit(0);
  })
  .catch((err) => {
    console.log(chalk.red("[!] Failed Database Seed"));
    console.error(err);
    process.exit(1);
  });

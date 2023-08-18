import z from "zod";
import { Router } from "express";
import httpError from "http-errors";
import httpStatus from "http-status";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql, and, lte, gte, eq, not, like, or } from "drizzle-orm";

import { validate } from "@/shared/utils";
import { client } from "@/shared/db/client";
import * as schema from "@/shared/db/schema";
import { cve, func } from "@/shared/db/schema";

const db = drizzle(client, { schema });

const getCVEsSchema = z.object({
  query: z.object({
    search: z.string().default(""),
    limit: z.coerce.number().min(1).max(50).default(10),
    page: z.coerce.number().min(1).default(1),
    num_lines: z.coerce.number().min(1).default(10),
    include_code: z
      .string()
      .transform((v) => (v.length >= 0 ? true : false))
      .optional()
  })
});

export const routes = Router()
  .get("/cves", async (req, res) => {
    const {
      query: { search, limit, page, num_lines, include_code }
    } = await validate(getCVEsSchema, req);

    const cves = await db.query.cve.findMany({
      with: {
        funcs: {
          columns: include_code ? undefined : { code: false },
          with: {
            model_predictions: true
          },
          where: lte(func.num_lines, num_lines)
        }
      },
      limit: limit,
      offset: (page - 1) * limit,
      where: or(
        like(cve.name, `%${search}%`),
        like(cve.description, `%${search}%`)
      )
    });

    res.json({ meta: { count: cves.length }, data: cves });
  })
  .get("/cves/count", async (req, res) => {
    const data = await db
      .select({
        count: sql`count(*)`.mapWith(Number)
      })
      .from(schema.cve);
    const count = data[0].count;
    res.json({ data: { count } });
  })
  .get("/non-vulnerable-functions-count", async (req, res) => {
    const data = await db
      .select({
        count: sql`count(*)`.mapWith(Number)
      })
      .from(schema.func)
      .where(not(eq(schema.func.labels, 1)));

    const count = data[0].count;

    res.json({ data: { count } });
  })
  .get("/functions", async (req, res) => {
    const randomise = typeof req.query.randomise === "string";
    const minNumLines = req.query.minNumLines as string | undefined;
    const maxNumLines = req.query.maxNumLines as string | undefined;
    const { limit = 50, offset = 0 } = req.query;

    const numRegex = /^\d+$/;
    if (!numRegex.test(limit as string)) {
      throw httpError(httpStatus.BAD_REQUEST, "limit must be an integer");
    }
    if (!numRegex.test(offset as string)) {
      throw httpError(httpStatus.BAD_REQUEST, "offset must be an integer");
    }
    if (maxNumLines && !numRegex.test(maxNumLines)) {
      throw httpError(httpStatus.BAD_REQUEST, "maxNumLines must be an integer");
    }

    const limitInt = parseInt(limit as string, 10);

    if (limitInt > 50 || limitInt < 1) {
      throw httpError(httpStatus.BAD_REQUEST, "limit must be between 1 and 50");
    }

    const offsetInt = parseInt(offset as string, 10);
    if (offsetInt < 0) {
      throw httpError(httpStatus.BAD_REQUEST, "offset must be greater than 0");
    }

    const minNumLinesInt = minNumLines ? parseInt(minNumLines, 10) : undefined;
    if (minNumLinesInt && minNumLinesInt < 1) {
      throw httpError(
        httpStatus.BAD_REQUEST,
        "minNumLines must be greater than 0"
      );
    }

    const maxNumLinesInt = maxNumLines ? parseInt(maxNumLines, 10) : undefined;
    if (maxNumLinesInt && maxNumLinesInt < 1) {
      throw httpError(
        httpStatus.BAD_REQUEST,
        "maxNumLines must be greater than 0"
      );
    }

    if (minNumLinesInt && maxNumLinesInt && minNumLinesInt > maxNumLinesInt) {
      throw httpError(
        httpStatus.BAD_REQUEST,
        "minNumLines must be less than maxNumLines"
      );
    }

    const funcs = await db.query.func.findMany({
      with: { cve: true, model_predictions: true },
      limit: limitInt,
      offset: offsetInt,
      orderBy: randomise ? sql`random()` : sql`id`,
      where: and(
        gte(schema.func.num_lines, minNumLinesInt ?? 0),
        lte(schema.func.num_lines, maxNumLinesInt ?? 1000000)
      )
    });

    res.json({ meta: { count: funcs.length }, data: funcs });
  });

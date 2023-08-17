import cors from "cors";
import morgan from "morgan";
import express from "express";
import httpError from "http-errors";
import httpStatus from "http-status";
import rateLimit from "express-rate-limit";

import { config } from "@/shared/config";
import { errorHandler } from "@/shared/middlewares";

import { routes } from "./routes";

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers,
  statusCode: httpStatus.TOO_MANY_REQUESTS,
  handler: (req, res, next, options) => {
    throw httpError(options.statusCode, options.message);
  }
});

export function main() {
  const app = express();

  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // app.use(limiter);
  app.use(
    cors({
      origin: "*"
    })
  );

  app.use("/api", routes);

  app.listen(config.server.port, () => {
    console.log(`Server is running on port ${config.server.port}`);
  });

  app.use((req, res) => {
    throw httpError(httpStatus.NOT_FOUND);
  });
  app.use(errorHandler);

  return app;
}

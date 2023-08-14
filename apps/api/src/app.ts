import morgan from "morgan";
import express from "express";
import httpError from "http-errors";
import httpStatus from "http-status";

import { config } from "@/shared/config";
import { errorHandler } from "@/shared/middlewares";

import { routes } from "./routes";

export function main() {
  const app = express();

  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", routes);

  app.listen(config.server.port, () => {
    console.log(`Server is running on port ${config.server.port}`);
  });

  app.use((req, res) => {
    throw httpError(httpStatus.NOT_FOUND, "Not Found");
  });
  app.use(errorHandler);

  return app;
}

import { Router } from "express";

const v1 = Router();

export const routes = Router().use("/v1", v1);

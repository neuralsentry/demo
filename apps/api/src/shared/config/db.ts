const DEFAULT_URL = "postgres://postgres:postgres@localhost:5432/postgres";

export const db = {
  url: process.env.DB_URL || DEFAULT_URL
};

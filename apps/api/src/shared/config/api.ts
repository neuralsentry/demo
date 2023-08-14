const DEFAULT_ROW_LIMIT = 100;

export const api = {
  rowLimit: Number(process.env.API_ROW_LIMIT) || DEFAULT_ROW_LIMIT
};

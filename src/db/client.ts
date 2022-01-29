import { config } from "@config/config";
import { Pool } from "pg";

const pool = new Pool(config.db);

const query = async <T>(sql: string, values?: Array<string | number>) => {
  const response = await pool.query(sql, values);
  return response?.rows as T[];
};

const querySingle = async <T = any>(
  sql: string,
  values?: Array<string | number>
) => {
  const response = await pool.query(sql, values);
  return response?.rows?.[0] as T;
};

const db = { pool, query, querySingle };

export { db };

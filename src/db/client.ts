import { Pool } from "pg";
import { config } from "src/config/config";

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

import { config } from "@config/config";
import { Pool } from "pg";

const pool = new Pool(config.db);

const query = async <T>(
  sql: string,
  values?: Array<string | number>
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    pool.query<T[], any>(sql, values, (error, result) => {
      if (error) reject(error);
      else resolve(result?.rows as T[]);
    });
  });
};

const querySingle = async <T = any>(
  sql: string,
  values?: Array<string | number>
): Promise<T> => {
  return new Promise((resolve, reject) => {
    pool.query<T[], any>(sql, values, (error, result) => {
      if (error) reject(error);
      resolve(result?.rows?.[0] as T);
    });
  });
};

const mutate = async <T = any>(
  sql: string,
  values?: Array<string | number>
): Promise<T> => {
  return new Promise((resolve, reject) => {
    pool.query<T[], any>(sql, values, (error, result) => {
      if (error) reject(error);
      resolve(result?.rows?.[0] as T);
    });
  });
};

const db = { query, querySingle, mutate };

export { db };

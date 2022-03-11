import { config } from "@config/config";
import mysql from "mysql";

const pool = mysql.createPool(config.db);

const query = async <T>(
  sql: string,
  values?: Array<string | number>
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (error, results) => {
      if (error) reject(error);
      else resolve(results as T[]);
    });
  });
};

const querySingle = async <T = any>(
  sql: string,
  values?: Array<string | number>
): Promise<T> => {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (error, results) => {
      if (error) reject(error);
      resolve(results?.[0] as T);
    });
  });
};

const mutate = async <T = any>(
  sql: string,
  values?: Array<string | number>
): Promise<T> => {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (error, result) => {
      if (error) reject(error);
      resolve(result?.insertId);
    });
  });
};

const db = { query, querySingle, mutate };

export { db };

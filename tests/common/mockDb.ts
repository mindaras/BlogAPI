import { Pool } from "pg";
import { config } from "../../src/config/config";
import { db } from "../../src/db/client";

const mockDb = () => {
  const pool = new Pool({
    ...config.db,
    max: 1,
    idleTimeoutMillis: 0,
  });

  db.query = async <T>(sql: string, values?: Array<string | number>) => {
    const response = await pool.query(sql, values);
    return response?.rows as T[];
  };

  db.querySingle = async <T = any>(
    sql: string,
    values?: Array<string | number>
  ) => {
    const response = await pool.query(sql, values);
    return response?.rows?.[0] as T;
  };
};

export { mockDb };

import mysql from "mysql";
import { config } from "../../src/config/config";
import { db } from "../../src/db/client";

const mockDb = () => {
  const connection = mysql.createConnection(config.db);

  connection.connect();

  db.query = async <T>(
    sql: string,
    values?: Array<string | number>
  ): Promise<T[]> => {
    return new Promise((resolve, reject) => {
      connection.query(sql, values, (error, results) => {
        if (error) reject(error);
        else resolve(results as T[]);
      });
    });
  };

  db.querySingle = async <T = any>(
    sql: string,
    values?: Array<string | number>
  ): Promise<T> => {
    return new Promise((resolve, reject) => {
      connection.query(sql, values, (error, results) => {
        if (error) reject(error);
        resolve(results?.[0] as T);
      });
    });
  };

  db.mutate = async <T = any>(
    sql: string,
    values?: Array<string | number>
  ): Promise<T> => {
    return new Promise((resolve, reject) => {
      connection.query(sql, values, (error, result) => {
        if (error) reject(error);
        resolve(result.insertId);
      });
    });
  };

  return { connection };
};

export { mockDb };

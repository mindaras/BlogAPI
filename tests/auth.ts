import { expect } from "chai";
import { Pool } from "pg";
import request from "supertest";
import { Express } from "express";
import { config } from "../src/config/config";
import { db } from "../src/db/client";

describe("Note route", function () {
  let app: Express;

  before("Mock db connection and load app", async function () {
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

    app = require("../src/index").app;
  });

  beforeEach("Create temporary tables", async function () {
    await db.query(`
      CREATE TEMPORARY TABLE users (LIKE users INCLUDING ALL);
      CREATE TEMPORARY TABLE posts (LIKE posts INCLUDING ALL);`);
  });

  afterEach("Drop temporary tables", async function () {
    await db.query(`
      DROP TABLE IF EXISTS pg_temp.posts;
      DROP TABLE IF EXISTS pg_temp.users`);
  });

  describe("Users API", function () {
    it("POST /api/users/signup", async function () {
      const req = {
        email: "mind.lazauskas@gmail.com",
        password: "hellohello",
        fullname: "Mindaugas Lazauskas",
      };

      await request(app).post("/api/users/signup").send(req).expect(204);

      const user = await db.querySingle(
        "SELECT email, password, fullname FROM users WHERE email = $1",
        [req.email]
      );

      expect(user.email).to.eql(req.email);
      expect(user.fullname).to.eql(req.fullname);
      expect(user.password).lengthOf(60);
    });

    it("POST /api/users/signin", async function () {
      const req = {
        email: "mind.lazauskas@gmail.com",
        password: "hellohello",
        fullname: "Mindaugas Lazauskas",
      };

      await request(app).post("/api/users/signup").send(req).expect(204);

      const response = await request(app)
        .post("/api/users/signin")
        .send({ email: req.email, password: req.password })
        .expect(200);

      expect(response.body.accessToken).lengthOf(137);
    });
  });
});

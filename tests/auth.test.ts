import { expect } from "chai";
import request from "supertest";
import { mockDb } from "./common/dbMock";
import { db } from "../src/db/client";
import { app } from "../src/index";
import { Connection } from "mysql";

describe("Auth API", () => {
  let dbConnection: Connection;

  before("Mock db connection and load app", () => {
    const { connection } = mockDb();
    dbConnection = connection;
  });

  beforeEach("Create temporary tables", async () => {
    await Promise.all([
      db.mutate(`CREATE TEMPORARY TABLE users SELECT * FROM users LIMIT 0;`),
      db.mutate(`CREATE TEMPORARY TABLE posts SELECT * FROM posts LIMIT 0;`),
    ]);
  });

  afterEach("Drop temporary tables", async () => {
    await Promise.all([
      db.query(`DROP TEMPORARY TABLE IF EXISTS users;`),
      db.query(`DROP TEMPORARY TABLE IF EXISTS posts;`),
    ]);
  });

  after("Close db connection", () => {
    dbConnection.end();
  });

  it("POST /api/auth/signup", async () => {
    const req = {
      email: "mind.lazauskas@gmail.com",
      password: "hellohello",
      fullname: "Mindaugas Lazauskas",
    };

    expect(req.email).to.equal(req.email);

    await request(app).post("/api/auth/signup").send(req).expect(204);

    const user = await db.querySingle(
      "SELECT email, password, fullname FROM users WHERE email = ?",
      [req.email]
    );

    expect(user.email).to.eql(req.email);
    expect(user.fullname).to.eql(req.fullname);
    expect(user.password).lengthOf(60);
  });

  it("POST /api/auth/signin", async () => {
    const req = {
      email: "mind.lazauskas@gmail.com",
      password: "hellohello",
      fullname: "Mindaugas Lazauskas",
    };

    await request(app).post("/api/auth/signup").send(req).expect(204);

    const response = await request(app)
      .post("/api/auth/signin")
      .send({ email: req.email, password: req.password })
      .expect(200);

    expect(response.body.accessToken).lengthOf(137);
  });
});

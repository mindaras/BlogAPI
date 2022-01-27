import { Router, RequestHandler } from "express";
import {
  checkPassword,
  generateAccessToken,
  hashPassword,
  toErrorResponse,
} from "src/common";
import { db } from "src/db/client";
import { User } from "./models";

const signUp: RequestHandler = async (req, res) => {
  const { email, password, fullName }: User = req.body;

  try {
    if (password?.length < 8) {
      return res.status(400).send({ message: "Password is too short" });
    }

    const hashedPassword = await hashPassword(password);

    await db.query(
      `INSERT INTO users (email, password, fullName) VALUES ($1, $2, $3)`,
      [email, hashedPassword, fullName]
    );

    res.status(204).send();
  } catch (e) {
    res.status(400).json(toErrorResponse(e));
  }
};

const signIn: RequestHandler = async (req, res) => {
  const { email, password }: User = req.body;

  try {
    const user = await db.querySingle<
      Pick<User, "id" | "fullName" | "password">
    >(`SELECT id, password FROM users WHERE email = $1`, [email]);

    if (!user) return res.status(401).send({ message: "Invalid credentials" });

    const matches = await checkPassword(password, user?.password);

    if (matches) {
      const accessToken = generateAccessToken({ id: user?.id });
      res.status(200).json({ accessToken });
    } else {
      res.status(401).send({ message: "Invalid credentials" });
    }
  } catch (e) {
    res.status(400).send(toErrorResponse(e));
  }
};

const usersApi = Router().post("/signup", signUp).post("/signin", signIn);

export { usersApi };

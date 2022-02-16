import {
  checkPassword,
  createAndCacheRefreshToken,
  generateToken,
  hashPassword,
  verifyToken,
} from "@auth/auth";
import { toErrorResponse } from "@common/mappers";
import { db } from "@db/client";
import { getCacheClient } from "@db/cache";
import { Router, RequestHandler } from "express";
import { User } from "@common/models";

const signUp: RequestHandler = async (req, res) => {
  const { email, password, fullname }: User = req.body;

  try {
    if (password?.length < 8) {
      return res.status(400).send({ message: "Password is too short" });
    }

    const hashedPassword = await hashPassword(password);

    await db.query(
      `INSERT INTO users (email, password, fullname) VALUES (?, ?, ?)`,
      [email, hashedPassword, fullname]
    );

    res.sendStatus(204);
  } catch (e) {
    res.status(400).json(toErrorResponse(e));
  }
};

const signIn: RequestHandler = async (req, res) => {
  const { email, password, client } = req.body;

  try {
    const user = await db.querySingle<
      Pick<User, "id" | "fullname" | "password">
    >(`SELECT id, password FROM users WHERE email = ?`, [email]);

    if (!user) return res.status(401).send({ message: "Invalid credentials" });

    const matches = await checkPassword(password, user?.password);

    if (!matches) {
      return res
        .status(401)
        .send({ message: "Invalid credentials or user doesn't exist" });
    }

    const accessToken = generateToken({ id: user?.id });
    const refreshToken = await createAndCacheRefreshToken(user?.id);

    if (client) {
      return res
        .cookie("accessToken", accessToken, { httpOnly: true })
        .cookie("refreshToken", refreshToken, { httpOnly: true })
        .sendStatus(200);
    }

    res.json({ accessToken, refreshToken });
  } catch (e) {
    res.status(400).send(toErrorResponse(e));
  }
};

const refresh: RequestHandler = async (req, res) => {
  const { client } = req.body;
  const refreshToken = client
    ? req.cookies?.refreshToken
    : req.body.refreshToken;

  try {
    const { user } = await verifyToken(refreshToken);
    const cache = await getCacheClient();
    const storedToken = await cache.hGet(`users:${user?.id}`, "refreshToken");
    const isTokenValid = refreshToken === storedToken;

    if (!isTokenValid) {
      return res.status(401).send({ message: "Invalid token" });
    }

    const accessToken = generateToken({ id: user?.id });
    const newRefreshToken = await createAndCacheRefreshToken(user?.id);

    if (client) {
      return res
        .cookie("accessToken", accessToken, { httpOnly: true })
        .cookie("newRefreshToken", newRefreshToken, { httpOnly: true })
        .sendStatus(200);
    }

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (e) {
    res.status(400).send(toErrorResponse(e));
  }
};

const authApi = Router()
  .post("/signup", signUp)
  .post("/signin", signIn)
  .post("/refresh", refresh);

export { authApi };

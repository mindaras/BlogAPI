import bcrypt from "bcrypt";
import { config } from "src/config/config";
import jwt from "jsonwebtoken";
import { User } from "src/modules/users/models";
import { RequestHandler } from "express";

const hashPassword = async (password: string) =>
  bcrypt.hash(password, config.saltRounds);

const checkPassword = async (password: string, hash: string) =>
  bcrypt.compare(password, hash);

const generateAccessToken = (user: Pick<User, "id">) =>
  jwt.sign(user, config.tokenSecret, { expiresIn: "3600s" });

const auth: RequestHandler = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, config.tokenSecret, (err) => {
    if (err) {
      console.error(err);
      return res.sendStatus(403);
    }

    next();
  });
};

export { hashPassword, checkPassword, generateAccessToken, auth };

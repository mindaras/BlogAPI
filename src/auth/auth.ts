import bcrypt from "bcrypt";
import { config } from "src/config/config";
import jwt from "jsonwebtoken";
import { User } from "src/modules/users/models";
import { Request, RequestHandler } from "express";
import { AuthenticatedRequest, JwtPayload } from "./model";

const hashPassword = async (password: string) =>
  bcrypt.hash(password, config.auth.saltRounds);

const checkPassword = async (password: string, hash: string) =>
  bcrypt.compare(password, hash);

const generateAccessToken = (user: Pick<User, "id">) =>
  jwt.sign(user, config.auth.tokenSecret, { expiresIn: `${3600 * 12}s` });

const auth: RequestHandler = (req, res, next) => {
  const token =
    req.headers["authorization"]?.split(" ")[1] ||
    (req.cookies?.accessToken as string);

  if (!token) return res.sendStatus(401);

  jwt.verify(token, config.auth.tokenSecret, (err, user) => {
    if (err) {
      console.error(err);
      return res.sendStatus(403);
    }

    (req as AuthenticatedRequest).user = user as JwtPayload;

    next();
  });
};

const parseAuthPayload = (req: Request) => (req as AuthenticatedRequest)?.user;

export {
  hashPassword,
  checkPassword,
  generateAccessToken,
  auth,
  parseAuthPayload,
};

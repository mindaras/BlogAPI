import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, RequestHandler } from "express";
import { AuthenticatedRequest, JwtPayload, TokenType } from "./model";
import { config } from "@config/config";
import { getCacheClient } from "@db/cache";

const hashPassword = async (password: string) =>
  bcrypt.hash(password, config.auth.saltRounds);

const checkPassword = async (password: string, hash: string) =>
  bcrypt.compare(password, hash);

interface GenerateJwtArgs {
  id: string;
  type?: TokenType;
}

const generateToken = ({ id, type = TokenType.Access }: GenerateJwtArgs) => {
  const isAccessType = type === TokenType.Access;
  const expiresIn =
    type === TokenType.Access ? "3600s" /* 1 hour */ : `${3600 * 48}s`;
  const token = jwt.sign({ id }, config.auth.tokenSecret, { expiresIn });

  if (!isAccessType) {
    const payload = jwt.decode(token) as JwtPayload;
    return { token, payload };
  }

  return { token };
};

interface VerifyTokenPayload {
  user: JwtPayload;
  error: string;
}

const verifyToken = (token: string): Promise<VerifyTokenPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.auth.tokenSecret, (error, user) => {
      if (error) {
        console.error(error);
        reject({ error });
      } else {
        resolve({ user } as VerifyTokenPayload);
      }
    });
  });
};

const auth: RequestHandler = async (req, res, next) => {
  const token =
    req.headers["authorization"]?.split(" ")[1] ||
    (req.cookies?.accessToken as string);

  if (!token) return res.sendStatus(401);

  const { user, error } = await verifyToken(token);

  if (error) return res.sendStatus(403);

  (req as AuthenticatedRequest).user = user as JwtPayload;

  next();
};

const parseAuthPayload = (req: Request) => (req as AuthenticatedRequest)?.user;

const createAndCacheRefreshToken = async (id: string) => {
  const { token, payload } = generateToken({ id: id, type: TokenType.Refresh });
  const tokenExpiration = (payload as JwtPayload).exp * 1000;
  const cache = await getCacheClient();

  await Promise.all([
    cache.hSet(`users:${id}`, `refreshToken`, token),
    cache.hSet(
      `users:${id}`,
      `refreshTokenExpiration`,
      tokenExpiration // for old token cleanup
    ),
  ]);

  return token;
};

export {
  hashPassword,
  checkPassword,
  generateToken,
  verifyToken,
  auth,
  parseAuthPayload,
  createAndCacheRefreshToken,
};

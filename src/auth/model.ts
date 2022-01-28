import { Request } from "express";

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export { JwtPayload, AuthenticatedRequest };

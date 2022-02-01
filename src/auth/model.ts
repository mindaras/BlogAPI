import { Request } from "express";

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

enum TokenType {
  Access = "Access",
  Refresh = "Refresh",
}

export { JwtPayload, AuthenticatedRequest, TokenType };

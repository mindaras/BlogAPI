import { auth, parseAuthPayload } from "@auth/auth";
import { toErrorResponse } from "@common/mappers";
import { db } from "@db/client";
import { Router, RequestHandler } from "express";
import { User } from "@common/models";
import { AuthenticatedRequest } from "@auth/model";

const getUser: RequestHandler = async (req, res) => {
  const { id } = parseAuthPayload(req);

  try {
    const user = await db.querySingle<User>(
      `SELECT id, email, fullname FROM users WHERE id = $1`,
      [id]
    );

    res.json(user);
  } catch (e) {
    res.status(400).json(toErrorResponse(e));
  }
};

const usersApi = Router().get("/", auth, getUser);

export { usersApi };

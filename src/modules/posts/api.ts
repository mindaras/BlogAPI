import { auth, parseAuthPayload } from "@auth/auth";
import { toErrorResponse } from "@common/mappers";
import { db } from "@db/client";
import { Router, RequestHandler } from "express";
import { Post } from "./models";

const getAll: RequestHandler = async (_, res) => {
  try {
    const data = await db.query(
      `SELECT p.id, p.title, p.status, p.body, p.createdon, p.updatedon, u.fullname as author 
       FROM posts as p 
       INNER JOIN users AS u ON u.id = p.userid;`
    );
    res.json({ data });
  } catch (e) {
    res.status(500).json(toErrorResponse(e));
  }
};

const get: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "No id was provided" });

  try {
    const post = await db.querySingle(
      `SELECT p.id, p.title, p.status, p.body, p.createdon, p.updatedon, u.fullname as author 
       FROM posts AS p 
       INNER JOIN users AS u ON u.id = p.userid WHERE p.id = $1;`,
      [id]
    );

    if (post) res.json(post);
    else {
      res.status(404).json({ message: "No post was found with the given id" });
    }
  } catch (e) {
    res.status(500).json(toErrorResponse(e));
  }
};

const create: RequestHandler = async (req, res) => {
  const { title, body }: Post = req.body;
  const user = parseAuthPayload(req);

  try {
    const data = await db.querySingle(
      `INSERT INTO posts(title, body, userId) 
       VALUES($1, $2, $3) 
       RETURNING *, to_char(createdOn, 'YYYY-MM-DD') as createdOn;`,
      [title, body, user?.id]
    );

    res.json({ data });
  } catch (e) {
    res.status(400).json(toErrorResponse(e));
  }
};

const checkOwnership: RequestHandler = async (req, res, next) => {
  const post = await db.querySingle<Pick<Post, "userid">>(
    "SELECT userId FROM posts WHERE id = $1",
    [req.params.id]
  );

  const user = parseAuthPayload(req);
  const isOwner = post?.userid === user?.id;

  if (!isOwner) {
    return res
      .status(403)
      .json({ message: "The post doesn't belong to this user" });
  }

  next();
};

const update: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { title, body }: Post = req.body;

  try {
    const data = await db.querySingle<Post>(
      `UPDATE posts 
       SET title = $1, body = $2, updatedOn = now() 
       WHERE id = $3
       RETURNING *, to_char(createdOn, 'YYYY-MM-DD') as createdOn, to_char(createdOn, 'YYYY-MM-DD') as updatedOn;`,
      [title, body, id]
    );

    res.json({ data });
  } catch (e) {
    res.status(400).json(toErrorResponse(e));
  }
};

const updateStatus: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { status }: Post = req.body;

  try {
    const data = await db.querySingle<Post>(
      `UPDATE posts SET status = $1 WHERE id = $2
       RETURNING *, to_char(createdOn, 'YYYY-MM-DD') as createdOn, to_char(createdOn, 'YYYY-MM-DD') as updatedOn;`,
      [status, id]
    );

    res.json({ data });
  } catch (e) {
    res.status(400).json(toErrorResponse(e));
  }
};

const remove: RequestHandler = async (req, res) => {
  try {
    await db.query("DELETE FROM posts WHERE id = $1", [req.params.id]);
    res.sendStatus(204);
  } catch (e) {
    res.status(400).json(toErrorResponse(e));
  }
};

const postsApi = Router()
  .get("/", getAll)
  .get("/:id", get)
  .post("/", auth, create)
  .put("/:id", auth, checkOwnership, update)
  .put("/:id/status", auth, checkOwnership, updateStatus)
  .delete("/:id", auth, checkOwnership, remove);

export { postsApi };

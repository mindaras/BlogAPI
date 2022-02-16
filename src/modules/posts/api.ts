import { auth, parseAuthPayload } from "@auth/auth";
import { toErrorResponse } from "@common/mappers";
import { db } from "@db/client";
import { Router, RequestHandler } from "express";
import { Post } from "./models";

const getAll: RequestHandler = async (_, res) => {
  try {
    const data = await db.query(
      `SELECT p.id, p.title, p.status, p.body, DATE_FORMAT(p.createdon, '%Y-%m-%d') AS createdon, DATE_FORMAT(p.updatedon, '%Y-%m-%d') AS updatedon, u.fullname as author 
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
      `SELECT p.id, p.title, p.status, p.body, DATE_FORMAT(p.createdon, '%Y-%m-%d') AS createdon, DATE_FORMAT(p.updatedon, '%Y-%m-%d') AS updatedon, u.fullname as author 
       FROM posts AS p 
       INNER JOIN users AS u ON u.id = p.userid WHERE p.id = ?;`,
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
    const id = await db.mutate(
      `INSERT INTO posts(title, body, userid) VALUES(?, ?, ?);`,
      [title, body, user?.id]
    );

    const post = await db.querySingle(
      `SELECT *, DATE_FORMAT(createdon, '%Y-%m-%d') as createdon FROM posts WHERE id = ?;`,
      [id]
    );

    res.json(post);
  } catch (e) {
    res.status(400).json(toErrorResponse(e));
  }
};

const checkOwnership: RequestHandler = async (req, res, next) => {
  const post = await db.querySingle<Pick<Post, "userid">>(
    "SELECT userid FROM posts WHERE id = ?",
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
    await db.mutate(
      `UPDATE posts SET title = ?, body = ?, updatedon = now() WHERE id = ?;`,
      [title, body, id]
    );

    const post = await db.querySingle<Post>(
      `SELECT *, DATE_FORMAT(createdon, '%Y-%m-%d') as createdon, DATE_FORMAT(updatedon, '%Y-%m-%d') as updatedon FROM posts WHERE id = ?;`,
      [id]
    );

    res.json(post);
  } catch (e) {
    res.status(400).json(toErrorResponse(e));
  }
};

const updateStatus: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { status }: Post = req.body;

  try {
    await db.mutate<Post>(`UPDATE posts SET status = ? WHERE id = ?;`, [
      status,
      id,
    ]);

    const post = await db.querySingle<Post>(
      `SELECT *, DATE_FORMAT(createdon, '%Y-%m-%d') as createdon, DATE_FORMAT(updatedon, '%Y-%m-%d') as updatedon FROM posts WHERE id = ?;`,
      [id]
    );

    res.json(post);
  } catch (e) {
    res.status(400).json(toErrorResponse(e));
  }
};

const remove: RequestHandler = async (req, res) => {
  try {
    await db.query("DELETE FROM posts WHERE id = ?", [req.params.id]);
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

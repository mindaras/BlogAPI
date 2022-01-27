import { Router, RequestHandler } from "express";

const getPosts: RequestHandler = (_, res) => {
  res.json({});
};

const getPost: RequestHandler = (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ message: "No id was provided" });
  }

  const id = parseInt(req.params.id);
  const post = {};

  if (post) res.json(post);
  else
    res.status(404).json({ message: "No post was found with the provided id" });
};

const createPost: RequestHandler = async (req, res) => {};

const postsApi = Router()
  .get("/", getPosts)
  .get("/:id", getPost)
  .post("/", createPost);

export { postsApi };

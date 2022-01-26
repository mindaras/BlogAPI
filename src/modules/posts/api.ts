import { Router, RequestHandler } from "express";

const posts = [
  { id: 1, title: "Some title 1", body: "Some body" },
  { id: 2, title: "Some title 2", body: "Some body" },
  { id: 3, title: "Some title 3", body: "Some body" },
  { id: 4, title: "Some title 4", body: "Some body" },
];

const getPosts: RequestHandler = (_, res) => {
  res.json(posts);
};

const getPost: RequestHandler = (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).send({ message: "No id was provided" });
  }

  const post = posts.find((post) => post.id === parseInt(id));

  if (post) res.json(post);
  else res.status(404).json({ message: "No post was found with such id." });
};

const postsApi = Router().get("/", getPosts).get("/:id", getPost);

export { postsApi };

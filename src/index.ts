import cors from "cors";
import express from "express";
import { postsApi } from "./modules/posts/api";
import { usersApi } from "./modules/users/api";

const init = async () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use("/users", usersApi);
  app.use("/posts", postsApi);
  app.listen(process.env.PORT, () =>
    console.log(`Listening on port: ${process.env.PORT}`)
  );
};

init();

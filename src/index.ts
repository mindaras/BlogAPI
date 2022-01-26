import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import { postsApi } from "./modules/posts/api";

dotenv.config();

const init = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use("/posts", postsApi);
  app.listen(process.env.PORT, () =>
    console.log(`Listening on port: ${process.env.PORT}`)
  );
};

init();

import cors from "cors";
import express from "express";
import { postsApi } from "./modules/posts/api";
import { authApi } from "./modules/auth/api";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authApi);
app.use("/api/posts", postsApi);
app.listen(process.env.PORT, () =>
  console.log(`Listening on port: ${process.env.PORT}`)
);

export { app };

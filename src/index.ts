import cors from "cors";
import express from "express";
import { postsApi } from "./modules/posts/api";
import { authApi } from "./modules/auth/api";
import cookieParser from "cookie-parser";
import { usersApi } from "@modules/users/api";
import { auth } from "@auth/auth";
import { config } from "@config/config";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("./public"));
app.use("/api/auth", authApi);
app.use("/api/users", auth, usersApi);
app.use("/api/posts", postsApi);
app.listen(config.app.PORT, () =>
  console.log(`Listening on port: ${config.app.PORT}`)
);

export { app };

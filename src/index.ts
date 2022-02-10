import cors from "cors";
import express from "express";
import { postsApi } from "./modules/posts/api";
import { authApi } from "./modules/auth/api";
import cookieParser from "cookie-parser";
import { urlencoded } from "body-parser";
import { usersApi } from "@modules/users/api";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("./public"));
app.use("/api/auth", authApi);
app.use("/api/users", usersApi);
app.use("/api/posts", postsApi);
app.listen(process.env.PORT, () =>
  console.log(`Listening on port: ${process.env.PORT}`)
);

export { app };

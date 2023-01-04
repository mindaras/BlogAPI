import cors from "cors";
import express, { RequestHandler, Response, Send } from "express";
import { postsApi } from "./modules/posts/api";
import { authApi } from "./modules/auth/api";
import cookieParser from "cookie-parser";
import { usersApi } from "@modules/users/api";
import { auth } from "@auth/auth";
import { config } from "@config/config";
import promClient from "prom-client";

const app = express();

const register = new promClient.Registry();

register.setDefaultLabels({
  app: "blog-api",
});

const httpRequestTimer = new promClient.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500, 1000],
});

register.registerMetric(httpRequestTimer);

promClient.collectDefaultMetrics({ register });

const sendInterceptor = (res: Response, send: Send) => (body: any) => {
  (res as any).body = body === undefined || body === null ? {} : body;
  res.send = send;
  res.send(body);
  return res;
};

const trackRequestResponse: RequestHandler = (req, res, next) => {
  const start = Date.now();
  res.send = sendInterceptor(res, res.send);
  const path = req.path;
  res.on("finish", () => {
    if (path === '/metrics') return next()
    const responseTime = Date.now() - start;
    httpRequestTimer
      .labels(req.method, path, res.statusCode.toString())
      .observe(responseTime);
  });
  next();
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(trackRequestResponse);
app.use(express.static("./public"));
app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.send(await register.metrics());
});
app.get("/test1", (req, res) => {
  setTimeout(() => {
    res.send("hello");
  }, 300);
});
app.use("/api/auth", authApi);
app.use("/api/users", auth, usersApi);
app.use("/api/posts", postsApi);
app.listen(config.app.PORT, () =>
  console.log(`Listening on port: ${config.app.PORT}`)
);

export { app };

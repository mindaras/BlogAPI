import dotenv from "dotenv";

dotenv.config();

const env = process.env as { [key: string]: string };

const config = {
  db: {
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT),
    database: env.DB,
  },
  cache: {
    user: env.CACHE_USER,
    password: env.CACHE_PASSWORD,
    host: env.CACHE_HOST,
    port: parseInt(env.CACHE_PORT),
  },
  auth: {
    saltRounds: 10,
    tokenSecret: env.TOKEN_SECRET,
  },
};

export { config };

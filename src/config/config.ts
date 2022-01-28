import dotenv from "dotenv";

dotenv.config();

const env = process.env as { [key: string]: string };

const config = {
  dbUrl: env.DATABASE_URL,
  db: {
    user: env.DB_USER,
    host: env.DB_HOST,
    database: env.DB,
    password: env.DB_PASSWORD,
    port: parseInt(env.DB_PORT),
  },
  auth: {
    saltRounds: 10,
    tokenSecret: env.TOKEN_SECRET,
  },
};

export { config };

import dotenv from "dotenv";

dotenv.config();

const config = {
  dbUrl: process.env.DATABASE_URL as string,
  saltRounds: 10,
  tokenSecret: process.env.TOKEN_SECRET as string,
};

export { config };

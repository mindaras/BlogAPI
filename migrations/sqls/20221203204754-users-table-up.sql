CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(50) UNIQUE NOT NULL,
  password CHAR(60) NOT NULL,
  fullname VARCHAR(100) NOT NULL,
  about TEXT,
  createdon TIMESTAMP DEFAULT current_timestamp NOT NULL,
  avatar VARCHAR(200)
);
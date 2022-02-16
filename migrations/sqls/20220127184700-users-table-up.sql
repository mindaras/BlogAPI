CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(50) UNIQUE NOT NULL,
  password CHAR(60) NOT NULL,
  fullname VARCHAR(100) NOT NULL,
  about TEXT,
  createdon DATETIME DEFAULT now() NOT NULL
);
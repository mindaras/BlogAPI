CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userid INT, CONSTRAINT fk_posts_users FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(250) NOT NULL,
  status ENUM('PUBLISHED', 'DRAFT') NOT NULL,
  body TEXT NOT NULL,
  createdon DATETIME DEFAULT now() NOT NULL,
  updatedon DATETIME
);
CREATE TYPE postStatus as ENUM ('PUBLISHED', 'DRAFT');

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  userid INT REFERENCES users (id) ON DELETE CASCADE,
  title VARCHAR(250) NOT NULL,
  status postStatus DEFAULT 'DRAFT' NOT NULL,
  body TEXT NOT NULL,
  createdon TIMESTAMP DEFAULT current_timestamp NOT NULL,
  updatedon TIMESTAMP DEFAULT current_timestamp
);

CREATE FUNCTION update_updatedon_posts()
RETURNS TRIGGER AS $$
BEGIN 
  NEW.updatedon = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_posts_updatedon
BEFORE UPDATE ON posts
FOR EACH ROW EXECUTE PROCEDURE update_updatedon_posts();

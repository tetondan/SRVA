
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS polls CASCADE;
DROP TABLE IF EXISTS options CASCADE;
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
    
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user_name VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(140) NOT NULL,
  password VARCHAR(20) NOT NULL
);
    
CREATE TABLE polls (
  id SERIAL PRIMARY KEY,
  title VARCHAR(140) NOT NULL,
  url VARCHAR(25) NOT NULL UNIQUE,
  private INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL,
  created_by INTEGER NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) 
);
    
CREATE TABLE options (
  id SERIAL PRIMARY KEY,
  poll_id INTEGER NOT NULL,
  option VARCHAR(200) NOT NULL,
  FOREIGN KEY (poll_id) REFERENCES polls(id)
);
    
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  polls_id INTEGER NOT NULL,
  comment VARCHAR(255) NOT NULL,
  FOREIGN KEY (polls_id) REFERENCES polls(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE votes (
  id SERIAL PRIMARY KEY,
  option_id INTEGER,
  user_id INTEGER NOT NULL,
  polls_id INTEGER,
  comments_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (polls_id) REFERENCES polls(id),
  FOREIGN KEY (option_id) REFERENCES options(id),
  FOREIGN KEY (comments_id) REFERENCES comments(id)
);

INSERT INTO users (id, user_name, email, password) VALUES (0, 'anonymous', 'dfrehner1@gmail.com', 'a');
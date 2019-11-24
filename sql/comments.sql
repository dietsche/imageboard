DROP TABLE IF EXISTS comments;

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    image_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT date_trunc('second', now())
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE
);

INSERT INTO users (name, email) VALUES
  ('Patricio Ibarra','patricio@example.com'),
  ('Natalia Rud','natalia@example.com')
ON CONFLICT (email) DO NOTHING;

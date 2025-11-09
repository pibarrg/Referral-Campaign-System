import express from "express";
import pkg from "pg";
const { Pool } = pkg;

const app = express();

// conexión a PostgreSQL (usa las variables del .env)
const pool = new Pool({
  host: process.env.DB_HOST || "db",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER || "app",
  password: process.env.DB_PASSWORD || "app",
  database: process.env.DB_NAME || "referrals",
});

// ruta de healthcheck
app.get("/health", (_req, res) => res.json({ ok: true }));

// ruta de test básico
app.get("/test", (_req, res) => {
  res.json({ message: "API funcionando" });
});

// ✅ nueva ruta: devuelve usuarios desde Postgres
app.get("/users", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, email FROM users ORDER BY id"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db_error" });
  }
});

app.listen(5000, () => console.log("API listening on :5000"));

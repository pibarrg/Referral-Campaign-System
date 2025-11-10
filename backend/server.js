import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;

const app = express();

// CORS (por ahora abierto; luego podemos restringir a tu dominio estático)
app.use(cors({ origin: "*" }));

// --- RUTAS PRIMERO ---

// Healthcheck
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Ping de prueba
app.get("/api/test", (_req, res) => {
  res.json({ message: "API funcionando" });
});

// Config DB:
// - En Render usaremos DATABASE_URL (y opcional PGSSL=require).
// - En local (Docker) seguimos con variables separadas.
const hasDatabaseUrl = !!process.env.DATABASE_URL;

const pool = hasDatabaseUrl
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.PGSSL === "require"
          ? { rejectUnauthorized: false }
          : undefined,
    })
  : new Pool({
      user: process.env.DB_USER || "app",
      password: process.env.DB_PASSWORD || "app",
      host: process.env.DB_HOST || "db",
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME || "referrals",
    });

// Lista de usuarios
app.get("/api/users", async (_req, res) => {
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

// Página raíz (informativa)
app.get("/", (_req, res) => {
  res
    .type("text/plain")
    .send("API OK. Endpoints: /api/health, /api/test, /api/users");
});

// 404 al final
app.use((_req, res) => {
  res.status(404).json({ error: "not_found" });
});

// Render necesita 0.0.0.0 para aceptar conexiones externas
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`API listening on :${PORT}`));

import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;

const app = express();

app.use(express.json()); // ← para parsear JSON en POST

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

// Código de referido de un usuario (GET /api/referral-code/:userId)
app.get("/api/referral-code/:userId", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT code FROM referral_codes WHERE user_id = $1",
      [Number(req.params.userId)]
    );
    if (rows.length === 0) return res.status(404).json({ error: "not_found" });
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "db_error" });
  }
});

// Crear un referido (POST /api/referrals)
app.post("/api/referrals", async (req, res) => {
  const { referrer_id, referred_name, referred_email } = req.body || {};
  if (!referrer_id || !referred_email)
    return res.status(400).json({ error: "missing_params" });

  try {
    // obtenemos el code del referrer
    const { rows: rc } = await pool.query(
      "SELECT code FROM referral_codes WHERE user_id = $1",
      [Number(referrer_id)]
    );
    if (rc.length === 0) return res.status(400).json({ error: "no_code" });
    const codeUsed = rc[0].code;

    const { rows } = await pool.query(
      `INSERT INTO referrals (referrer_id, referred_name, referred_email, code_used)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (referred_email) DO UPDATE SET referred_name = EXCLUDED.referred_name
       RETURNING id, referrer_id, referred_name, referred_email, code_used, status, created_at`,
      [Number(referrer_id), referred_name || null, referred_email, codeUsed]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "db_error" });
  }
});

// Listar referrals (GET /api/referrals?referrer_id=1 opcional)
app.get("/api/referrals", async (req, res) => {
  try {
    const referrer = req.query.referrer_id ? Number(req.query.referrer_id) : null;
    const q = referrer
      ? `SELECT r.*, u.name AS referrer_name
         FROM referrals r JOIN users u ON u.id = r.referrer_id
         WHERE r.referrer_id = $1
         ORDER BY r.id DESC`
      : `SELECT r.*, u.name AS referrer_name
         FROM referrals r JOIN users u ON u.id = r.referrer_id
         ORDER BY r.id DESC`;
    const params = referrer ? [referrer] : [];
    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "db_error" });
  }
});

// 404 al final
app.use((_req, res) => {
  res.status(404).json({ error: "not_found" });
});

// Render necesita 0.0.0.0 para aceptar conexiones externas
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`API listening on :${PORT}`));

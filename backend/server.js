// backend/server.js
import express from "express";

const app = express();

// Health checks (funcionan tanto directo como vía /api/)
app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Endpoint de prueba
app.get("/api/test", (_req, res) => {
  res.json({ message: "API funcionando" });
});

app.listen(5000, () => {
  console.log("API listening on :5000");
});

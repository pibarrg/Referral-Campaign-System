# Referral-Campaign-System

Minimum local development stack with **Docker Compose**:

- **API (Node/Express)** in `backend` (port 5000)
- **Nginx (static frontend + reverse proxy)** in `frontend` (port 3000)
- **PostgreSQL 16** (port 5432) with initial seed in `db/init.sql`
- **Redis 7** (port 6379)

---

## Requirements

- Docker Desktop installed and running
- Make (included by default in macOS/Linux; on Windows available via Git Bash or WSL)

---

## Quick Start

1. (First time) create the `.env` file from the example:
   cp .env.example .env

2. Build and start everything:
   make up

3. Check status:
   make ps

---

## URLs

- Frontend: http://localhost:3000
- Direct API (for debugging): http://localhost:5000

---

## Test Endpoints

Via Nginx (recommended):
GET http://localhost:3000/api/health → {"ok":true}
GET http://localhost:3000/api/test → {"message":"API running"}
GET http://localhost:3000/api/users → [{"id":1,"name":"Patricio Ibarra"}, {"id":2,"name":"Natalia Rud"}]

Direct API (debugging):
GET http://localhost:5000/api/health → {"ok":true}
GET http://localhost:5000/api/test → {"message":"API running"}
GET http://localhost:5000/api/users → [{"id":1,"name":"Patricio Ibarra"}, {"id":2,"name":"Natalia Rud"}]

---

## Environment Variables

# Inside Docker’s network, the API is reachable as 'api'
API_URL=http://api:5000

# Postgres (used by the API)
DB_USER=app
DB_PASSWORD=app
DB_NAME=referrals
DB_HOST=db
DB_PORT=5432

# Redis (if used in the future)
REDIS_HOST=redis

---

## Useful Commands

With the Makefile you can use shortcuts:

| Comando           | Descripción                         |
| ----------------- | ----------------------------------- |
| `make up`         | Levanta todo                        |
| `make build`      | Fuerza reconstrucción de imágenes   |
| `make ps`         | Muestra estado / puertos            |
| `make logs`       | Logs de todos los servicios         |
| `make logs-api`   | Logs de la API                      |
| `make logs-web`   | Logs de Nginx                       |
| `make down`       | Detiene los contenedores            |
| `make nuke`       | Elimina volúmenes y resetea DB      |
| `make db-sh`      | Abre consola psql en Postgres       |
| `make health`     | Testea /api/health vía Nginx        |
| `make api-health` | Testea /api/health directo a la API |

---

## Reseed the Database

If you change db/init.sql and want to apply the updated seed:

make nuke     # deletes volumes and data
make up       # starts everything (DB is reseeded with init.sql)

---

## Project Structure

Referral-Campaign-System/
├─ backend/
│  ├─ server.js
│  ├─ package.json
│  └─ Dockerfile
│
├─ db/
│  └─ init.sql
│
├─ frontend/
│  ├─ index.html
│  ├─ nginx.conf
│  └─ Dockerfile
│
├─ .env
├─ .env.example
├─ docker-compose.yml
├─ Makefile
└─ README.md

---

## Notes

- All API endpoints should live under /api/*.
Nginx is configured to proxy those paths (best practice and avoids collisions with static files).
- The API also responds directly on port 5000 for debugging.
- Postgres includes an initial seed (db/init.sql) with two example users.

---

## Quick Verification Checklist

- docker compose ps → api and db should be healthy
- GET http://localhost:3000/api/health → {"ok":true}
- GET http://localhost:3000/api/users → two seed users

---

## Suggested Next Steps

+ [ ] Add pgAdmin (a more complete alternative to Adminer).
+ [ ] Implement basic authentication in the API.
+ [ ] Add a minimal CI/CD pipeline (GitHub Actions).

---

© 2025 — Base project for referral system development.

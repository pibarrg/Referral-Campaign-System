# Referral-Campaign-System

Stack mínimo para desarrollo local con **Docker Compose**:

- **API (Node/Express)** en `backend` (puerto 5000)
- **Nginx (frontend estático + reverse proxy)** en `frontend` (puerto 3000)
- **PostgreSQL 16** (puerto 5432) con seed inicial en `db/init.sql`
- **Redis 7** (puerto 6379)

---

## Requisitos

- Docker Desktop instalado y funcionando

---

## Arranque rápido

```bash
# 1) (Primera vez) crear .env a partir del ejemplo
cp .env.example .env

# 2) Construir/levantar
docker compose up -d --build

# 3) Ver estado
docker compose ps

---

URLs:

Frontend: http://localhost:3000

API directa (para depurar): http://localhost:5000

---

ENDPOINTS DE PRUEBA:

Vía Nginx (recomendado)

GET http://localhost:3000/api/health → {"ok":true}
GET http://localhost:3000/api/test → {"message":"API funcionando"}
GET http://localhost:3000/api/users → lista con 2 usuarios seed

API directa (útil para depurar)

GET http://localhost:5000/api/health → {"ok":true}
GET http://localhost:5000/api/test → {"message":"API funcionando"}
GET http://localhost:5000/api/users → lista con 2 usuarios seed

---

VARIABLES DE ENTORNO:

# Dentro de la red de Docker, la API se llama 'api' (host interno)
API_URL=http://api:5000

# Postgres usado por la API
DB_USER=app
DB_PASSWORD=app
DB_NAME=referrals
DB_HOST=db
DB_PORT=5432

# Redis (si más adelante lo usas activamente desde la API)
REDIS_HOST=redis

---

.env (local, no subir credenciales reales)

- Puedes dejarlo igual al ejemplo para usar host internos de Docker (api, db, redis).
- Si prefieres probar fuera de Docker para algo puntual, puedes poner API_URL=http://localhost:5000.

---

COMANDOS ÚTILES:

# Listar servicios/puertos/health
docker compose ps

# Logs generales o por servicio (últimos 2 minutos)
docker compose logs -f
docker compose logs -f api --since=2m
docker compose logs -f web --since=2m
docker compose logs -f db --since=2m

# Detener todo
docker compose down

Consultar DB (psql dentro del contenedor):
docker compose exec db psql -U app -d referrals -c "select * from users;"

---

RESEMBRAR LA BASE (si cambias db/init.sql)

docker-compose sólo aplica init.sql cuando el volumen de datos está vacío.
Si editaste el seed y quieres reaplicarlo:

docker compose down -v     # elimina contenedores y volúmenes (incluye datos de Postgres)
docker compose up -d db    # levanta DB y aplica init.sql
docker compose up -d api web

---

ESTRUCTURA DEL PROYECTO:

Referral-Campaign-System/
├─ backend/                # API Express
│  ├─ server.js
│  ├─ package.json
│  └─ Dockerfile
│
├─ db/
│  └─ init.sql             # seed inicial (tabla users + 2 filas)
│
├─ frontend/               # Nginx + HTML estático
│  ├─ index.html
│  ├─ nginx.conf           # proxy /api → http://api:5000
│  └─ Dockerfile
│
├─ .env                    # TU config local (no commitear credenciales)
├─ .env.example            # ejemplo de variables para Docker
├─ docker-compose.yml
└─ README.md

---

NOTAS:

- Todo endpoint de la API debe vivir bajo /api/*.
El reverse proxy de Nginx está configurado para eso (mejor práctica y evita colisiones con rutas estáticas).

- La API también responde directo en :5000 (útil para debugging), pero la ruta sigue siendo /api/*.

- Postgres viene con un seed mínimo de ejemplo en db/init.sql.

---

Checklist de verificación rápida

 docker compose ps muestra healthy para api y db.

 GET http://localhost:3000/api/health → {"ok":true}

 GET http://localhost:3000/api/users → 2 usuarios seed

---

PRÓXIMOS PASOS SUGERIDOS:

+ [ ] Añadir pgAdmin o Adminer para administrar PostgreSQL fácilmente.

---

ÚLTIMA VERIFICACIÓN TÉCNICA:

Todos los servicios saludables (`docker compose ps`)
- Frontend → http://localhost:3000/
- API → http://localhost:5000/api/*
- DB → PostgreSQL 16 con seed inicial (tabla users)
- Redis → operativo

---

© 2025 — Proyecto de base para desarrollo de sistemas de referidos.

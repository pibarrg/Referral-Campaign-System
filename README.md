# Referral-Campaign-System

Stack mínimo para desarrollo local con **Docker Compose**:

- **API (Node/Express)** en `backend` (puerto 5000)
- **Nginx (frontend estático + reverse proxy)** en `frontend` (puerto 3000)
- **PostgreSQL 16** (puerto 5432) con seed inicial en `db/init.sql`
- **Redis 7** (puerto 6379)

---

## Requisitos

- Docker Desktop instalado y funcionando
- Make (viene incluido en macOS/Linux, en Windows está en Git Bash o WSL)

---

## Arranque rápido

1) (Primera vez) crear .env a partir del ejemplo
cp .env.example .env

2) Construir y levantar
make up

3) Ver estado
make ps

---

URLs:

- Frontend: http://localhost:3000
- API directa (para depurar): http://localhost:5000

---

ENDPOINTS DE PRUEBA:

Vía Nginx (recomendado)

GET http://localhost:3000/api/health → {"ok":true}
GET http://localhost:3000/api/test → {"message":"API funcionando"}
GET http://localhost:3000/api/users → [{"id":1,"name":"Patricio Ibarra","email":"patricio@example.com"}, {"id":2,"name":"Natalia Rud","email":"natalia@example.com"}]

API directa (útil para depurar)

GET http://localhost:5000/api/health → {"ok":true}
GET http://localhost:5000/api/test → {"message":"API funcionando"}
GET http://localhost:5000/api/users → [{"id":1,"name":"Patricio Ibarra","email":"patricio@example.com"}, {"id":2,"name":"Natalia Rud","email":"natalia@example.com"}]

---

VARIABLES DE ENTORNO:

# Dentro de la red de Docker, la API se llama 'api'
API_URL=http://api:5000

# Postgres (usado por la API)
DB_USER=app
DB_PASSWORD=app
DB_NAME=referrals
DB_HOST=db
DB_PORT=5432

# Redis (si se usa en el futuro)
REDIS_HOST=redis

⚠️ Copia este archivo a .env antes de levantar el proyecto.

---

COMANDOS ÚTILES:

Con Makefile ahora puedes usar atajos:

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

RESEMBRAR LA BASE

Si cambias db/init.sql y quieres aplicar los nuevos datos:

make nuke     # borra volúmenes y datos
make up       # levanta todo (DB se re-semilla con init.sql)

---

ESTRUCTURA DEL PROYECTO:

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

NOTAS:

- Todos los endpoints de la API deben vivir bajo /api/*.
El proxy de Nginx está configurado para eso (mejor práctica y evita conflictos con archivos estáticos).
- La API también responde directo en :5000 para debugging.
- Postgres incluye un seed inicial (db/init.sql) con dos usuarios de ejemplo.

---

Checklist de verificación rápida

- docker compose ps → healthy en api y db
- GET http://localhost:3000/api/health → {"ok":true}
- GET http://localhost:3000/api/users → dos usuarios semilla

---

PRÓXIMOS PASOS SUGERIDOS:

+ [ ] Añadir pgAdmin (alternativa más completa a Adminer).
+ [ ] Implementar autenticación básica en la API.
+ [ ] Integrar pipeline mínima de CI/CD (GitHub Actions).

---

© 2025 — Proyecto de base para desarrollo de sistemas de referidos.

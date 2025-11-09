# Referral-Campaign-System

Stack mínimo para pruebas locales con **Docker Compose**:
- **API (Node/Express)** en `backend` (puerto 5000)
- **Nginx (frontend estático + reverse proxy)** en `frontend` (puerto 3000)
- **PostgreSQL 16** (puerto 5432)
- **Redis 7** (puerto 6379)

## Requisitos
- Docker Desktop instalado y funcionando

## Arranque
Para levantar todo el sistema, ejecuta en PowerShell:

```bash
docker compose up --build

Frontend: http://localhost:3000
API directa (modo desarrollo): http://localhost:5000

Endpoints de prueba
API directa (puerto 5000)

GET http://localhost:5000/health → {"ok":true}
GET http://localhost:5000/api/test → {"message":"API funcionando"}

A través del frontend (puerto 3000)

GET http://localhost:3000/api/health → {"ok":true}
GET http://localhost:3000/api/test → {"message":"API funcionando"}

Variables de entorno

Archivo .env (ya incluido localmente, no subir credenciales reales):

API_URL=http://localhost:5000
DB_USER=app
DB_PASSWORD=app
DB_NAME=referrals
REDIS_HOST=redis

Comandos útiles

# Ver los contenedores activos
docker compose ps

# Ver logs (todos o uno específico)
docker compose logs -f
docker compose logs -f api
docker compose logs -f web
docker compose logs -f db

# Detener todo
docker compose down

Estructura del proyecto

Referral-Campaign-System/
├── backend/        # API Express
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
│
├── frontend/       # Nginx + HTML estático
│   ├── index.html
│   ├── nginx.conf
│   └── Dockerfile
│
├── docker-compose.yml
├── .env
└── README.md

Notas

Este proyecto es un scaffold básico para desarrollo local.
Puedes extenderlo con endpoints reales, persistencia, autenticación, tests y CI/CD.
Ideal para probar integraciones entre servicios (API + base de datos + cache + proxy).

Próximos pasos sugeridos

1. Agregar un .gitignore para excluir archivos innecesarios.
2. Añadir healthchecks a docker-compose.yml.
3. Crear una versión “production” (con puerto 80).
4. Escribir un pequeño endpoint con persistencia PostgreSQL.

© 2025 — Proyecto de base para desarrollo de sistemas de referidos.

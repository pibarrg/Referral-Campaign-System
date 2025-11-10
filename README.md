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

---

ENDPOINTS DE PRUEBA:

API directa (puerto 5000)
+ GET http://localhost:5000/api/health → {"ok":true}
+ GET http://localhost:5000/api/test → {"message":"API funcionando"}
+ GET http://localhost:5000/api/users → [{"id":1,"name":"Patricio Ibarra","email":"patricio@example.com"}, {"id":2,"name":"Natalia Rud","email":"natalia@example.com"}]

A través del frontend (puerto 3000)
+ GET http://localhost:3000/api/health → {"ok":true}
+ GET http://localhost:3000/api/test → {"message":"API funcionando"}
+ GET http://localhost:3000/api/users → [{"id":1,"name":"Patricio Ibarra","email":"patricio@example.com"}, {"id":2,"name":"Natalia Rud","email":"natalia@example.com"}]

---

VARIABLES DE ENTORNO:

Archivo .env (ya incluido localmente, no subir credenciales reales):
API_URL=http://localhost:5000
DB_USER=app
DB_PASSWORD=app
DB_NAME=referrals
REDIS_HOST=redis

---

COMANDOS ÚTILES:

# Ver los contenedores activos
docker compose ps

# Ver logs (todos o uno específico)
docker compose logs -f
docker compose logs -f api
docker compose logs -f web
docker compose logs -f db

# Detener todo
docker compose down

---

ESTRUCTURA DEL PROYECTO:

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

---

NOTAS:

- Este proyecto es un scaffold básico para desarrollo local.
- Puedes extenderlo con endpoints reales, persistencia, autenticación, tests y CI/CD.
- Ideal para probar integraciones entre servicios (API + base de datos + cache + proxy).

---

PRÓXIMOS PASOS SUGERIDOS:

+ [ ] Crear un archivo .env.example con variables de entorno de referencia.
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

# -------- Makefile (usar con: make <target>) --------
SHELL := /bin/sh

# Atajos
up:        ## Levanta todo (build si hace falta)
	docker compose up -d

build:     ## Fuerza build de imágenes y levanta
	docker compose up -d --build

down:      ## Baja todo (mantiene volúmenes)
	docker compose down

nuke:      ## Baja todo y borra volúmenes (¡reset DB!)
	docker compose down -v

ps:        ## Estado de contenedores
	docker compose ps

logs:      ## Logs de todos (seguir 2 min)
	docker compose logs -f --since=2m

logs-api:  ## Logs API (seguir 2 min)
	docker compose logs -f api --since=2m

logs-web:  ## Logs Web (seguir 2 min)
	docker compose logs -f web --since=2m

restart:   ## Reinicia API y Web
	docker compose restart api web

api-sh:    ## Shell en contenedor API
	docker compose exec api sh

web-sh:    ## Shell en contenedor Web (nginx)
	docker compose exec web sh

db-sh:     ## psql contra Postgres
	docker compose exec db psql -U app -d referrals

db-seed:   ## Resetea volúmenes DB y re-semilla con init.sql
	docker compose down -v
	docker compose up -d db
	docker compose up -d api web

health:    ## Verifica /api/health vía Nginx (puerto 3000)
	@curl -sS http://localhost:3000/api/health || true

api-health: ## Verifica /api/health directo a la API (puerto 5000)
	@curl -sS http://localhost:5000/api/health || true

.PHONY: up build down nuke ps logs logs-api logs-web restart api-sh web-sh db-sh db-seed health api-health

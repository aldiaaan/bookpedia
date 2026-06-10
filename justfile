compose_file := "infra/docker-compose.local.yml"

services:
    docker compose -f {{compose_file}} up -d

services-down:
    docker compose -f {{compose_file}} down

clean: services-down
    rm -rf infra/.tmp

db-push:
    pnpm exec drizzle-kit push

db-generate:
    pnpm exec drizzle-kit generate

db-migrate:
    pnpm exec drizzle-kit migrate

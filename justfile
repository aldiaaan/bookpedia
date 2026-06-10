compose_file := "infra/docker-compose.local.yml"
image_name := "bookpedia"

install:
    pnpm install

dev:
    pnpm dev

build:
    pnpm build

start:
    pnpm start

services:
    docker compose -f {{compose_file}} up -d

services-down:
    docker compose -f {{compose_file}} down

clean: services-down
    rm -rf infra/.tmp

docker-build:
    docker build -t {{image_name}} .

docker-run:
    docker run --rm -p 3000:3000 \
        --env-file .env \
        -e "$(grep '^DATABASE_URL=' .env | sed 's/localhost/host.docker.internal/')" \
        {{image_name}}

db-push:
    pnpm exec drizzle-kit push

db-generate:
    pnpm exec drizzle-kit generate

db-migrate:
    pnpm exec drizzle-kit migrate

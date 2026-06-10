compose_file := "infra/docker-compose.local.yml"

services:
    docker compose -f {{compose_file}} up -d

down:
    docker compose -f {{compose_file}} down

clean: down
    rm -rf infra/.tmp

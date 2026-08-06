set dotenv-load := true

app_dir := "app"
podman := "/opt/podman/bin/podman"
podman_path := "/opt/podman/bin:/Applications/Docker.app/Contents/Resources/bin:/Applications/Docker.app/Contents/Resources/cli-plugins:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"

default:
    @just --list

install:
    npm --prefix {{app_dir}} ci

dev:
    npm --prefix {{app_dir}} run dev

lint:
    npm --prefix {{app_dir}} run lint

build:
    npm --prefix {{app_dir}} run build

db-migrate:
    cd {{app_dir}} && DATABASE_URL=file:./dev.db npm exec prisma migrate deploy

db-seed:
    npm --prefix {{app_dir}} run db:seed

compose-up-build: compose-down db-migrate
    PATH="{{podman_path}}:$PATH" {{podman}} compose up -d --build

compose-up: compose-down
    PATH="{{podman_path}}:$PATH" {{podman}} compose up -d

restart-app:
    PATH="{{podman_path}}:$PATH" {{podman}} compose up -d --build --force-recreate kitchen-app

compose-down:
    PATH="{{podman_path}}:$PATH" {{podman}} compose down

compose-logs:
    PATH="{{podman_path}}:$PATH" {{podman}} compose logs -f --tail 100

kill-port port:
    #!/bin/sh
    set -eu
    pids=$(lsof -tiTCP:{{port}} -sTCP:LISTEN || true)
    if [ -z "$pids" ]; then
      echo "No process is listening on port {{port}}."
      exit 0
    fi
    echo "$pids" | xargs kill
    echo "Stopped processes on port {{port}}."

deploy:
    git push origin main
    gh workflow run .github/workflows/deploy.yml --repo tclaudel/kitchen-app --ref main

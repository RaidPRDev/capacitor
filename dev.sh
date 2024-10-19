#!/usr/bin/env bash
set -e

cleanup() {
    docker image rm elso-app
    trap '' EXIT INT TERM
    exit $err
}

trap cleanup SIGINT EXIT

# Make sure docker-compose is installed
if ! hash docker-compose 2>/dev/null; then
  echo -e '\033[0;31mPlease install docker-compose\033[0m'
  exit 1
fi

docker build -t elso-app .

# docker run -it -p 8080:8080 --rm --name elso-app-production elso-app
docker run -it -p 8080:80 --rm --name elso-app-production elso-app

# docker logs -f elso-app-production > docker-compose.log

read -p "Press to exit"
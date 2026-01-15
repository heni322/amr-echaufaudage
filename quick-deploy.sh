#!/bin/bash
# Quick deployment script
set -e
cd ~/amr-echaufaudage
sudo systemctl stop nginx 2>/dev/null || true
docker stop frontend nginx amr-nginx 2>/dev/null || true
docker rm frontend nginx amr-nginx 2>/dev/null || true
sudo systemctl restart docker
sleep 5
docker-compose down
git pull
docker network create amr-network 2>/dev/null || true
docker-compose up -d --build
sleep 10
docker-compose ps
curl http://localhost || echo "Site not responding yet"

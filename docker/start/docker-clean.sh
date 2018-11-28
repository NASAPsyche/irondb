#!/bin/bash
#Use this script to launch a built docker

# Clear old networks 
docker-compose down

# Remove folders that would prevent building
sudo rm -rf pg-data 
sudo rm -rf node-modules
mkdir pg-data

# Fresh build
docker-compose build
docker-compose up -d

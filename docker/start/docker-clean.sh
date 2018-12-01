#!/bin/bash
#Use this script to launch a built docker

# Clear old networks 
docker-compose down

# Remove folders that would prevent building
rm -rf pg-data 
rm -rf node-modules
mkdir pg-data

# Fresh build
docker-compose build
docker-compose up -d

#!/bin/bash
#Use this script to launch a built docker

# Remove folders that would prevent building
sudo rm -rf pg-data 
sudo rm -rf rabbitmq/data
mkdir pg-data

# Clear old networks then do a clean docker build
docker-compose down
docker-compose build
docker-compose up -d

#!/bin/bash
#Use this script to launch a built docker

# Clear old networks then do a clean docker build
docker-compose down
docker-compose up -d 

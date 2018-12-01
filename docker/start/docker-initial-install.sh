#!/bin/bash
# Use this script for initial install

apt update
apt install nodejs npm -y

# Global dependencies for testing node
npm install -g gulp-cli
npm install -g jest-cli

# Local dependencies for node
npm install
gulp sass
gulp js 

# Remove folders that would prevent building
rm -rf pg-data 
rm -rf node-modules
mkdir pg-data

# About to start
echo "Starting the containers"
sleep 1

# Clear old networks then do a clean docker build
docker-compose down
docker-compose build
docker-compose up -d


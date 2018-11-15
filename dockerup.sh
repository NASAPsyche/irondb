#!/bin/bash

sudo npm install -g gulp-cli
sudo npm install -g jest-cli
npm install
gulp sass
gulp js 
sudo rm -rf pg-data 
mkdir pg-data
docker-compose down
docker-compose up --build

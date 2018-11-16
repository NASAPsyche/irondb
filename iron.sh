#!/bin/bash

echo "1 - Perform initial containers and dependencies install"
echo "2 - Rebuild containers"
echo "3 - Launch pre-built containers"
echo "4 - Stop the containers"
echo "9 - Stop and Remove ALL containers"
echo "x - Exit the program"

# read choice 
echo -n "Enter selection : " ; read choice

if [ $choice == "1" ]
then
    echo "Installing"
    ./docker/start/docker-initial-install.sh
elif [ $choice == "2" ]
then
    echo "Building"
    ./docker/start/docker-clean.sh
elif [ $choice == "3" ]
then 
    echo "Starting"
    ./docker/start/docker-start.sh
elif [ $choice == "4" ]
then 
    echo "Turning off containers"
    docker-compose down
elif [ $choice == "9" ]
then
    ./docker/start/remove-all.sh
elif [ $choice == 'x' ]
then
    echo "Goodbye"
else
    echo "Invalid selection"
fi

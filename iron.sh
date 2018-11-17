#!/bin/bash

echo "1 - Install dependencies, build the containers, and launch"
echo "2 - Rebuild containers and launch"
echo "3 - Launch pre-built containers"
echo "4 - Stop the containers"
echo "9 - Stop and Remove ALL containers"
echo "d - Database management (backup/restore)"
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
elif [ $choice == 'd' ]
then
    echo "Postgress must be running for these operations"
    echo "b - Make a backup"
    echo "r - Restore from most recent backup"
    echo -n "Enter selection : " ; read choice 
    if [ $choice == 'b' ]
    then
        docker exec -t postgres pg_dump -c -U group16 -d postgres > backup-pg/pg_`date +%d-%m-%Y"_"%H_%M_%S`.sql
    elif [ $choice == 'r' ]
    then
        cd backup-pg
        STR="$(ls -tr | tail -1)"
        echo "Restoring from $STR"
        sleep 1
        cat $STR | docker exec -i postgres psql -U group16 -d postgres
        cd ..
    fi
else
    echo "Invalid selection"
fi

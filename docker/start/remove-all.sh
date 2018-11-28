#!/bin/bash
# This will remove all containers from docker!

read -n1 -p "This will delete ALL containers on the system, are you sure you want to continue? [y,n]" doit 
case $doit in  
  y|Y) 
    echo "Stopping all running containers"
    docker stop $(docker ps -aq)
    echo "Deleting all containers"
    docker rm $(docker ps -aq)
    echo "Removing dangling containers"
    docker images -aq -f 'dangling=true' | xargs docker rmi
    ;; 
  n|N) echo no ;; 
  *) echo "Exiting" ;; 
esac


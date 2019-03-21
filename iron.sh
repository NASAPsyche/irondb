#!/bin/bash
# Kenneth Bonilla 2019
# Iron Shell - Iron Meteorite Database Manager
# For deploying and managing the docker composition.

# Displays the help contents
function show_help ()
{
  echo "                                        "
  echo "    ██╗██████╗  ██████╗ ███╗   ██╗      "
  echo "    ██║██╔══██╗██╔═══██╗████╗  ██║      "
  echo "    ██║██████╔╝██║   ██║██╔██╗ ██║      "
  echo "    ██║██╔══██╗██║   ██║██║╚██╗██║      "
  echo "    ██║██║  ██║╚██████╔╝██║ ╚████║      "
  echo "    ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝      "
  echo "███████╗██╗  ██╗███████╗██╗     ██╗     "
  echo "██╔════╝██║  ██║██╔════╝██║     ██║     "
  echo "███████╗███████║█████╗  ██║     ██║     "
  echo "╚════██║██╔══██║██╔══╝  ██║     ██║     "
  echo "███████║██║  ██║███████╗███████╗███████╗"
  echo "╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝"
  echo "                                        "
  echo "Welcome to the Iron Meteorite Database Manager." 
  echo "Make sure Docker is running before performing any operations."
  echo "-h    Help: Displays the command options"
  echo "--------"
  echo "-i    Initial install: Install dependencies, build the containers, and launch"
  echo "      the server. This can take 15+ minutes and will download several GB of data."
  echo "--------"
  echo "-l    Launch: Installs node dependencies and then launches the server."
  echo "-p    Populate and launch: Launches the servers with the database populated"
  echo "      only from init script. Deletes local data."
  echo "-q    Quick launch: Launches the server without installing node dependencies."
  echo "      SELECT this if there have been no changes to the server since it last ran."
  echo "-a    Attached quick launch: Launches the server with node output to shell."
  echo "-f    Fresh build: Rebuild containers and launch."
  echo "--------"
  echo "-m    Mock data - add some mock data."
  echo "-s    Stop the server."
  echo "-x    Reset Docker Environment - Stops the server and clear the docker environment."
  echo "      Consider this the factory refresh of your Docker environment. Frees up space " 
  echo "      in your virtual drive. This does NOT uninstall Docker. "
  echo "--------"
  echo "Postgress must be running for backup operations."
  echo "-b    Backup: Makes a backup of the database."
  echo "-r    Restore: Restore the database from the most recent backup."
  echo ""
}

# No args given, display help
if [[ $# -eq 0 ]] ; then
  show_help
  exit 1
fi 

#### Declare functions for manipulating server and database ###

# Install the global dependencies
function install_global_deps ()
{
  echo "Installing global dependencies"
  # Global dependencies for testing node
  if [[ $EUID -ne 0 ]];
  then
    echo "running as sudo"
    sudo npm install -g gulp-cli
    sudo npm install -g jest-cli
  else
    echo "running as su"
    MYENV="$(uname -s)"
    LINUXENV="Linux"
    if [[ "$MYENV" == "$LINUXENV"  ]];
    then 
      apt update
      apt install npm -y
    fi
    npm install -g gulp-cli
    npm install -g jest-cli
  fi
}

# Install the node dependencies for the server
function install_node_deps ()
{
  echo ""
  echo "Installing node dependencies"
  # Local dependencies for node
  npm install
  gulp sass
  gulp js 
}

# Deletes the db folder that would prevent building fresh containers
function rm_db ()
{
  echo ""
  echo "Removing previous database"
  # Remove folders that would prevent building
  if [[ $EUID -ne 0 ]];
  then
    echo "running as sudo"
    sudo rm -rf pg-data 
    sudo rm -rf node-modules
  else
    echo "running as su"
    rm -rf pg-data 
    rm -rf node-modules
  fi
  mkdir pg-data
}

# Stops the containers that host the server
function stop_containers ()
{
  echo ""
  echo "Stopping previous containers"
  # Clear old networks then do a clean docker build
  docker-compose down
}

# Use docker-compose to build containers from manifest
function build_containers ()
{
  echo ""
  echo "Building containers"
  docker-compose build
}

# Start the containers with detached head, gives the user
# control over shell instead of reading node ouptut
function start_detached ()
{
  echo ""
  echo "Starting containers detached"
  docker-compose up -d
}

# Start the containers with the shell attached to the node output
function start_attached ()
{
  echo ""
  echo "Starting containers attached "
  docker-compose up
}

# Stops and deletes all containers on the system. Should only be used
# if the environment needs a complete do over.
function delete_containers ()
{
  echo "This will delete ALL containers on the system, are you sure you want to continue? "
  read -n1 -p "[y/N]: " doit 
  case $doit in  
    y|Y) 
      # The output is supressed to avoid unecessary warnings about
      # docker ${command} requiring at least one argument
      # since that just means it didn't find anything that met the criteria
      echo ""
      echo "Stop and remove running containers"
      docker stop $(docker ps -aq)  > /dev/null 2>&1
      docker rm $(docker ps -aq)  > /dev/null 2>&1
      echo "Erasing dangling containers "
      docker images -aq -f 'dangling=true' | xargs docker rmi  > /dev/null 2>&1
      echo "Reclaiming space on virtual drive "
      docker system prune -a --volumes
      ;; 
    *) # NO
      echo ""
      ;; 
  esac
}

# Make a backup of the db to irondb/backup-pg/pg_timestamp.sql
function make_backup ()
{
  echo ""
  echo "Making backup to irondb/backup-pg/"
  docker exec -t postgres pg_dump -c -U group16 -d postgres > backup-pg/pg_`date +%d-%m-%Y"_"%H_%M_%S`.sql
}

# Restore most recent backup of db
function restore_recent ()
{
  cd backup-pg
  STR="$(ls -tr | tail -1)"
  echo "Restoring from $STR"
  sleep 1
  cat $STR | docker exec -i postgres psql -U group16 -d postgres
  cd ..
}

# Populate mock data
function populate_mock_data ()
{
  echo "Populating mock data"
  echo "Connecting to postgres, this may take some time"
  NORESP=""
  PSYEXISTS="$(pip list | grep "psycopg2-binary")"
  PGACK="$(docker-compose logs  | grep "PostgreSQL init process complete")"
  # install psycopg2-binary if not exists
  if [[ "$PSYEXISTS" =  "$NORESP" ]]
  then 
    pip install psycopg2-binary
  fi

  COUNTER=0
  while [[ "$PGACK" = "$NORESP" ]]
  do
    echo -n "."
    sleep 1
    PGACK="$(docker-compose logs  | grep "PostgreSQL init process complete")"
    COUNTER=$((COUNTER + 1))
    if [[ "$COUNTER" -ge 30 ]]
    then
      echo "This operation timed out. Make sure that Postgres is running and try again."
      exit 1;
    fi
  done

  echo ""
  echo "adding users"
  node docker/mock-users.js 
  echo "adding user info"
  python docker/mock-user-info.py 
}

### BEGIN ###

# Read in the options and perform the tasks
while getopts ":hilpjqafsxbrm " opt; do
  case ${opt} in
    h )
      show_help
      exit 0
      ;;
    i ) #initial install
      stop_containers
      install_global_deps
      install_node_deps
      rm_db
      build_containers
      start_detached
      ;;
    l ) #launch
      stop_containers
      install_node_deps
      start_detached
      ;;
    p ) #launch with fresh postgres init
      stop_containers
      rm_db
      install_node_deps
      start_detached
      # populate_mock_data
      ;;
    j ) #launch with fresh postgres init
      stop_containers
      rm_db
      start_attached
      # populate_mock_data
      ;;
    q ) #quick launch
      stop_containers
      start_detached
      ;;
    a ) #attached quick launch
      stop_containers
      start_attached
      ;;
    f ) #rebuild containers
      stop_containers
      install_node_deps
      rm_db
      build_containers
      start_detached
      ;;
    m )
      populate_mock_data
      ;;
    s )
      stop_containers
      ;;
    x )
      delete_containers
      ;;
    b ) #backup db
      make_backup
      ;;
    r ) #restore most recent db backup
      restore_recent
      ;;
    * ) 
      echo "Invalid selection"
      ;;
  esac
done
shift $((OPTIND -1))

exit 0

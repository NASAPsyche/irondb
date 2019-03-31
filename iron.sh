#!/bin/bash
# Kenneth Bonilla 2019
# Iron Shell - Iron Meteorite Database Manager
# For deploying and managing the docker composition.

# Displays the help contents
function show_help ()
{
  helpString='                                     
            ██╗██████╗  ██████╗ ███╗   ██╗      
            ██║██╔══██╗██╔═══██╗████╗  ██║      
            ██║██████╔╝██║   ██║██╔██╗ ██║      
            ██║██╔══██╗██║   ██║██║╚██╗██║      
            ██║██║  ██║╚██████╔╝██║ ╚████║      
            ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝      
        ███████╗██╗  ██╗███████╗██╗     ██╗     
        ██╔════╝██║  ██║██╔════╝██║     ██║     
        ███████╗███████║█████╗  ██║     ██║     
        ╚════██║██╔══██║██╔══╝  ██║     ██║     
        ███████║██║  ██║███████╗███████╗███████╗
        ╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝
Welcome to the Iron Meteorite Database Manager.
Make sure Docker is running before performing any operations
--------------
The Iron Shell accepts chains of options, for example:
    ./iron.sh -lpea
This will (l)aunch the containers, after (p)opulating the database by the
init files, reseting the node (e)nvironment, in an attached shell and run
(a)ttached. While running in attached mode, it is not possible to perform
operations such as making database backups.
--------------
-i    Initial install: If this is your first time, or you need to rebuild 
      your containers, then select this option. The containers will launch
      once they are built.
-l    Launch containers: Launches the containers, by default the shell is 
      detached from the containers.
-a    Attach shell: When launching the containers, attach the shell to the
      Node server. CTRL+C to quit, this shuts down the server.
-e    Reset environment: Install the local Node dependencies and runs tasks
      specified by Gulp.
-p    Populate database: Will delete the local database and then populate
      it from the init files (./model/db-init/)
-s    Stop containers: Stops the containers.
--------------
-b    Backup database: creates a dump of the current database
-r    Restore database: restore the database from the most recent backup.
      For more advanced database manipulation, refer to Postgresql docs. 
--------------
-m    Mock users: Adds the mock users.
-g    Open logs: Opens the docker-compose logs, CTRL+C to exit logs.
-c    Clean Docker environment: Removes dangling containers and volumes.
-x    Reset Docker environment: Delete all containers. This is essentially
      a factory refresh of your Docker environment.
-h    Help: Displays the help message
  '
  echo "${helpString}"
}


# No args given, display help
if [[ $# -eq 0 ]] ; then
  show_help
  exit 1
fi 


#### Declare functions for manipulating server and database ###

# Add credentials
function set_creds () 
{
  echo "Set username and password for Postgres"
  NORESP=""
  while true; do
    echo -n "Select a username: "
    read name
    size=${#name}
    if [[ "$name" =~ [^a-zA-Z0-9\_] ]] || [[ "$name" == "$NORESP" ]] || [[ "${name:0:1}" =~ [^a-zA-Z] ]] ; then
      echo "Must start with a letter. Only letters, numbers, and underscore allowed"
    elif [[ $size < 3 ]]; then
      echo "${name} is too short, minimum of 3 characters"
    else 
      break
    fi
  done
  while true; do
    echo -n "Enter a password: "
    read -s pass1
    echo ""
    echo -n "Re-enter the password: "
    read -s pass2
    echo ""
    size=${#pass1}
    if [[ "$pass1" != "$pass2" ]]; then
      echo "The passwords did not match. Try again..."
    elif [[ "$pass1" == "$NORESP" ]]; then
      echo "You must enter a password"
    elif [[ "$pass1" =~ [\ \\\/\'\"\%\;] ]]; then
      echo "Illegal character: whitespace ' \" ; / \\ %"
    elif [[ $size < 6 ]]; then
      echo "password is too short, minimum 6 characters"
    else
      nameHolder="%%user%%"
      passHolder="%%password%%"

      # copy over docker-compose with template and change placeholders
      if [ -f "./docker-compose.yml" ]; then
        rm -f ./docker-compose.yml
      fi
      cp ./docker/template/docker-compose.yml ./docker-compose.yml
      sed -i '' -e 's/'"$nameHolder"'/'"$name"'/g' ./docker-compose.yml
      sed -i '' -e 's/'"$passHolder"'/'"$pass1"'/g' ./docker-compose.yml


      # add those credentials to the mock user info generator
      if [ -f "./docker/mock/mock-user-info.py" ]; then
        rm -f ./docker/mock/mock-user-info.py
      fi
      cp ./docker/template/mock-user-info.py ./docker/mock/mock-user-info.py
      sed -i '' -e 's/group16/'"$name"'/g' ./docker/mock/mock-user-info.py
      sed -i '' -e 's/abc123/'"$pass1"'/g' ./docker/mock/mock-user-info.py

      #  set user in sql init
      if [ -f "./model/db-init/00-init.sql" ]; then
        rm -f ./model/db-init/00-init.sql
      fi 
      cp ./docker/template/00-init.sql ./model/db-init/00-init.sql
      sed -i '' -e 's/group16/'"$name"'/g' ./model/db-init/00-init.sql
      break
    fi
  done
}

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

# Remove the dangly bits
function remove_dangles ()
{
  echo "Remove dangling images and volumes if any exist"
  docker images -aq -f 'dangling=true' | xargs docker rmi > /dev/null 2>&1
  docker volume ls -q -f 'dangling=true' | xargs docker volume rm > /dev/null 2>&1
}

# Make a backup of the db to irondb/model/backup-pg/pg_timestamp.sql
function make_backup ()
{
  echo ""
  echo "Making backup to irondb/model/backup-pg/"
  docker exec -t postgres pg_dump -c -U group16 -d postgres > model/backup-pg/pg_`date +%d-%m-%Y"_"%H_%M_%S`.sql
}

# Restore most recent backup of db
function restore_recent ()
{
  cd model/backup-pg
  STR="$(ls -tr | tail -1)"
  echo "Restoring from $STR"
  sleep 1
  cat $STR | docker exec -i postgres psql -U group16 -d postgres
  cd ..
}

# Wait for containers to be available
function wait_for_containers ()
{
  echo "Waiting for the containers to initialize"
  NORESP=""
  # Check that pg is available from logs of call to wait-for-it.sh
  COUNTER=0
  PGACK="$(docker-compose logs  | grep "is available after")"
  while [[ "$PGACK" = "$NORESP" ]]
  do
    echo -n "."
    sleep 2
    PGACK="$(docker-compose logs  | grep "is available after")"
    COUNTER=$((COUNTER + 1))
    if [[ "$COUNTER" -ge 30 ]]
    then
      echo ""
      echo "This operation timed out. Make sure that Docker is running and try again."
      exit 1
    fi
  done

  # Now that postgres is available, check for anything that delays ready status
  # Check for 'received fast shutdown request' and wait a bit if found
  echo " postgres is available, checking for full startup"
  PGACK="$(docker-compose logs  | grep "received fast shutdown request")"
  if [[ "$PGACK" != "$NORESP" ]]
  then
    for i in {1..2}
    do
      echo -n "."
      sleep 2
    done
  fi
  # Check postgres for any abnormal exits and wait a bit if found
  PGACK="$(docker-compose logs  | grep "exited with exit code 1")"
  if [[ "$PGACK" != "$NORESP" ]]
  then
    for i in {1..2}
    do
      echo -n "."
      sleep 2
    done
  fi
  # Check for incomplete startup packet and wait a bit if found
  PGACK="$(docker-compose logs  | grep "incomplete startup packet")"
  if [[ "$PGACK" != "$NORESP" ]]
  then
    for i in {1..2}
    do
      echo -n "."
      sleep 2
    done
  fi

  PGACK="$(docker-compose logs  | grep "FATAL:  the database system is starting up")"
  if [[ "$PGACK" != "$NORESP" ]]
  then
    for i in {1..2}
    do
      echo -n "."
      sleep 2
    done
  fi

  PGACK="$(docker-compose logs  | grep "Failed to prune sessions: the database system is starting up")"
  if [[ "$PGACK" != "$NORESP" ]]
  then
    for i in {1..2}
    do
      echo -n "."
      sleep 2
    done
  fi

  PGACK="$(docker-compose logs  | grep "database system was not properly shut down; automatic recovery in progress")"
  if [[ "$PGACK" != "$NORESP" ]]
  then
    for i in {1..2}
    do
      echo -n "."
      sleep 2
    done
  fi
  # Check for postgres making corrections
  PGACK="$(docker-compose logs  | grep "redo starts at")"
  if [[ "$PGACK" != "$NORESP" ]]
  then
    PGACK="$(docker-compose logs  | grep "redo done")"
    COUNTER=0
    while [[ "$PGACK" = "$NORESP" ]]
    do
      echo -n "."
      sleep 2
      COUNTER=$((COUNTER + 1))
      PGACK="$(docker-compose logs  | grep "redo done")"
      if [[ "$COUNTER" -ge 5 ]]
      then
        break
      fi
    done
  fi
  # Check for a relation error, this is bad, something wasn't initialized correctly
  PGACK="$(docker-compose logs  | grep "does not exist at character")"
  if [[ "$PGACK" != "$NORESP" ]]
  then
    echo " there was a call to a non-existant relation, exiting"
    exit 1
  fi
  

  echo " checking Node server for availability"
  COUNTER=0
  RES="$(curl --write-out %{http_code} --silent --output /dev/null localhost:3001)"
  GOODRES="200"
  BADFIVEHUNDRED="500"
  echo -n "Response code: $RES"
  while [[ "$RES" != "$GOODRES" ]]
  do
    if [[ "$RES" = "$BADFIVEHUNDRED" ]]
    then
      echo " Internal server error, exiting"
      exit 1
    fi
    sleep 5
    RES="$(curl --write-out %{http_code} --silent --output /dev/null localhost:3001)"
    echo -n " $RES"
    COUNTER=$((COUNTER + 1))
    if [[ "$COUNTER" -ge 12 ]]
    then
      echo ""
      echo "Node is not responding on the local network."
      echo "Run the following command for more information:"
      echo ""
      echo "      docker-compose logs -f -t"
      echo ""
      exit 1
    fi
  done
  echo ""
  echo "Node appears to be running"
}

# Populate mock data
function populate_mock_data ()
{
  install_pip
  NORESP=""
  PSYEXISTS="$(pip list --format=columns | grep "psycopg2-binary")"
 
  # install psycopg2-binary if not exists
  if [[ "$PSYEXISTS" =  "$NORESP" ]]
  then 
    pip install psycopg2-binary
  fi

  wait_for_containers

  echo " "
  echo "Adding mock users"
  node docker/mock/mock-users.js 
  python docker/mock/mock-user-info.py 
  exit 0
}

function install_pip ()
{
  echo "looking for pip"
  NORESP=""
  PIPEXISTS="$(which pip)"

  if [[ "$PIPEXISTS" == "$NORESP" ]]; then
    MYENV=$(uname -s)
    LINUXENV="Linux"
    MACENV="Darwin"
    PYTWO=$(python --version 2>&1 | grep "n 2.")
    PYTHREE=$(python --version 2>&1 | grep "n 3.")
    
    if [[ "$MYENV" == "$LINUXENV"  ]] && [[ "$PYTWO" != "$NORESP" ]] && [[ $EUID -ne 0 ]]; then
      echo "install python2 pip as sudo"
      sudo apt-get install -y python-pip
    elif [[ "$MYENV" == "$LINUXENV"  ]] && [[ "$PYTWO" != "$NORESP" ]]; then
      echo "install python2 pip as root"
      apt-get install -y python-pip
    elif [[ "$MYENV" == "$LINUXENV"  ]] && [[ "$PYTHREE" != "$NORESP" ]] && [[ $EUID -ne 0 ]]; then
      echo "install python3 pip as sudo"
      sudo apt-get install -y python3-pip
    elif [[ "$MYENV" == "$LINUXENV"  ]] && [[ "$PYTHREE" != "$NORESP" ]]; then
      echo "install python3 pip as root"
      apt-get install -y python3-pip 
    elif  [[ "$MYENV" == "$MACENV" ]]; then
      echo "installing pip as user:$EDUID for macOS"
      python -m ensurepip
    else 
      echo "unable to install pip automatically, install manually:"
      echo ""
      echo "      https://pip.pypa.io/en/stable/installing/ "
      exit 1
    fi
  else
    echo "pip is already installed"
  fi
}

### BEGIN ###

initInstall=false
attachShell=false
launchContainers=false
stopContainers=false
resetEnv=false
populateData=false
mockUsers=false
restoreData=false
backupData=false
deleteDocker=false
openLogs=false
cleanDocker=false


while getopts ":hilpaemsxbrgc " opt; do
  case ${opt} in
    h )
      show_help
      exit 0
      ;;
    i ) #initial install
      initInstall=true
      ;;
    l ) #launch
      launchContainers=true
      ;;
    p ) #launch with fresh postgres init
      populateData=true
      ;;
    a ) #attached quick launch
      attachShell=true
      ;;
    e )
      resetEnv=true
      ;;
    m )
      mockUsers=true
      ;;
    s )
      stopContainers=true
      ;;
    x )
      deleteDocker=true
      ;;
    b ) #backup db
      backupData=true
      ;;
    r ) #restore most recent db backup
      restoreData=true
      ;;
    g )
      openLogs=true
      ;;
    c )
      cleanDocker=true
      ;;
    * ) 
      echo "Invalid selection"
      ;;
  esac
done
shift $((OPTIND -1))

if [[ "$cleanDocker" = true ]] ; then
  remove_dangles
  exit 0;
fi

if [[ "$deleteDocker" = true ]] ; then
  delete_containers
  exit 0;
fi

if [[ "$initInstall" = true ]] ; then
  set_creds
  stop_containers
  install_global_deps
  install_node_deps
  rm_db
  remove_dangles
  build_containers
  if [[ "$attachShell" = true ]] ; then
    start_attached
    exit 0
  else
    start_detached
  fi
fi

if [[ "$launchContainers" = true ]] ; then
  stop_containers
  remove_dangles

  if [[ "$populateData" = true ]] ; then
    rm_db
  fi

  if [[ "$resetEnv" = true ]] ; then
    install_node_deps
  fi

  if [[ "$attachShell" = true ]] ; then
    start_attached
    exit 0
  else
    start_detached
  fi

else
  if [[ "$populateData" = true ]] ; then
    rm_db
  fi

  if [[ "$resetEnv" = true ]] ; then
    install_node_deps
  fi
fi

if [[ "$mockUsers" = true ]] ; then
  populate_mock_data
fi

if [[ "$backupData" = true ]] ; then
  wait_for_containers
  make_backup
fi

if [[ "$restoreData" = true ]] ; then
  wait_for_containers
  restore_recent
fi


if [[ "$openLogs" = true ]] ; then
  docker-compose -f -t
  exit 0
fi

if [[ "$stopContainers" = true ]] ; then
  stop_containers
fi

exit 0

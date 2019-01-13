# irondb - Iron Meteorite Database

## Dependencies and documentation
* [Node JS](https://nodejs.org/en/) - Server-side JS Runtime
* [Express.JS](https://expressjs.com/en/4x/api.html) - Web Application Framework
* [EJS](http://ejs.co/) - Templating Engine
* [Bootstrap](https://getbootstrap.com/docs/4.1/getting-started/introduction/) - Front-end Framework
* [JQuery](https://api.jquery.com/) - JavaScript Library
* [Passport.js](http://www.passportjs.org/) - Authentication middleware fo Node.js
* [Jest](https://jestjs.io/) - Javascript Testing Framework

#### Tools
* [NPM](https://www.npmjs.com/) - Node Package Manager
* [Gulp](https://gulpjs.com/) - Task Runner
To install Gulp run `npm install gulp-cli -g`
* [Docker](https://www.docker.com/) - Container Engine
To install follow the instructions for your given operating sytem [here](https://docs.docker.com/v17.12/install/). 

## Structure

```bash
├── bin					# Scripts
│	│
│ 	└── www					# Server startup bash script.
│
├── docker					# Docker support files
│	│
│ 	└── start				# Supporting scripts
│ 	  	└── docker-clean.sh 						# Performs a clean build and run
│ 	  	└── docker-initial-install.sh 				# First time install and run
│ 	  	└── docker-start.sh 						# Run pre-built containers
│ 	  	└── remove-all.sh 							# Removes ALL containers from system
│
├── controller			# Handles business logic and routing.
│	│
│ 	├── routes
│ 	│ 	└── index.js 		# Index router - file defines logic for the "/" route.
│ 	│ 
│ 	└── app.js 			# Primary server file.
│ 
├── public 					# Directory containing public static assets.
│	│
│	├── javascripts			# Directory containing js assests. Target for bootstrap js dependencies.
│	│
│	└── stylesheets			# Directory containing css assests. Target for bootstrap.css.
│
├──	views
│	│
│	├── bootstrap			# Directory containing templates for bootstrap tags.
│	│
│	└── index.ejs			# Example EJS template.
│
├── .gitignore			# File defines files git ignore tracking.
│
├── gulpfile.js 		# Gulp task script.
│
├── iron.sh				# Controller for running containers
│
├── package.json		# NPM package manager project config.
│
└── README.md 			# Project documentation file.
```



## Install and run the project

#### Required Dependencies
1. Node
2. Gulp
3. Docker (if using containers)

#### To Run without docker
It is no longer possible to run the project without Docker installed and running. Please follow the instructions To Run with Docker-Compose Automatic

#### To Run with Docker-Compose Automatic
Docker must be running. This will allow you to install dependencies, build the containers, run the containers, and close the containers. This is the recommended method for deployment.
1. `cd irondb` - change directory to root
2. (optional - do if step 3 does not launch) `chmod u+x dockerup.sh` - set the script to executable if it is not already so.
3. `./iron.sh` - Builds and launches the Docker Composition
4. Follow the prompts.
If this is your first time, select `1`. If you are only testing changes that do not impact the building of the docker containers themselves, select `3`. This will be the most common selection.

#### To Run with Docker-Compose Manual
Pre-requisite - Must have docker and gulp cli installed, and docker must be running. See Tool section above for installation details.
1. `cd irondb` - change directory to root
2. `npm install` - Install dependencies.
3. `gulp sass` - Compile bootstrap sass and move to public directory.
4. `gulp js` - Move JS dependencies into public directory.
5. `mkdir pg-data` - Create pg-data directory for postgres data. 
6. `docker-compose up --build` - Use docker compose to build and run images.
	- You can also run up and build commands separately, i.e. `docker-compose build` and `docker-compose up`.
Notes: control-c to exit, then `docker-compose down` to gracefully stop images if they are not already down. Gulp tasks must be run manually before building the image to ensure proper bootstrap integration. 

#### Useful docker-compose commands:
* `docker-compose build` - Build images defined by the current directories docker-compose.yml file, but don't run containers.
* `docker-compose up` - Run containers defined by the current directories docker-compose.yml file.
* `docker-compose up --build` - Build and run containers.
* `docker-compose down` - Gracefully stop containers.

## Testing

#### Coverage
To run tasks using gulp run command `gulp jest`, jest-cli may be required locally, to install run `sudo npm install -g jest-cli`.

Coverage details can be found in the /coverage directory after running tests.

#### ESLint
ESLint is used to enforce style guides for Javascript. ESLint is currently set to enforce:
1. ESLint recommended
2. Google JS Style Guide
3. Node recommended

To run ESLint on the entire project:
`cd irondb`
`npm run pretest`


### Example Route Walkthrough
[Tech Stack Walkthrough Playlist](https://www.youtube.com/playlist?list=PL9InapyRWXwmENss1Vw9GdUahwmh0o9nU) - 
Playlist of videos demonstrating writing an example route with the project tech stack.


Base project initialized using [Express Generator](https://expressjs.com/en/starter/generator.html).

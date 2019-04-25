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

## Install and run the project

#### Required Dependencies
1. Node
2. Gulp
3. Docker

#### To Run without docker
It is no longer possible to run the project without Docker installed and running. Please follow the instructions To Run with Docker-Compose Automatic

#### To Run with Docker-Compose Automatic
Docker must be running. This will allow you to install dependencies, build the containers, run the containers, and close the containers. This is the recommended method for deployment.
1. `cd irondb` - change directory to root
2. `./iron.sh` - Builds and launches the Docker Composition. Use `./iron.sh -h` for help.
To install the servers and launch them `./iron.sh -i`
To launch from previously built containers `./iron.sh -l`

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

## Architecture

```bash
├── __test__			# Jest unit tests
│
├── bin					# Scripts
│	│
│ 	├── www					# Server startup bash script.
│	│
│	└── scss				# Bootstrap sass override file
│
├── deployment			# Deployment documentation
│
├── docker				# Docker support files and mock user scripts
│	│
│ 	├── mock				# Mock user scripts
│	│
│ 	├── node				# Node image files
│ 	│ 
│ 	├── postgres			# Postgres database files
│ 	│ 
│ 	├── template			# Templates for iron.sh
│ 	│ 
│ 	└── wait-for-it.sh 		# Script used in docker-compose to wait to start up 
│ 					# server until database is ready
│
│
├── external			# External python scripts for 
│ 	│ 			# natural language process and data extraction
│	│
│ 	├── anaconda 			# Python environment for external development
│ 	│ 
│ 	└── pdfScraper			# Python scripts for data extraction
│
├── model				# Database init files
│
│
├── controller			# Handles business logic and routing.
│	│
│ 	├── db					# Database access layer
│	│
│ 	├── middleware			# Middleware functions
│ 	│ 
│ 	├── py					# Internal python scripts
│ 	│ 
│ 	├── routes		 		# All website routes
│	│
│ 	├── utils				# Utility functions
│ 	│ 
│ 	└── app.js 				# Primary server file.
│ 
├── public 				# Directory containing public static assets.
│	│
│ 	├── images				# Directory containing image assests.
│	│
│ 	├── temp				# Directory where pdfs written to.
│	│
│	├── javascripts			# Directory containing js assests. 
│	│				# Target for bootstrap js dependencies.
│	│
│	└── stylesheets			# Directory containing css assests. Target for bootstrap.css.
│
├──	views				# EJS templates.
│	│
│	├── bootstrap			# Directory containing templates for bootstrap tags.
│	│
│	└── components			# EJS component template.
│
├── .dockerignore			# File defines files docker ignores.
│
├── .eslintignore			# Eslint ignore rules.
│
├── .eslintrc.json			# ESLinfr config gile.
│
├── .gitignore				# File defines files git ignore tracking. 
│
├── README.md 				# Project read me file.
│
├── docker-compose.yml		# Controller for running containers
│
├── gulpfile.js 			# Gulp task script.
│
├── iron.sh					# Controller for running containers
│
├── package-lock.json		# NPM tree structure
│
└── package.json			# NPM package manager project config
```

## Architecture Explanation
The Iron Meteorite Database implements a Model-View-Controller architecture leveraging an external module of scripts to provide tools for extracting element compositional data of iron meteorites from research papers. App uses Bootstrap and JQuery front-end on top of EJS templates, Web server built on Express and Node.js to handle requests, and Postgres Database stores all collected data.

### **Model**: Defines the database and way data is used. 
#### **Main Files (db-init)**:
- 00-init.sql
	- Creates database with owner for use in iron shell, allowing the shell script to set the postgres credentials during initialization.
- 01-init.sql
	- Main file defining the tables of the database.
	- For each main table (bodies, element_entries, papers, etc.) there is a status table with meta data about that table. 
	- In action the submissions table is meant to tie the metadata together by submission for logical binding of all parts of a submission.
- 02-init.sql
	- File defines database views used by the application to get data.
	- **Audit required**, some views no longer in use.
- 03-init.sql
	- File defines and populates two tables: analysis_techniques and element_symbols.
	- These tables are used to populate all UI select elements that represent element selection and technique selection.
- 99-init.sql
	- File defines mock data.
	- Mock data most useful for public facing front-end examples. (Database and database export pages primarily)
	- Mock data missing tie to submission and therefore is not used for the data-entry flows or views shown on pages requiring authentication. (Features where data is tied directly to their submission)

### **View**: Defines what the user sees. 
#### EJS templating engine:
Used to render views on the server with Bootstrap and JQuery used as the primary front-end tools. Each template has in view is used for the corresponding route. Components are used to break up commonly used code snippets as well as define template responses for AJAX calls.
#### **Important notes**:
- Bootstrap component used on all pages to provide access to bootstrap and it's dependencies. 
- The public folder is very tied to the views:
	- Each template has some added styles through css found in public/stylesheets.
	- Front-end functionality written in JQuery found in the public/javascripts folder.
	- public/images folder used to store static images used by the site.
	- public/temp folder used to temporarily store pdf uploads while the data is being entered. (pdf deleted upon complete approval of the submission.)
- Naming convention to name route, template, stylesheet, and public javascripts for a single page a similar, if not same, name.

### **Controller**: Coordinates all request and handling of data. 

## Testing

#### Coverage
To run tasks using gulp run command `gulp jest`, jest-cli may be required locally, to install run `sudo npm install -g jest-cli`.

Coverage details can be found in the /coverage directory after running tests.

## Code Style

#### ESLint
ESLint is used to enforce style guides for Javascript. ESLint is currently set to enforce:
1. ESLint recommended
2. Google JS Style Guide
3. Node recommended

To run ESLint on the entire project:
`cd irondb`
`npm run pretest`


Base project initialized using [Express Generator](https://expressjs.com/en/starter/generator.html).

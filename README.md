# irondb - Iron Meteorite Database

## Dependencies and documentation
* [Node.js](https://nodejs.org/en/) - Server-side JS Runtime
* [Express.js](https://expressjs.com/en/4x/api.html) - Web Application Framework
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
To install follow the instructions for your operating sytem [here](https://docs.docker.com/v17.12/install/). 

## Install and run the project

#### Required Dependencies
1. Node
2. Gulp
3. Docker

#### To Run with Docker-Compose Automatic
Docker must be running. This will allow you to install dependencies, build the containers, run the containers, and close the containers. This is the recommended method for deployment.  
1. `cd irondb` - change directory to root  
2. `./iron.sh` - builds and launches the Docker Composition. Use `./iron.sh -h` for help. To install the servers and launch them: `./iron.sh -i`. To launch from previously built containers: `./iron.sh -l`  

#### To Run with Docker-Compose Manual
Prerequisite - Must have docker and gulp cli installed, and docker must be running. See Tool section above for installation details.
1. `cd irondb` - change directory to root
2. `npm install` - install dependencies
3. `gulp sass` - compile bootstrap sass and move to public directory
4. `gulp js` - move JS dependencies into public directory
5. `mkdir pg-data` - create pg-data directory for postgres data
6. `docker-compose up --build` - use docker compose to build and run images
	- You can also run up and build commands separately, i.e. `docker-compose build` and `docker-compose up`.

Notes: control^c to exit, then `docker-compose down` to gracefully stop images if they are not already down. Gulp tasks must be run manually before building the image to ensure proper bootstrap integration. 

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
│ 	├── images				# Directory containing image assets.
│	│
│ 	├── temp				# Directory where pdfs written to.
│	│
│	├── javascripts			# Directory containing js assets. 
│	│				# Target for bootstrap js dependencies.
│	│
│	└── stylesheets			# Directory containing css assets. Target for bootstrap.css.
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

## Architectural Notes
The Iron Meteorite Database implements a Model-View-Controller architecture leveraging an external module of scripts to provide tools for extracting element compositional data of iron meteorites from research papers. App uses Bootstrap and JQuery front-end on top of EJS templates, Web server built on Express and Node.js to handle requests, and Postgres Database stores all collected data. 

### **Docker**: Supporting files for the build of containers for running the server and database. 
Two docker containers comprise the execution environment. Server and scripts are ran in one container, while the database is run in another. The Iron Shell (iron.sh) provides a utility for running and managing the docker aspects of the project. Repository files are copied into the server image and postgres image is initialized using the files in db-init of the model directory. (Note: docker-compose.yml in root of repository as well as iron.sh used to manage and run docker containers)
#### **Components**:
- **mock:** Directory containing scripts used by iron.sh to add mock users to the application. This is necessary as password hashes are stored, not passwords.
- **node:** Directory containing node image and accompanying build files.
- **postgres:** Directory containing postgres image and accompanying build files.
- **template:** Template files used when initializing for the first time with iron.sh. These files allow the shell script to provide the user with options to set parameters like the database username and password as well as dynamically generating the app secret.
- **wait-for-it.sh** [Bash script](https://github.com/vishnubob/wait-for-it) used to stager the deployment of docker containers so the database is up and ready to accept connections before the server is started.


### **Model**: Defines the database and data representation. 
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
- The public folder is tied to the views in many ways:
	- Each template has some added styles through css found in public/stylesheets.
	- Front-end functionality written in JQuery found in the public/javascripts folder.
	- public/images folder used to store static images used by the site.
	- public/temp folder used to temporarily store pdf uploads while the data is being entered. (pdf deleted upon complete approval of the submission.)
- Naming convention to name route, template, stylesheet, and public javascripts for a single page a similar, if not same, name.

### **Controller**: Coordinates all request and handling of data. 
#### Components:
- **db:** Database access layer, defines connection to postgres database using [node-postgres](node-postgres.com) and stores several of the core database transaction logic.
    - **index.js** Instantiates the connection pool and exposes node-postgres query functions. Pool exported for direct client usage when executing database calls as transaction [see here](https://node-postgres.com/features/transactions) for example.
    - **entry-parser.js** Parser for manual editor and tool without tables.
    - **insert-entry.js** Module inserts entry from entry parser.
    - **update-entry.js** Module takes an object with an array of database commands and runs the commands.
- **middleware**:
    - **auth.js** Defines middleware to protect routes with authentication using [passport.js](http://www.passportjs.org/)
- **py:** Internal python scripts. Provides validations for editor.
- **routes:** Each file defines a router with routes related to its name. In the case of data-entry and database some routers have been nested to be attached to their respective router before being attached to the root application.
- **utils:** Functions used throughout the application
- **app.js** The core of the application. Combines all routers defines the overall flow of requests into the server.

### Other important libraries used on the server (for full list see package.json):
- [bcrypt](https://www.npmjs.com/package/bcrypt): For salting and hashing passwords. (app.js and auth routes such as register)
- [formidable](https://www.npmjs.com/package/formidable): For pdf upload. (Used exclusively in data-entry router)
- [json2csv](https://www.npmjs.com/package/json2csv): For converting serialized export data into downloadable csv. (Used in database router)
- [pdfobject](https://www.npmjs.com/package/pdfobject): For pdf display on the front-end. (Used in all template where a pdf is displayed)
- [python-shell](https://www.npmjs.com/package/python-shell): For managing the running of python scripts. (Used in tool routes)

### **External**: Module for extracting paper attributes and table data from uploaded pdfs.
- [Anaconda](https://anaconda.org/) environment provided for developing python scripts externally from server development.
- **pdfScraper:** 
	-  **Files beginning with pdf:** Import and prepare pdf text for natural language processing and table extraction.
	-  **nlp4metadata.py:** Extracts paper attributes from the text of a pdf using NLP. Attributes include: title, authors, source (journal, volume, issue), and publishing date.
	- **Files beginning with table:** Prepare, extract, and clean table data from pdfs.
	
### Other Files of Note
- **package.json/package-lock.json:** Node Package Manager files defining the dependency tree and external packages used in the project.
- **iron.sh:** The iron shell is a shell script for the management and deployment of all aspects of the project.
- **gulpfile.js:** Gulp task file, defining task to be run with the gulp task runner. This is used to prepare bootstrap files and dependencies for deploying the project.
- **docker-compose.yml:** File defines usage of docker images via docker-compose.



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

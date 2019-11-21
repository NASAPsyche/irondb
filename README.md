# irondb - Iron Meteorite Database
## Dependencies and documentation
* [Node.js](https://nodejs.org/en/) - Server-side JS Runtime
* [Express.js](https://expressjs.com/en/4x/api.html) - Web API Framework
* [React](https://reactjs.org/) - Front-end application framework
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
1. `cd irondb` - change directory to root.
2. `./iron.sh` - builds and launches the Docker Composition. Use `./iron.sh -h` for help. To install the servers and launch them: `./iron.sh -i`. To launch from previously built containers: `./iron.sh -l`.

- To see the new React application, navigate with a browser to `localhost:8001`
- To see the previously existing application, navigate with a browser to `localhost:3001`

**NOTE: This README will be updated more as the migration to React for the front-end continues**
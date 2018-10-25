# irondb - Iron Meteorite Database

### Dependencies and documentation
* [Node JS](https://nodejs.org/en/) - Server-side JS Runtime
* [Express.JS](https://expressjs.com/en/4x/api.html) - Web Application Framework
* [EJS](http://ejs.co/) - Templating Engine
* [Bootstrap](https://getbootstrap.com/docs/4.1/getting-started/introduction/) - Front-end Framework
* [JQuery](https://api.jquery.com/) - JavaScript Library
* [Passport.js](http://www.passportjs.org/) - Authentication middleware fo Node.js

### Tools
* [NPM](https://www.npmjs.com/) - Node Package Manager
* [Gulp](https://gulpjs.com/) - Task Runner
To install Gulp run `npm install gulp-cli -g`

### Structure

```bash
├── bin						# Scripts
│	│
│ 	└── www					# Server startup bash script.
│
├── controller				# Handels business logic and routing.
│	│
│ 	├── routes
│ 	│ 	└── index.js 	# Index router - file defines logic for the "/" route.
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
├── .gitignore				# File defines files git ignore tracking.
│
├── gulpfile.js 			# Gulp task script.
│
├── package.json			# NPM package manager project config.
│
└── README.md 				# Project documentation file.
```





### Required Dependencies
1. Node
2. Gulp

### To Run
1. `cd irondb` - change directory to root
2. `npm install` - Install dependencies.
3. `gulp sass` - Compile bootstrap sass and move to public directory.
4. `gulp js` - Move JS dependencies into public directory.
5. `npm start` - Start the server.
6. `http://localhost:3000` - Navigate to localhost port 3000.

Base project initialized using [Express Generator](https://expressjs.com/en/starter/generator.html).
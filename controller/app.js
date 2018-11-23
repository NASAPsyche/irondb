const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('./db');

// Define individual route routers
const indexRouter = require('./routes/index');
const databaseRouter = require('./routes/database');

const exampleRouter = require('./routes/example');

//Auth Routes
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');

const dataEntryRouter = require('./routes/data-entry');

// Configure the local strategy for use by Passport.
passport.use(new LocalStrategy((username, password, done) => {
	db.query('SELECT user_id, username, password, role FROM users WHERE username=$1', [username], (err, result) => {
		//Verify callback provides user if credentials accepted.
		if(err) {
			// Return error if username not found in db.
			return done(err); 
		}

		// If query returns result, verify password by unhashing.
		if(result.rows.length > 0) {
			const user = result.rows[0];
			bcrypt.compare(password, user.password, function(err, res) {
				if(res) {
					// Return user if password is valid.
					return done(null, { id: user.user_id, username: user.username, role: user.role });
				} else {
					return done(null, false);
				}
			});
		} else {
			return done(null, false);
		}
	});
}));

// Configure Passport authenticated session persistence.
// Defining function to serialize and deserialize user from session.
passport.serializeUser(function(user, done) {
  return done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	db.query('SELECT user_id, username, password, role FROM users WHERE user_id=$1', [id], (err, result) => {
		//Get user by id.

		// If query returns result, verify password by unhashing.
		if(result.rows.length > 0) {
			const user = result.rows[0];
			return done(null, { id: user.user_id, username: user.username, role: user.role });
		} else {
			return done(err, null);
		}
	});
});


// Initialize Application
const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use(session({
	secret: "Temporary_Example_Secret_Hide_Real_Secret_When_in_Production",
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 60 * 60 * 1000 } // maxAge set to 60 mins, param in miliseconds
}));

app.use(passport.initialize());
app.use(passport.session());

// Define routers for given routes
app.use('/', indexRouter);
app.use('/database', databaseRouter);
app.use('/example', exampleRouter);

// Use Auth Routers
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);

app.use('/data-entry', dataEntryRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

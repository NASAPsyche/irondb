const express = require("express");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const db = require("./db");
const expressSanitizer = require("express-sanitizer");

// Define individual route routers
const indexRouter = require("./routes/index");
const databaseRouter = require("./routes/database");
const helpRouter = require("./routes/help");

// Remove in production
const exampleRouter = require("./routes/example");

// Auth Routes
const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");

// Protected Routes
const dataEntryRouter = require("./routes/data-entry");
const panelRouter = require("./routes/panel");
const profileRouter = require("./routes/user-profile");
const usersRouter = require("./routes/user-management");

// Configure the local strategy for use by Passport.
passport.use(
  new LocalStrategy((username, password, done) => {
    db.query(
      // eslint-disable-next-line max-len
      "SELECT user_id, username, password_hash, role_of FROM users WHERE username=$1",
      [username],
      (err, result) => {
        // Verify callback provides user if credentials accepted.
        if (err) {
          // Return error if username not found in db.
          return done(err);
        }

        // If query returns result, verify password by unhashing.
        if (result.rows.length > 0) {
          const user = result.rows[0];
          bcrypt.compare(password, user.password_hash, function(err, res) {
            if (res) {
              // Return user if password is valid.
              return done(null, {
                id: user.user_id,
                username: user.username,
                role: user.role_of
              });
            } else {
              return done(null, false);
            }
          });
        } else {
          return done(null, false);
        }
      }
    );
  })
);

// Configure Passport authenticated session persistence.
// Defining function to serialize and deserialize user from session.
passport.serializeUser(function(user, done) {
  return done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.query(
    // eslint-disable-next-line max-len
    "SELECT user_id, username, password_hash, role_of FROM users WHERE user_id=$1",
    [id],
    (err, result) => {
      // Get user by id.

      // If query returns result, verify password by unhashing.
      if (result.rows.length > 0) {
        const user = result.rows[0];
        return done(null, {
          id: user.user_id,
          username: user.username,
          role: user.role_of
        });
      } else {
        return done(err, null);
      }
    }
  );
});

// Initialize Application
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "../view"));
app.set("view engine", "ejs");

// Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

app.use(
  session({
    secret: "%%SECRET%%",
    resave: false,
    saveUninitialized: false,
    // maxAge set to 60 mins, param in miliseconds
    cookie: { maxAge: 60 * 60 * 1000 }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(expressSanitizer());

// Define routers for given routes
app.use("/api", indexRouter);
app.use("/api/database", databaseRouter);
app.use("/api/example", exampleRouter);
app.use("/api/help", helpRouter);

// Use Auth Routers
app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);
app.use("/api/logout", logoutRouter);

// Protected Routes
app.use("/api/data-entry", dataEntryRouter);
app.use("/api/panel", panelRouter);
app.use("/api/profile", profileRouter);
app.use("/api/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let isSignedIn = false;
  if (req.isAuthenticated()) {
    isSignedIn = true;
  }
  // next(createError(404));
  // eslint-disable-next-line max-len
  // res.render('error', {isSignedIn: isSignedIn, message: 'Page Not Found', errcode: 'Error 404'});
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  if (req.app.get("env") === "development") {
    console.log(err);
  }

  // check if logged in
  let isSignedIn = false;
  if (req.isAuthenticated()) {
    isSignedIn = true;
  }

  // render the error page
  res.status(err.status || 500);
  // eslint-disable-next-line max-len
  if (res.statusCode == 500) {
    // eslint-disable-next-line max-len
    res.render("error", {
      isSignedIn: isSignedIn,
      message: "Internal Server Error",
      errcode: "Error 500"
    });
  } else {
    // eslint-disable-next-line max-len
    res.render("error", {
      isSignedIn: isSignedIn,
      message: "Unauthorized",
      errcode: "Error 401"
    });
  }
});

module.exports = app;

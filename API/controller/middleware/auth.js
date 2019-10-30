const createError = require('http-errors');
// eslint-disable-next-line no-unused-vars
const passport = require('passport');

module.exports = {isLoggedIn: function(req, res, next) {
  // Middleware moves to next if user is logged in.
  if (req.isAuthenticated()) {
    return next();
  }

  // Middleware creates 401 error if not authorized.
  return next(createError(401));
},
isAdmin: function(req, res, next) {
  // Middleware moves to next if user is logged in as an admin.
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }

  // Middleware creates 401 error if not authorized.
  return next(createError(401));
},
};

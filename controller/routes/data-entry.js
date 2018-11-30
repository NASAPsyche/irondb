/* eslint-disable no-unused-vars */
const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const passport = require('passport');
const {isLoggedIn, isAdmin} = require('../middleware/auth');

router.get('/', isLoggedIn, function(req, res, next) {
  // Temporary check to show authentication is working.
  res.render('data-entry');
});

module.exports = router;

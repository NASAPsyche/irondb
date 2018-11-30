const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
// eslint-disable-next-line no-unused-vars
const passport = require('passport');

router.get('/', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = router;

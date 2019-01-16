const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {isLoggedIn} = require('../middleware/auth');

router.get('/', isLoggedIn, function(req, res, next) {
  res.render('data-entry');
});

router.get('/editor', isLoggedIn, function(req, res, next) {
  res.render('editor');
});

module.exports = router;

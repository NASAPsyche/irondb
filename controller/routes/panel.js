const express = require('express');
const router = express.Router();
const passport = require('passport');
const {isLoggedIn, isAdmin} = require('../middleware/auth');

router.get('/', isLoggedIn, function(req, res, next) {
  if (req.user.role === 'admin') {
  	// placeholder
  } else {
  	res.render('user-panel');
  }
});

module.exports = router;
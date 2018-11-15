const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET login page. */
router.get('/', function(req, res, next) {
	if (req.isAuthenticated()){
		res.send("You are already logged in as: " + req.user);
	}
  res.render('login');
});

router.post('/', passport.authenticate("local", {
	successRedirect: '/',
	failureRedirect: '/login'
}), function(req, res){});

module.exports = router;

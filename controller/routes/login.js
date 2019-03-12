const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const passport = require('passport');

/* GET login page. */
router.get('/', function(req, res, next) {
  let isSignedIn = false;
  if (req.isAuthenticated()) {
    isSignedIn = true;
    res.render('login', {isSignedIn: isSignedIn});
  }
  res.render('login', {isSignedIn: isSignedIn});
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/panel',
  failureRedirect: '/login',
}), function(req, res) {});

module.exports = router;

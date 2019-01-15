const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const passport = require('passport');

/* GET login page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.send('You are already logged in as: ' + req.user);
  }
  res.render('login');
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/panel',
  failureRedirect: '/login',
}), function(req, res) {});

module.exports = router;

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const passport = require('passport');

/* GET login page. */
router.get('/', function(req, res, next) {
  let isSignedIn = false;
  if ( req.header('Referer') !== undefined &&
  req.header('Referer').slice(-6) === '/login') {
    res.render('login', {
      isSignedIn: isSignedIn,
      Alert: `Invalid username or password.`,
      AlertType: 'error',
    });
  } else if ( req.header('Referer') !== undefined &&
  req.header('Referer').slice(-9) === '/register') {
    res.render('login', {
      isSignedIn: isSignedIn,
      Alert: `Successfully registered.`,
      AlertType: 'success',
    });
  } else if (req.isAuthenticated()) {
    isSignedIn = true;
    res.render('login', {
      isSignedIn: isSignedIn,
      Alert: '',
      AlertType: '',
    });
  } else {
    res.render('login', {
      isSignedIn: isSignedIn,
      Alert: '',
      AlertType: '',
    });
  }
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/panel',
  failureRedirect: '/login',
}), function(req, res) {});

module.exports = router;

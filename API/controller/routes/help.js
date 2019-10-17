const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

/* GET help page. */
router.get('/', function(req, res, next) {
  // check if signed in
  let isSignedIn = false;
  if (req.isAuthenticated()) {
    isSignedIn = true;
  }
  res.render('help', {isSignedIn: isSignedIn});
});

module.exports = router;

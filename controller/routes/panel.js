const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {isLoggedIn} = require('../middleware/auth');

router.get('/', isLoggedIn, function(req, res, next) {
  if (req.user.role === 'admin') {
    // placeholder
  } else {
    res.render('user-panel');
  }
});

module.exports = router;

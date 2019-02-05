const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {isAdmin, isLoggedIn} = require('../middleware/auth');

router.get('/', isLoggedIn, function(req, res, next) {
  if (req.user.role === 'admin') {
    res.redirect('/panel/admin');
  } else {
    res.redirect('/panel/user');
  }
});


router.get('/admin', isAdmin, function(req, res, next) {
  res.render('admin-panel');
});


router.get('/user', isLoggedIn, function(req, res, next) {
  res.render('user-panel');
});

module.exports = router;

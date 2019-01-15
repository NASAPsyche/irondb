const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = router;

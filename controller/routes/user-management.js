const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {isAdmin} = require('../middleware/auth');

router.get('/', isAdmin, function(req, res, next) {
  res.render('user-management');
});

module.exports = router;

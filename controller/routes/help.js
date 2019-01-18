const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

/* GET help page. */
router.get('/', function(req, res, next) {
  res.render('help');
});

module.exports = router;

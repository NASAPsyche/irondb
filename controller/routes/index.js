const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

/* GET landing page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;

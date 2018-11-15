var express = require('express');
var router = express.Router();

/* GET example page. */
router.get('/', function(req, res, next) {
  if (req.xhr === true) {
    // If ajax request return information.
    res.json({username: "user1"});
  } else {
  	// If not ajax handel as regular get request.
  	res.render('example', { title: 'Example Route' });
  }
});

module.exports = router;
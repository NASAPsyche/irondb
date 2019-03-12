const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {isLoggedIn} = require('../../middleware/auth');

router.get('/', isLoggedIn, function(req, res, next) {
  // Root of tool router i.e. 'localhost:3001/data-entry/tool'
  // Probably where you'd want the get for basic data used elsewhere
  res.send('basic data requested');
});

router.get('/tables', isLoggedIn, function(req, res, next) {
  // route to request all tables
  res.send('all pages requested');
});

router.get('/tables/:page_number', isLoggedIn, function(req, res, next) {
  // route to request tables on given page
  res.send('Page number ' + req.params.page_number + ' requested');
});

module.exports = router;

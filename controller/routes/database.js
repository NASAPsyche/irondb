const express = require('express');
const router = express.Router();
const db = require('../db');

/* GET database page. */
router.get('/', function(req, res, next) {
  var entriesTable = [];
  db.query('SELECT * FROM complete_table WHERE status=$1', ['active'], (dbErr, dbRes) => {
    if (dbErr) {
      return next(dbErr);
    }

    entriesTable = dbRes.rows;
    res.render('database', { Entries: dbRes.rows });
  });
});


module.exports = router;

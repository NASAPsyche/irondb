const express = require('express');
const router = express.Router();
const db = require('../db')

/* GET database page. */
router.get('/', function(req, res, next) {
  db.query('SELECT * FROM Entries', [], (dbErr, dbRes) => {
    if (dbErr) {
      return next(dbErr);
    }
    res.render('database', { id: dbRes.rows[0].entry_id, name: dbRes.rows[0].name });
  });
});


module.exports = router;
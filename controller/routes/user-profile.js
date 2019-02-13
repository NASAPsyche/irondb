const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {isLoggedIn} = require('../middleware/auth');
const db = require('../db');

// router.get('/', isLoggedIn, function(req, res, next) {
//  res.render('user-profile');
// });


/* GET /panel/user  */
router.get('/', isLoggedIn, function(req, res, next) {
  db.query(
      'SELECT * FROM full_attributions_pending', [],
      (dbErr, dbRes) => {
        if (dbErr) {
          return next(dbErr);
        }
        console.log(dbRes);
        res.render('user-panel', {Entries: dbRes.rows});
      });
});
module.exports = router;

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {isLoggedIn} = require('../middleware/auth');
const db = require('../db');

router.get('/', isLoggedIn, function(req, res, next) {
  res.render('user-profile');
});


// /* GET /panel/user  */
// router.get('/', isLoggedIn, function(req, res, next) {
//   db.query(
//       'SELECT * FROM pending_table WHERE status=$1',
//       ['active'],
//       (dbErr, dbRes) => {
//         if (dbErr) {
//           return next(dbErr);
//         }
//         res.render('user-profile', {Entries: dbRes.rows});
//       });
// });
module.exports = router;

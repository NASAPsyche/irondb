const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const db = require('../db');
const {isAdmin, isLoggedIn} = require('../middleware/auth');

router.get('/', isLoggedIn, function(req, res, next) {
  if (req.user.role === 'admin') {
    res.redirect('/panel/admin');
  } else {
    res.redirect('/panel/user');
  }
});


router.get('/admin', isAdmin, function(req, res, next) {
  res.render('admin-panel');
});


router.get('/user', isLoggedIn, function(req, res, next) {
  db.query(
      'SELECT * FROM full_attributions_pending', [],
      (dbErr1, dbRes1) => {
        if (dbErr1) {
          return next(dbErr1);
        }
        db.query(
        /* eslint-disable-next-line max-len */
            'SELECT * FROM full_attributions_flagged', [], (dbErr2, dbRes2) => {
              if (dbErr2) {
                return next(dbErr2);
              }
              res.render('user-panel', {
                Pending: dbRes1.rows,
                pendingCount: dbRes1.rowCount,
                Flagged: dbRes2.rows,
                flaggedCount: dbRes2.rowCount,
              });
            });
      });
});
module.exports = router;

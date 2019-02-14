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
      /* eslint-disable-next-line max-len */
      'SELECT nomenclature, title, published_year, author_name FROM full_attributions_pending', [],
      (dbErr, dbRes) => {
        if (dbErr) {
          return next(dbErr);
        }
        console.log(dbRes);
        res.render('user-panel', {
          Entries: dbRes.rows,
          Approval: dbRes.rowCount,
        });
      });
});
module.exports = router;

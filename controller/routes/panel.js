const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const db = require('../db');
const createError = require('http-errors');
const {isAdmin, isLoggedIn} = require('../middleware/auth');

router.get('/', isLoggedIn, function(req, res, next) {
  if (req.user.role === 'admin') {
    res.redirect('/panel/admin');
  } else {
    res.redirect('/panel/user');
  }
});


router.get('/admin', isAdmin, async (req, res, next) => {
  let resObj = [];
  try {
    const Pending = db.aQuery('SELECT * FROM full_attributions_pending', []);
    const Flagged = db.aQuery('SELECT * FROM full_attributions_flagged', []);
    // eslint-disable-next-line max-len
    const Users = db.aQuery('SELECT t1.user_id, t1.username, t1.role_of FROM users as t1', []);
    const Database = db.aQuery('SELECT * FROM all_papers_with_authors', []);
    resObj = await Promise.all([Pending, Flagged, Users, Database]);
  } catch (err) {
    next(createError(500));
  } finally {
    res.render('admin-panel', {
      Pending: resObj[0].rows,
      pendingCount: resObj[0].rowCount,
      Flagged: resObj[1].rows,
      flaggedCount: resObj[1].rowCount,
      Users: resObj[2].rows,
      userCount: resObj[2].rowCount,
      Database: resObj[3].rows,
      databaseCount: resObj[3].rowCount,
    });
  }

  
router.get('/admin', isAdmin, function(req, res, next) {
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
              /* eslint-disable-next-line max-len */
              db.query('SELECT t1.user_id, t1.username, t1.role_of FROM users as t1', [], (dbErr3, dbRes3) => {
                if (dbErr3) {
                  return next(dbErr3);
                }
                /* eslint-disable-next-line max-len */
                db.query('SELECT * FROM all_papers_with_authors', [], (dbErr4, dbRes4) => {
                  if (dbErr4) {
                    return next(dbErr4);
                  }
                  res.render('admin-panel', {
                    Pending: dbRes1.rows,
                    pendingCount: dbRes1.rowCount,
                    Flagged: dbRes2.rows,
                    flaggedCount: dbRes2.rowCount,
                    Users: dbRes3.rows,
                    userCount: dbRes3.rowCount,
                    Database: dbRes4.rows,
                    databaseCount: dbRes4.rowCount,
                  });
                });
              });
            });
      });
});


router.get('/user', isLoggedIn, async (req, res, next) => {
  let resObj = [];
  try {
    const Pending = db.aQuery('SELECT * FROM full_attributions_pending', []);
    const Flagged = db.aQuery('SELECT * FROM full_attributions_flagged', []);
    resObj = await Promise.all([Pending, Flagged]);
  } catch (err) {
    next(createError(500));
  } finally {
    res.render('user-panel', {
      Pending: resObj[0].rows,
      pendingCount: resObj[0].rowCount,
      Flagged: resObj[1].rows,
      flaggedCount: resObj[1].rowCount,
    });
  }
});

module.exports = router;

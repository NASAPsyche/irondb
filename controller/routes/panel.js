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
    const Pending = db.aQuery('SELECT * FROM pending_entries_panel', []);
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
});

router.get('/user', isLoggedIn, async (req, res, next) => {
  let resObj = [];
  try {
    const Pending = db.aQuery('SELECT * FROM pending_entries_panel', []);
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

router.get('/analysis-technique', isAdmin, async (req, res, next) => {
  let resObj = [];
  try {
    const Techniques = db.aQuery('SELECT * FROM analysis_techniques', []);
    resObj = await Promise.all([Techniques]);
    console.log(resObj[0]);
  } catch (err) {
    next(createError(500));
  } finally {
    res.render('analysis-technique', {
      Technique: resObj[0].rows,
    });
  }
});

router.post('/analysis-technique', isAdmin, async (req, res, next) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const insertQuery =
      `INSERT INTO analysis_techniques(abbreviation) VALUES($1)`;
    const insertValues = [req.body.technique];
    await client.query(insertQuery, insertValues);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    next(createError(500));
  } finally {
    client.release();
  }
  res.json({ok: true});
});


module.exports = router;


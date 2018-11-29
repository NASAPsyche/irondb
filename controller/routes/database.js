const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const db = require('../db');
// eslint-disable-next-line no-unused-vars
const createError = require('http-errors');

/* GET database page. */
router.get('/', function(req, res, next) {
  db.query('SELECT * FROM complete_table WHERE status=$1',
      ['active'], (dbErr, dbRes) => {
        if (dbErr) {
          return next(dbErr);
        }
        res.render('database', {Entries: dbRes.rows});
      });
});

/* POST database page */
router.post('/', function(req, res, next) {
  if (req.xhr) {
    let queryString = 'SELECT * FROM complete_table WHERE status=$1 ';
    const argsArray = ['active'];
    let currentQueryIndex = 2;

    if (req.body.name !== '') {
      argsArray.push(req.body.name);
      queryString += ('AND meteorite_name ~* $' + currentQueryIndex + ' ');
      currentQueryIndex++;
    }

    if (req.body.title !== '') {
      argsArray.push(req.body.title);
      queryString += ('AND title ~* $' + currentQueryIndex + ' ');
      currentQueryIndex++;
    }

    if (req.body.author !== '') {
      argsArray.push(req.body.author);
      queryString += ('AND authors ~* $' + currentQueryIndex + ' ');
      currentQueryIndex++;
    }

    if (req.body.group !== 'Group') {
      argsArray.push(req.body.group);
      queryString += ('AND classification_group=$' + currentQueryIndex + ' ');
      currentQueryIndex++;
    }

    if (req.body.element !== 'Element' && req.body.range !== 'Range') {
      argsArray.push(req.body.element);

      switch (req.body.range) {
        case 'major':
          queryString += ('AND major_elements ~* $' + currentQueryIndex + ' ');
          break;
        case 'minor':
          queryString += ('AND minor_elements ~* $' + currentQueryIndex + ' ');
          break;
        case 'trace':
          queryString += ('AND trace_elements ~* $' + currentQueryIndex + ' ');
          break;
      }

      currentQueryIndex++;
    }


    db.query(queryString, argsArray, (dbErr, dbRes) => {
      if (dbErr) {
        return next(dbErr);
      }

      if (dbRes.rows.length === 0) {
        // eslint-disable-next-line max-len
        res.send('<h2 class=\'text-center\' id=\'results\'>No results found.</h2>');
      }

      res.render('components/database-xhr-response', {Entries: dbRes.rows});
    });
  } else {
    let queryString = 'SELECT * FROM complete_table WHERE status=$1 ';
    const argsArray = ['active'];
    let currentQueryIndex = 2;

    if (req.body.name !== '') {
      argsArray.push(req.body.name);
      queryString += ('AND meteorite_name ~* $' + currentQueryIndex + ' ');
      currentQueryIndex++;
    }

    if (req.body.title !== '') {
      argsArray.push(req.body.title);
      queryString += ('AND title ~* $' + currentQueryIndex + ' ');
      currentQueryIndex++;
    }

    if (req.body.author !== '') {
      argsArray.push(req.body.author);
      queryString += ('AND authors ~* $' + currentQueryIndex + ' ');
      currentQueryIndex++;
    }

    db.query(queryString, argsArray, (dbErr, dbRes) => {
      if (dbErr) {
        return next(dbErr);
      }

      if (dbRes.rows.length === 0) {
        // eslint-disable-next-line max-len
        res.send('<h2 class=\'text-center\' id=\'results\'>No results found.</h2>');
      }

      res.render('database', {Entries: dbRes.rows});
    });
  }
});


module.exports = router;

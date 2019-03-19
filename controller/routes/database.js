const createError = require('http-errors');
const db = require('../db');
const ejsUnitConversion = require('../utils/ejs-unit-conversion');
const fs = require('fs');
const {isLoggedIn} = require('../middleware/auth');
const json2csv = require('json2csv').parse;
const path = require('path');
const Router = require('express-promise-router');
const router = new Router();


const singleBodyRouter = require('./database/meteorite');
router.use('/meteorite', singleBodyRouter);

/* GET database page. */
router.get('/', async (req, res, next) => {
  let resObj = [];
  try {
    const Entries = db.aQuery('SELECT * FROM complete_table', []);
    const Groups = db.aQuery(
        'SELECT DISTINCT classification_group FROM complete_table',
        []
    );
    resObj = await Promise.all([Entries, Groups]);
  } catch (err) {
    next(createError(500));
  } finally {
    res.render('database', {
      isSignedIn: req.isAuthenticated(),
      Entries: resObj[0].rows,
      Groups: resObj[1].rows,
      _: ejsUnitConversion,
    });
  }
});


/* POST database page */
router.post('/', async (req, res, next) => {
  if (req.xhr) {
    // eslint-disable-next-line max-len
    let queryString = 'SELECT * FROM complete_table WHERE published_year >1900 ';
    const argsArray = [];
    let currentQueryIndex = 1;

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
      // eslint-disable-next-line max-len
      queryString += ('AND classification_group=$' + currentQueryIndex + ' ');
      currentQueryIndex++;
    }

    // ------------------------------------
    //      Optional Search Parameters
    // ------------------------------------
    if (req.body.hasOwnProperty('journal_name')
      && req.body.journal_name !== '') {
      argsArray.push(req.body.journal_name);
      queryString += ('AND journal_name ~* $' + currentQueryIndex + ' ');
      currentQueryIndex++;
    }

    if (req.body.hasOwnProperty('volume') && req.body.volume !== '') {
      argsArray.push(req.body.volume);
      queryString += ('AND volume = $' + currentQueryIndex + ' ');
      currentQueryIndex++;
    }

    if (req.body.hasOwnProperty('page_number') && req.body.page_number !== '') {
      argsArray.push(parseInt(req.body.page_number, 10));
      queryString += ('AND page_number = $' + currentQueryIndex + ' ');
      currentQueryIndex++;
    }

    if (req.body.hasOwnProperty('pub_year') && req.body.pub_year !== '') {
      argsArray.push(parseInt(req.body.pub_year, 10));

      queryString += 'AND published_year ';

      switch (req.body.pub_yr_sign) {
        case 'equal':
          queryString += '=';
          break;
        case 'less':
          queryString += '<';
          break;
        case 'greater':
          queryString += '>';
          break;
      }

      queryString += (' $' + currentQueryIndex + ' ');
      currentQueryIndex++;
    }

    let elementCounter = -1;
    if (req.body.hasOwnProperty('element0') && req.body.range0 !== 'Range') {
      elementCounter++;
    }
    if (req.body.hasOwnProperty('element1') && req.body.range1 !== 'Range') {
      elementCounter++;
    }
    if (req.body.hasOwnProperty('element2') && req.body.range2 !== 'Range') {
      elementCounter++;
    }

    if (elementCounter !== -1) {
      while (elementCounter > -1) {
        if (typeof req.body['element' + elementCounter] === 'string') {
          const elementArray = [req.body['element' + elementCounter]];
          argsArray.push(elementArray);
        } else {
          argsArray.push(req.body['element' + elementCounter]);
        }

        queryString += 'AND entry_id';
        if (req.body['element' + elementCounter + '_mod'] === 'NOT') {
          queryString += ' NOT';
        }
        queryString += ' IN (SELECT body_id FROM ';

        switch (req.body['range' + elementCounter]) {
          case 'major':
            queryString += 'major_element_symbol_arrays_by_body_id';
            break;
          case 'minor':
            queryString += 'minor_element_symbol_arrays_by_body_id';
            break;
          case 'trace':
            queryString += 'trace_element_symbol_arrays_by_body_id';
            break;
        }

        queryString += ' WHERE CAST(array_agg as text[])';

        queryString += ' @> $';
        queryString += currentQueryIndex + ') ';
        currentQueryIndex++;
        elementCounter--;
      }
    }

    let resObj = [];
    try {
      const Entries = db.aQuery(queryString, argsArray);
      resObj = await Promise.all([Entries]);
    } catch (err) {
      next(createError(500));
    } finally {
      if (resObj[0].rows.length === 0) {
        // eslint-disable-next-line max-len
        res.send('<h2 class=\'text-center\' id=\'results\'>No results found.</h2>');
      } else {
        res.render('components/database-xhr-response', {
          Entries: resObj[0].rows,
          _: ejsUnitConversion,
        });
      }
    }
  } else {
    let queryString = 'SELECT * FROM complete_table WHERE published_year >1900';
    const argsArray = [];
    let currentQueryIndex = 1;

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

    let resObj = [];
    try {
      const Entries = db.aQuery(queryString, argsArray);
      const Groups = db.aQuery(
          'SELECT DISTINCT classification_group FROM complete_table',
          []
      );
      resObj = await Promise.all([Entries, Groups]);
    } catch (err) {
      next(createError(500));
    } finally {
      res.render('database', {
        isSignedIn: req.isAuthenticated(),
        Entries: resObj[0].rows,
        Groups: resObj[1].rows,
        _: ejsUnitConversion,
      });
    }
  }
});


/* GET /database/export */
router.get('/export', function(req, res, next) {
  // check if signed in
  let isSignedIn = false;
  if (req.isAuthenticated()) {
    isSignedIn = true;
  }
  db.query(
      'SELECT * FROM export_table',
      [],
      (dbErr, dbRes) => {
        if (dbErr) {
          return next(dbErr);
        }

        // element symbols with categories
        // Refactor to db queries
        const major = [];
        const minor = [];
        const trace = [];
        for (const row in dbRes.rows) {
          if (dbRes.rows[row].measurement > 10000000) {
            if (!major.includes(dbRes.rows[row].element_symbol)) {
              major.push(dbRes.rows[row].element_symbol);
            }
          } else if (dbRes.rows[row].measurement <= 10000000
          && dbRes.rows[row].measurement >= 1000000) {
            if (!minor.includes(dbRes.rows[row].element_symbol)) {
              minor.push(dbRes.rows[row].element_symbol);
            }
          } else if (dbRes.rows[row].measurement < 1000000) {
            if (!trace.includes(dbRes.rows[row].element_symbol)) {
              trace.push(dbRes.rows[row].element_symbol);
            }
          }
        }

        res.render('db-export', {
          Entries: dbRes.rows,
          major: major, minor: minor,
          trace: trace, isSignedIn: isSignedIn,
        });
      });
});


/* POST /database/export */
router.post('/export', function(req, res, next) {
  // check if signed in for navbar
  let isSignedIn = false;
  if (req.isAuthenticated()) {
    isSignedIn = true;
  }

  if (req.body.hasOwnProperty('export')) {
    // get arrays from request
    const tableData = JSON.parse(req.body.tableData);
    const fields = tableData.fields;
    const data = tableData.data;

    const opts = {fields};
    const date = new Date();
    const dateStr = date.toUTCString().replace(/ /g, '_');
    const filename = 'Database_export_' + dateStr + '.csv';

    // eslint-disable-next-line max-len
    const filePath = path.join(
        __dirname, ('../../public/temp/' + filename));

    try {
      // create and write csv using json2csv
      const csv = json2csv(data, opts);
      fs.writeFile(filePath, csv, function(err) {
        if (err) throw err;

        const options = {root: path.join(__dirname, '../../public/temp/')};
        res.sendFile(filename, options, function(err) {
          if (err) throw err;

          // remove sent file
          fs.unlink(filePath, function(err) {
            if (err) throw err;
          });
        });
      });
    } catch (err) {
      next(createError(500));
    }
  } else {
    // build query
    let queryString = '';
    if (!req.body.hasOwnProperty('export')) {
      // if not export select corresponding rows from export table
      queryString += 'SELECT * FROM export_table WHERE published_year > 1900 ';
    }

    const argsArray = [];
    let currentQueryIndex = 1;

    if (!req.body.hasOwnProperty('entries')) {
      // If request does not have ids for search
      next(createError(400));
    }

    if (req.body.entries.length >= 2) {
      req.body.entries.forEach(function(element) {
        argsArray.push(element);
        if (currentQueryIndex === 1) {
          // Set AND for first element added to query
          queryString += ('AND body_id=$' + currentQueryIndex + ' ');
        } else {
          queryString += ('OR body_id=$' + currentQueryIndex + ' ');
        }
        currentQueryIndex++;
      });
    } else if (req.body.entries.length === 1) {
      argsArray.push(req.body.entries[0]);
      queryString += ('AND body_id=$' + currentQueryIndex + ' ');
    }

    db.query(queryString, argsArray, (dbErr, dbRes) => {
      if (dbErr) {
        return next(dbErr);
      }

      // element symbols with categories
      // Refactor to db queries
      const major = [];
      const minor = [];
      const trace = [];
      for (const row in dbRes.rows) {
        if (dbRes.rows[row].measurement > 10000000) {
          if (!major.includes(dbRes.rows[row].element_symbol)) {
            major.push(dbRes.rows[row].element_symbol);
          }
        } else if (dbRes.rows[row].measurement <= 10000000
          && dbRes.rows[row].measurement >= 1000000) {
          if (!minor.includes(dbRes.rows[row].element_symbol)) {
            minor.push(dbRes.rows[row].element_symbol);
          }
        } else if (dbRes.rows[row].measurement < 1000000) {
          if (!trace.includes(dbRes.rows[row].element_symbol)) {
            trace.push(dbRes.rows[row].element_symbol);
          }
        }
      }

      res.render('db-export', {
        Entries: dbRes.rows,
        major: major, minor: minor,
        trace: trace, isSignedIn: isSignedIn,
      });
    });
  }
});


/* GET /database/reported */
router.get('/reported', isLoggedIn, function(req, res, next) {
  db.query(
      'SELECT * FROM flagged_entries_panel', [],
      (dbErr1, dbRes1) => {
        if (dbErr1) {
          return next(dbErr1);
        }
        db.query(
        /* eslint-disable-next-line max-len */
            'SELECT * FROM inactive_entries_panel', [], (dbErr2, dbRes2) => {
              if (dbErr2) {
                return next(dbErr2);
              }
              res.render('db-reported', {
                Reported: dbRes1.rows,
                Inactive: dbRes2.rows,
              });
            });
      });
});


/* GET /database/unapproved */
router.get('/unapproved', isLoggedIn, function(req, res, next) {
  db.query(
      'SELECT * FROM pending_entries_panel', [], (dbErr, dbRes) => {
        if (dbErr) {
          return next(dbErr);
        }
        console.log(dbRes);
        res.render('db-unapproved', {
          Entries: dbRes.rows,
        });
      });
});

module.exports = router;



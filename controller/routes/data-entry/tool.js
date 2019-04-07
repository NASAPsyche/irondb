const Router = require('express-promise-router');
const router = new Router();
const db = require('../../db');
const {PythonShell} = require('python-shell');
const path = require('path');
const sPath = path.join(__dirname, ('../../py/'));
// eslint-disable-next-line new-cap
const {isLoggedIn} = require('../../middleware/auth');
const createError = require('http-errors');

router.post('/', isLoggedIn, function(req, res, next) {
  // Root of tool router i.e. 'localhost:3001/data-entry/tool'
  // Probably where you'd want the get for basic data used elsewhere
  // AJAX call from submit on tool flow checklist

  // set tables flag if tables selected from checklist
  let hasTables = false;
  if (req.body.hasOwnProperty('tables') && req.body.tables === 'on') {
    hasTables = true;
  }

  console.log(req.body);

  // Hardcoded params for US969 pr, need to modify script or request as needed
  // Can be addressed when further integrating.
  req.body.pageNum = 2;
  req.body.taskNum = 0;
  req.body.flipDir = 0;
  req.body.coordsLeft = 0;
  req.body.coordsTop = 0;
  req.body.coordsWidth = 0;
  req.body.coordsHeight = 0;

  const options = {
    mode: 'text',
    // pythonPath: '../py',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: sPath,
    args: [JSON.stringify(req.body)],
  };
  // const result = '';
  // console.log(JSON.stringify(req.body));
  PythonShell.run('pdf_text_import.py', options, async function(err, result) {
    if (err) throw err;
    req.session.textHolder = result;
    let resObj = [];
    try {
      // Database queries for information to populate drop downs
      const Elements = db.aQuery('SELECT symbol FROM element_symbols', []);
      const Technique = db.aQuery(
          'SELECT abbreviation FROM analysis_techniques', []);
      resObj = await Promise.all([Elements, Technique]);
    } catch (err) {
      next(createError(500));
    } finally {
      res.render('components/tool_panel', {
        Elements: resObj[0].rows,
        Technique: resObj[1].rows,
        hasTables: hasTables,
      });
    }
  });
  console.log(req.session.textHolder);
});

router.get('/allPagesTables', isLoggedIn, function(req, res, next) {
  // route to request all tables from all pages
  const options = {
    mode: 'text',
    // pythonPath: '../py',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: sPath,
    args: [JSON.stringify(req.body)],
  };
  // const result = '';
  // console.log(JSON.stringify(req.body));
  PythonShell.run('table_driver.py', options, function(err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    // Debugging test for pr only, delete immediately in new branch
    // req.session.tableJSON = JSON.parse(results[0].slice(2, -2));

    res.send(results);
    // res.render('components/table-xhr-response', {
    //   Results: JSON.parse(results[0].slice(2, -2)),
    // });
  });
});

router.post('/attributes', isLoggedIn, function(req, res, next) {
  // route to request all non-table attributes from all pages.
  const options = {
    mode: 'text',
    // pythonPath: '../py',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: sPath,
    args: [JSON.stringify(req.body)],
  };
    // const result = '';
    // console.log(JSON.stringify(req.body));
  PythonShell.run('nlp4attributes.py', options, function(err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    // Debugging test for pr only, delete immediately in new branch
    // req.session.tableJSON = JSON.parse(results[0].slice(2, -2));

    res.send(results);
    // res.render('components/table-xhr-response', {
    //   Results: JSON.parse(results[0].slice(2, -2)),
    // });
  });
});

router.post('/onePageTables', isLoggedIn, function(req, res, next) {
  // route to request tables on given page
  const options = {
    mode: 'text',
    // pythonPath: '../py',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: sPath,
    args: [JSON.stringify(req.body)],
  };
  // const result = '';
  // console.log(JSON.stringify(req.body));


  PythonShell.run('table_driver_single.py',
      options, async function(err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        // console.log('results: %j', results);

        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, ' +
          'X-Requested-With, Content-Type, Accept');

        // Debugging test for pr only, delete immediately in new branch
        // req.session.tableJSON = JSON.parse(results[0].slice(2, -2));

        let resObj = [];
        try {
          const Technique = db.aQuery(
              'SELECT abbreviation FROM analysis_techniques', []);
          resObj = await Promise.all([Technique]);
        } catch (err) {
          next(createError(500));
        } finally {
          res.render('components/table-xhr-response', {
            Results: JSON.parse(results[0].slice(2, -2)),
            Technique: resObj[0].rows,
          });
        }
      });
});

router.post('/validate', isLoggedIn, function(req, res, next) {
  if (req.xhr) {
    // Debugging test for pr only, delete immediately in new branch
    console.log('-----------Body---------------------------');
    console.log(req.body);


    // success
    res.json({
      'status': 'success',
    });
    // failure
    // res.json({
    //   'status': 'invalid',
    // col, row
    //   'malformed': ['2,3','4,5'], format tbd?
    // });
  } else {
    // Bad request
    next(createError(400));
  }
});

router.post('/insert', isLoggedIn, function(req, res, next) {
  // Debugging test for pr only, delete immediately in new branch
  // console.log('-----------Req  Body---------------------');
  // console.log(req.body);


  res.send('<h1>form submitted</h1>');
});


module.exports = router;

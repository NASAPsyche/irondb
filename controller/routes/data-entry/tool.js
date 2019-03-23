const Router = require('express-promise-router');
const router = new Router();
const db = require('../../db');
const {PythonShell} = require('python-shell');
const path = require('path');
const sPath = path.join(__dirname, ('../../py/'));
// eslint-disable-next-line new-cap
const {isLoggedIn} = require('../../middleware/auth');
const createError = require('http-errors');

router.post('/', isLoggedIn, async function(req, res, next) {
  // Root of tool router i.e. 'localhost:3001/data-entry/tool'
  // Probably where you'd want the get for basic data used elsewhere
  // AJAX call from submit on tool flow checklist

  console.log(req.body);
  let resObj = [];
  try {
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
    });
  }
});

router.get('/tables', isLoggedIn, function(req, res, next) {
  // route to request all tables
  res.send('all pages requested');
});

router.post('/tables', isLoggedIn, function(req, res, next) {
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
  PythonShell.run('table_driver_single.py', options, function(err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    // console.log('results: %j', results);

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, ' +
      'X-Requested-With, Content-Type, Accept');

    // Debugging test for pr only, delete immediately in new branch
    req.session.tableJSON = JSON.parse(results[0].slice(2, -2));

    res.render('components/table-xhr-response', {
      Results: JSON.parse(results[0].slice(2, -2)),
    });
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
  console.log('-----------Req  Body---------------------');
  console.log(req.body);
  console.log('-----------Req---------------------------');
  console.log(JSON.parse(req.body.tableData)[0]);
  console.log('-----------Session-----------------------');
  console.log(req.session.tableJSON);
  if (JSON.stringify(JSON.parse(req.body.tableData)[0])
  === JSON.stringify(req.session.tableJSON)) {
    console.log('JSONS MATCH');
  }

  res.send('<h1>form submitted</h1>');
});


module.exports = router;

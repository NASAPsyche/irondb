const express = require('express');
const {PythonShell} = require('python-shell');
const path = require('path');
const sPath = path.join(__dirname, ('../../py/'));
// eslint-disable-next-line new-cap
const router = express.Router();
const {isLoggedIn} = require('../../middleware/auth');
const createError = require('http-errors');

router.post('/', isLoggedIn, function(req, res, next) {
  // Root of tool router i.e. 'localhost:3001/data-entry/tool'
  // Probably where you'd want the get for basic data used elsewhere
  // AJAX call from submit on tool flow checklist

  const options = {
    mode: 'text',
    // pythonPath: '../py',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: sPath,
    args: [JSON.stringify(req.body)],
  };
  // const result = '';
  // console.log(JSON.stringify(req.body));
  PythonShell.run('pdf_text_import.py', options, function(err, result) {
    if (err) throw err;
    req.session.textHolder = result;
    res.render('components/tool_panel');
  });
  console.log(req.session.textHolder);
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
    console.log('-----------req---------------------------');
    console.log(JSON.parse(req.body.tableData));
    console.log('---------Session---------------------------');
    console.log(req.session.tableJSON);
    if (req.body.tableData === JSON.stringify(req.session.tableJSON)) {
      console.log('JSONS MATCH');
    }

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

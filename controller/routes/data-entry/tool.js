const express = require('express');
const {PythonShell} = require('python-shell');
const path = require('path');
const sPath = path.join(__dirname, ('../../py/'));
// eslint-disable-next-line new-cap
const router = express.Router();
const {isLoggedIn} = require('../../middleware/auth');

router.post('/', isLoggedIn, function(req, res, next) {
  // Root of tool router i.e. 'localhost:3001/data-entry/tool'
  // Probably where you'd want the get for basic data used elsewhere
  res.send('basic data requested');
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
  let result = '';
  console.log(JSON.stringify(req.body));
  PythonShell.run('table_driver_single.py', options, function(err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    console.log('results: %j', results);

    result = results;
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, ' +
      'X-Requested-With, Content-Type, Accept');
    console.log(result);
    res.send(result[0]);
  });
  // res.send(req.body);
});

module.exports = router;

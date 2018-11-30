const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const {PythonShell} = require('python-shell');
let result = '';


app.get('/', function(req, res) {
  const options = {
    mode: 'text',
    // pythonPath: 'path/to/python',
    pythonOptions: ['-u'], // get print results in real-time
    // scriptPath: 'path/to/my/scripts',
    args: ['pdfs/WassonandChoe_GCA_2009.pdf', 'value2', 'value3'],

  };

  PythonShell.run('driver.py', options, function(err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    console.log('results: %j', results);

    result = results[results.length - 1];
    res.send(result);
  });
});

const server = app.listen(8081, function() {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;

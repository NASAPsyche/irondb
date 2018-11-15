var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
let {PythonShell} = require('python-shell')
var result = ""




app.get('/', function (req, res) {

    let options = {
        mode: 'text',
        // pythonPath: 'path/to/python',
        pythonOptions: ['-u'], // get print results in real-time
        // scriptPath: 'path/to/my/scripts',
        args: ['pdfs/WassonandChoe_GCA_2009.pdf', 'value2', 'value3']

    };

    PythonShell.run('test.py', options, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);

        result = results[0];
        res.send(result);
    });


})

let server = app.listen(8081, function () {
    let host = server.address().address
    let port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})





app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;

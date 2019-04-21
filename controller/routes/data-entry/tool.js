const Router = require('express-promise-router');
const router = new Router();
const db = require('../../db');
const {PythonShell} = require('python-shell');
const path = require('path');
const parser = require('../../db/entry-parser');
const sPath = path.join(__dirname, ('../../../external/pdfScraper'));
const hPath = path.join(__dirname, ('../../py'));
// eslint-disable-next-line new-cap
const {isLoggedIn} = require('../../middleware/auth');
const createError = require('http-errors');
const sigfig = require('../../utils/sigfig');
const unitConvert = require('../../utils/unit-conversion');
const updater = require('../../db/update-entry');

router.post('/', isLoggedIn, async function(req, res, next) {
  // Root of tool router i.e. 'localhost:3001/data-entry/tool'
  // Probably where you'd want the get for basic data used elsewhere
  // AJAX call from submit on tool flow checklist

  console.log(req.body);

  // set checklist flags for building template
  let hasTables = false;
  if ((req.body.hasOwnProperty('allTables')
      && req.body.allTables === 'on')
      || (req.body.hasOwnProperty('singleTable')
      && req.body.singleTable === 'on')
  ) {
    hasTables = true;
  }

  let hasAttributes = false;
  if ((req.body.hasOwnProperty('attributes') && req.body.attributes === 'on')) {
    hasAttributes = true;
  }

  let hasFileName = false;
  if ((req.body.hasOwnProperty('fileName')
       && req.body.fileName !== ''
       && req.body.fileName.slice(-4) === '.pdf')
  ) {
    hasFileName = true;
  }

  // Use manual form action (data-entry/insert) if no tables
  // Default to manual
  let isManual = true;
  if ( hasFileName === true && hasTables === true ) {
    isManual = false;
  }

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
      hasAttributes: hasAttributes,
      hasFileName: hasFileName,
      filename: req.body.fileName,
      isManual: isManual,
    });
  }
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
    if (err) {
      // If error return empty attributes
      console.log(err);
      res.render('components/attributes-xhr-error-response');
    } else {
      // results is an array consisting of messages collected during execution
      console.log(results);

      try {
        res.render(
            'components/attributes-xhr-response',
            {Results: JSON.parse(results[0])}
        );
      } catch (err) {
        console.log(err);
        res.render('components/attributes-xhr-error-response');
      }
    }
  });
});

router.post('/allPagesTables', isLoggedIn, async function(req, res, next) {
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
  PythonShell.run('table_driver.py', options, async function(err, results) {
    if (err) {
      // Send error alert
      console.log(err);
      res.render('components/table-xhr-error-response');
    } else {
      // results is an array consisting of messages collected during execution
      let resObj = [];
      try {
        const Technique = db.aQuery(
            'SELECT abbreviation FROM analysis_techniques', []);
        resObj = await Promise.all([Technique]);
      } catch (err) {
        next(createError(500));
      } finally {
        console.log(results);
        console.log('------------');
        try {
          res.render('components/table-xhr-response', {
            Results: results,
            Technique: resObj[0].rows,
            Alert: 'auto',
          });
        } catch (err) {
          console.log(err);
          res.render('components/table-xhr-error-response');
        }
      }
    }
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
  console.log(JSON.stringify(req.body));


  PythonShell.run('table_driver_single.py', options,
      async function(err, results) {
        if (err) {
          // Send error alert
          console.log(err);
          res.render('components/table-xhr-error-response');
        } else {
          // results is an array of messages collected during execution
          console.log('results: %j', results);

          res.header('Access-Control-Allow-Origin', '*');
          res.header('Access-Control-Allow-Headers', 'Origin, ' +
            'X-Requested-With, Content-Type, Accept');

          let resObj = [];
          try {
            const Technique = db.aQuery(
                'SELECT abbreviation FROM analysis_techniques', []);
            resObj = await Promise.all([Technique]);
          } catch (err) {
            next(createError(500));
          } finally {
            console.log(results);
            console.log('------------');
            try {
              res.render('components/table-xhr-response', {
                Results: results,
                Technique: resObj[0].rows,
                Alert: 'single',
              });
            } catch (err) {
              console.log(err);
              res.render('components/table-xhr-error-response');
            }
          }
        }
      });
});

router.post('/validate', isLoggedIn, function(req, res, next) {
  if (req.xhr) {
    // Debugging test for pr only, delete immediately in new branch
    console.log('-----------Body---------------------------');
    console.log(req.body);

    const options = {
      mode: 'text',
      // pythonPath: '../py',
      pythonOptions: ['-u'], // get print results in real-time
      scriptPath: hPath,
      args: [JSON.stringify(req.body)],
    };
      // const result = '';
      // console.log(JSON.stringify(req.body));
    PythonShell.run('validations.py', options, function(err, results) {
      if (err) {
        // If error return empty attributes
        console.log(err);
        res.send(results);
      } else {
        // results is an array consisting of messages collected during execution
        res.send(results);
      }
    });

    // success

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

router.post('/insert', isLoggedIn, async function(req, res, next) {
  console.log(req.body);

  const reqBody = req.body;

  // build basic object
  const basicObj = {};
  basicObj.paperTitle = reqBody.paperTitle;
  basicObj.doi = reqBody.doi;
  basicObj.journalName = reqBody.journalName;
  basicObj.pubYear = reqBody.pubYear;
  basicObj.volume = reqBody.volume;
  basicObj.issue = reqBody.issue;
  basicObj.series = reqBody.series;

  // initialize actions
  const actions = [];

  // add authors to actions
  const keys = parser.getKeys(reqBody);
  const authors = parser.getAuthors(reqBody, keys);
  authors.map((author) => {
    author.type = 'author';
    author.command = 'insert';
    actions.push(author);
  });

  // add notes to actions
  const notes = parser.getNotes(reqBody, keys);
  notes.forEach( (note) => {
    const temp = {};
    temp.type = 'note';
    temp.command = 'insert';
    temp.note = note;
    actions.push(temp);
  });


  console.log(authors);
  console.log(notes);

  // Normalize tables
  const tables = JSON.parse(reqBody.tableData);
  tables.map((table) => {
    const page = parseInt(table.page_number);
    // let group = table.group;
    const meteorites = [];
    table.cells.forEach((cell) => {
      if (!meteorites.includes(cell.meteorite_name)) {
        meteorites.push(cell.meteorite_name);
      }
    });
    const bodies = [];
    meteorites.map((name) => {
      const temp = {};
      temp.bodyName = name;
      bodies.push(temp);
    });

    bodies.map((body) => {
      body.type = 'body';
      body.command = 'insert';
      body.group = '';
    });

    console.log('----------measurements--------');

    bodies.forEach((body) => {
      body.measurements = [];
      table.cells.map((cell) => {
        if (cell.meteorite_name === body.bodyName
            && cell.measurement !== 'empty') {
          const temp = {};
          temp.element = cell.element.toLowerCase();
          temp.lessThan = cell.less_than.toString();
          // Non-converted to enum, this could cause crash
          temp.units = cell.units;
          temp.technique = cell.analysis_technique;
          temp.page = page;
          temp.sigfig = sigfig.getSigFig(cell.measurement);
          temp.convertedDeviation = 0.0;

          // check on units to enums
          if (cell.units.includes('%') || cell.units.includes('percent')) {
            temp.units = 'wt_percent';
          }
          if (cell.units.includes('ppm')) {
            temp.units = 'ppm';
          }
          if (cell.units.includes('ppb')) {
            temp.units = 'ppb';
          }
          if (cell.units.includes('mg')) {
            temp.units = 'mg_g';
          }
          if (cell.units.includes('ug') || cell.units.includes('lg') ) {
            temp.units = 'ug_g';
          }
          if (cell.units.includes('ng')) {
            temp.units = 'ng_g';
          }

          const measurement = parseInt(cell.measurement);
          temp.convertedMeasurement = parseInt(cell.measurement);
          // Convert the measurement and deviation to PPB
          switch (cell.units.replace('/', '_')) {
            case 'wt_percent':
              temp.units = 'wt_percent';
              temp.convertedMeasurement = unitConvert.percentToPPB(measurement);
              break;
            case 'ppm':
              temp.units = 'ppm';
              temp.convertedMeasurement = unitConvert.ppmToPPB(measurement);
              break;
            case 'ppb':
              temp.units = 'ppb';
              temp.convertedMeasurement = measurement;
              break;
            case 'mg_g':
              temp.units = 'mg_g';
              temp.convertedMeasurement = unitConvert.milligramsPerGramToPPB(
                  measurement);
              break;
            case 'ug_g':
              temp.units = 'ug_g';
              temp.convertedMeasurement = unitConvert.microgramsPerGramToPPB(
                  measurement);
              break;
            case 'ng_g':
              temp.units = 'ng_g';
              temp.convertedMeasurement = unitConvert.nanogramPerGramToPPB(
                  measurement);
              break;
          }

          if (updater.validateElement(temp)
              && !isNaN(temp.convertedMeasurement)) {
            console.log(temp);
            body.measurements.push(temp);
          }
        }
      });
    });

    // add bodies to actions
    bodies.map((body) => {
      if (updater.validateBody(body)) {
        actions.push(body);
      }
    });
  });


  const obj = {};
  obj.submissionID = '';
  obj.command = 'insert';
  obj.basic = basicObj;
  obj.actions = actions;
  obj.pdfPath = 'null';
  if (req.session.hasOwnProperty('fileName')
      && req.session.fileName.length > 0) {
    obj.pdfPath = ('/temp/' + req.session.fileName);
  }

  const username = req.user.username;

  console.dir(obj);
  const resp = await updater.updateEntry(obj, username);
  console.log( 'resp ====', resp);
  if ( resp === true ) {
    res.render('data-entry', {Alert:
      `Data succesfully added to the database pending approval.`,
    AlertType: 'sucess',
    });
  } else {
    res.render('data-entry', {Alert:
      `Insert Failed.`,
    AlertType: 'error',
    });
  }
});


module.exports = router;

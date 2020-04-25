const createError = require('http-errors');
const db = require('../db');
const ejsUnitConversion = require('../utils/ejs-unit-conversion');
const fs = require('fs');
const {isLoggedIn, isAdmin} = require('../middleware/auth');
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
    resObj = await Promise.all([Entries]);
  } catch (err) {
    next(createError(500));
  } finally {
    res.send({
      Entries: resObj[0].rows,
    });
  }
});

/* GET /database/export */
router.get('/export', async (req, res, next) => {
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
  }
  // } else {
  //   if (!req.body.hasOwnProperty('entries')) {
  //     // If request does not have ids for search, bad request
  //     next(createError(400));
  //   }

  //   // Build constraints
  //   let constraints = ' WHERE ';
  //   const argsArray = [];
  //   let currentQueryIndex = 1;

  //   if (typeof req.body.entries == 'string') {
  //     // single body
  //     argsArray.push(parseInt(req.body.entries));
  //     constraints += ('body_id=$' + currentQueryIndex);
  //   } else {
  //     // multiple bodies
  //     req.body.entries.forEach(function(element) {
  //       argsArray.push(element);
  //       if (currentQueryIndex === 1) {
  //         // No OR for first body
  //         constraints += ('body_id=$' + currentQueryIndex + ' ');
  //       } else {
  //         constraints += ('OR body_id=$' + currentQueryIndex + ' ');
  //       }
  //       currentQueryIndex++;
  //     });
  //   }

  //   // Build query strings
  //   const entriesQuery = 'SELECT * FROM export_table' + constraints;
  //   const bodyQuery = 'SELECT DISTINCT body_id FROM export_table' + constraints;
  //   const majorQuery =
  //       'SELECT DISTINCT ON (element_symbol) element_symbol '
  //       + 'FROM export_major_element_symbols' + constraints;
  //   const minorQuery =
  //       'SELECT DISTINCT ON (element_symbol) element_symbol '
  //       + 'FROM export_minor_element_symbols' + constraints;
  //   const traceQuery =
  //       'SELECT DISTINCT ON (element_symbol) element_symbol '
  //       +'FROM export_trace_element_symbols' + constraints;


  //   let resObj = [];
  //   try {
  //     const Entries = db.aQuery(entriesQuery, argsArray);
  //     const BodyIDs = db.aQuery(bodyQuery, argsArray);
  //     const Major = db.aQuery(majorQuery, argsArray);
  //     const Minor = db.aQuery(minorQuery, argsArray);
  //     const Trace = db.aQuery(traceQuery, argsArray);
  //     resObj = await Promise.all([Entries, BodyIDs, Major, Minor, Trace]);
  //   } catch (err) {
  //     next(createError(500));
  //   } finally {
  //     const major = resObj[2].rows;
  //     const minor = resObj[3].rows;
  //     const trace = resObj[4].rows;

  //     const Entries = resObj[0].rows;
  //     const Entries2 = resObj[0].rows;

  //     // separate entries into rows by meteorite and analysis technique
  //     const Rows = [];
  //     let temp = [];
  //     let currentTechnique = '';
  //     let currentID = -1;
  //     for (let i = 0; i < Entries.length; i++) {
  //       if (i === 0) {
  //         currentTechnique = Entries[i].technique;
  //         currentID = Entries[i].body_id;
  //       }

  //       if (Entries[i].body_id === currentID
  //         && Entries[i].technique === currentTechnique) {
  //         temp.push(Entries[i]);
  //       } else {
  //         Rows.push(temp);
  //         temp = [];
  //         currentTechnique = Entries[i].technique;
  //         currentID = Entries[i].body_id;
  //         temp.push(Entries[i]);
  //       }

  //       if (i === Entries.length - 1) {
  //         Rows.push(temp);
  //       }
  //     }

  //     // separate entries into rows by meteorite and analysis technique
  //     const Rows2 = [];
  //     temp = [];
  //     currentTechnique = '';
  //     currentID = -1;
  //     for (let i = 0; i < Entries2.length; i++) {
  //       if (i === 0) {
  //         currentID = Entries2[i].body_id;
  //       }

  //       if (Entries2[i].body_id === currentID) {
  //         temp.push(Entries2[i]);
  //       } else {
  //         Rows2.push(temp);
  //         temp = [];
  //         currentID = Entries2[i].body_id;
  //         temp.push(Entries2[i]);
  //       }

  //       if (i === Entries2.length - 1) {
  //         Rows2.push(temp);
  //       }
  //     }


  //     res.render('db-export', {
  //       Rows: Rows,
  //       Rows2: Rows2,
  //       Body_IDs: resObj[1].rows,
  //       major: major.map((row) => row.element_symbol),
  //       minor: minor.map((row) => row.element_symbol),
  //       trace: trace.map((row) => row.element_symbol),
  //       numColumns: major.length + minor.length + trace.length,
  //       isSignedIn: req.isAuthenticated(),
  //       _: ejsUnitConversion,
  //     });
  //   }
  // }
});


// Unimplemented due to timeline limitation
/* GET /database/reported */
// router.get('/reported', isLoggedIn, function(req, res, next) {
//   db.query(
//       'SELECT * FROM flagged_entries_panel', [],
//       (dbErr1, dbRes1) => {
//         if (dbErr1) {
//           return next(dbErr1);
//         }
//         db.query(
//         /* eslint-disable-next-line max-len */
//             'SELECT * FROM inactive_entries_panel', [], (dbErr2, dbRes2) => {
//               if (dbErr2) {
//                 return next(dbErr2);
//               }
//               res.render('db-reported', {
//                 Reported: dbRes1.rows,
//                 Inactive: dbRes2.rows,
//               });
//             });
//       });
// });


/* GET /database/unapproved */
router.get('/unapproved', isLoggedIn, async function(req, res, next) {
  let resObj = [];
  try {
    const Entries = db.aQuery(
        'SELECT DISTINCT ON (paper_id) * FROM pending_entries_panel',
        []
    );
    resObj = await Promise.all([Entries]);
  } catch (err) {
    next(createError(500));
  } finally {
    res.render('db-unapproved', {
      Entries: resObj[0].rows,
    });
  }
});

/* GET /database/all */
router.get('/all', isAdmin, async (req, res, next) => {
  let resObj = [];
  try {
    const Entries = db.aQuery('SELECT * FROM all_papers_with_authors', []);
    resObj = await Promise.all([Entries]);
  } catch (err) {
    next(createError(500));
  } finally {
    res.render('all-entries', {Entries: resObj[0].rows});
  }
});

/* GET /database/own */
router.get('/own', isLoggedIn, async (req, res, next) => {
  let resObj = [];
  try {
    const Entries = db.aQuery(
        'SELECT * FROM all_papers_with_authors WHERE submitted_by = $1',
        [req.user.username]
    );
    resObj = await Promise.all([Entries]);
  } catch (err) {
    next(createError(500));
  } finally {
    res.render('own-entries', {Entries: resObj[0].rows});
  }
});

module.exports = router;



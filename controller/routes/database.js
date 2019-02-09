const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
// const createError = require('http-errors');
// const path = require('path');
// const fs = require('fs');
// const json2csv = require('json2csv').parse;
// const db = require('../db');
const {isLoggedIn} = require('../middleware/auth');


/* GET database page. */
router.get('/', function(req, res, next) {
  let isSignedIn = false;
  if (req.isAuthenticated()) {
    isSignedIn = true;
  }
  res.render('database', {Entries: [], isSignedIn: isSignedIn});
  // db.query('SELECT * FROM complete_table WHERE status=$1',
  //     ['active'], (dbErr, dbRes) => {
  //       if (dbErr) {
  //         return next(dbErr);
  //       }
  //       res.render('database', {Entries: dbRes.rows});
  //     });
});


// /* POST database page */
// router.post('/', function(req, res, next) {
//   if (req.xhr) {
//     let queryString = 'SELECT * FROM complete_table WHERE status=$1 ';
//     const argsArray = ['active'];
//     let currentQueryIndex = 2;

//     if (req.body.name !== '') {
//       argsArray.push(req.body.name);
//       queryString += ('AND meteorite_name ~* $' + currentQueryIndex + ' ');
//       currentQueryIndex++;
//     }

//     if (req.body.title !== '') {
//       argsArray.push(req.body.title);
//       queryString += ('AND title ~* $' + currentQueryIndex + ' ');
//       currentQueryIndex++;
//     }

//     if (req.body.author !== '') {
//       argsArray.push(req.body.author);
//       queryString += ('AND authors ~* $' + currentQueryIndex + ' ');
//       currentQueryIndex++;
//     }

//     if (req.body.group !== 'Group') {
//       argsArray.push(req.body.group);
// eslint-disable-next-line max-len
//       queryString += ('AND classification_group=$' + currentQueryIndex + ' ');
//       currentQueryIndex++;
//     }

//     if (req.body.element !== 'Element' && req.body.range !== 'Range') {
//       argsArray.push(req.body.element);

//       switch (req.body.range) {
//         case 'major':
// eslint-disable-next-line max-len
//           queryString += ('AND major_elements ~* $' + currentQueryIndex + ' ');
//           break;
//         case 'minor':
// eslint-disable-next-line max-len
//           queryString += ('AND minor_elements ~* $' + currentQueryIndex + ' ');
//           break;
//         case 'trace':
// eslint-disable-next-line max-len
//           queryString += ('AND trace_elements ~* $' + currentQueryIndex + ' ');
//           break;
//       }

//       currentQueryIndex++;
//     }


//     db.query(queryString, argsArray, (dbErr, dbRes) => {
//       if (dbErr) {
//         return next(dbErr);
//       }

//       if (dbRes.rows.length === 0) {
// eslint-disable-next-line max-len
//         res.send('<h2 class=\'text-center\' id=\'results\'>No results found.</h2>');
//       }

//       res.render('components/database-xhr-response', {Entries: dbRes.rows});
//     });
//   } else {
//     let queryString = 'SELECT * FROM complete_table WHERE status=$1 ';
//     const argsArray = ['active'];
//     let currentQueryIndex = 2;

//     if (req.body.name !== '') {
//       argsArray.push(req.body.name);
//       queryString += ('AND meteorite_name ~* $' + currentQueryIndex + ' ');
//       currentQueryIndex++;
//     }

//     if (req.body.title !== '') {
//       argsArray.push(req.body.title);
//       queryString += ('AND title ~* $' + currentQueryIndex + ' ');
//       currentQueryIndex++;
//     }

//     if (req.body.author !== '') {
//       argsArray.push(req.body.author);
//       queryString += ('AND authors ~* $' + currentQueryIndex + ' ');
//       currentQueryIndex++;
//     }

//     db.query(queryString, argsArray, (dbErr, dbRes) => {
//       if (dbErr) {
//         return next(dbErr);
//       }

//       if (dbRes.rows.length === 0) {
// eslint-disable-next-line max-len
//         res.send('<h2 class=\'text-center\' id=\'results\'>No results found.</h2>');
//       }

//       res.render('database', {Entries: dbRes.rows});
//     });
//   }
// });


// /* GET /database/export */
// router.get('/export', function(req, res, next) {
//   db.query(
//       'SELECT * FROM complete_table WHERE status=$1',
//       ['active'],
//       (dbErr, dbRes) => {
//         if (dbErr) {
//           return next(dbErr);
//         }
//         res.render('db-export', {Entries: dbRes.rows});
//       });
// });


// /* POST /database/export */
// router.post('/export', function(req, res, next) {
//   let queryString = '';
//   if (req.body.hasOwnProperty('export')) {
//     // Select only data rows
//     queryString += 'SELECT meteorite_name, classification_group, technique,';
//     queryString += ' major_elements, minor_elements, trace_elements, title,';
//     queryString += ' authors, page_number, journal_name, issue_number,';
//     queryString += ' published_year FROM complete_table WHERE status=$1 ';
//   } else {
//     queryString += 'SELECT * FROM complete_table WHERE status=$1 ';
//   }

//   const argsArray = ['active'];
//   let currentQueryIndex = 2;

//   if (!req.body.hasOwnProperty('entries')) {
//     next(createError(400));
//   }

//   if ( req.body.entries.length >= 2) {
//     req.body.entries.forEach(function(element) {
//       argsArray.push(element);
//       if (currentQueryIndex === 2) {
//         // Set AND for first element added to query
//         queryString += ('AND entry_id=$' + currentQueryIndex + ' ');
//       } else {
//         queryString += ('OR entry_id=$' + currentQueryIndex + ' ');
//       }
//       currentQueryIndex++;
//     });
//   } else if (req.body.entries.length === 1) {
//     argsArray.push(req.body.entries[0]);
//     queryString += ('AND entry_id=$' + currentQueryIndex + ' ');
//   }


//   db.query(queryString, argsArray, (dbErr, dbRes) => {
//     if (dbErr) {
//       return next(dbErr);
//     }

//     if (req.body.hasOwnProperty('export')) {
//       const fields = [];
//       fields.push('meteorite_name', 'classification_group', 'technique');
//       fields.push('major_elements', 'minor_elements', 'trace_elements');
//       fields.push('title', 'authors', 'page_number');
//       fields.push('journal_name', 'issue_number', 'published_year');

//       const opts = {fields};
//       const date = new Date();
//       const dateStr = date.toUTCString().replace(/ /g, '_');
//       const filename = 'Database_export_' + dateStr + '.csv';

// eslint-disable-next-line max-len
//       const filePath = path.join(__dirname, ('../../public/temp/' + filename));

//       try {
//         // create and write csv using json2csv
//         const csv = json2csv(dbRes.rows, opts);
//         fs.writeFile(filePath, csv, function(err) {
//           if (err) throw err;

//           const options = {root: path.join(__dirname, '../../public/temp/')};
//           res.sendFile(filename, options, function(err) {
//             if (err) throw err;

//             // remove sent file
//             fs.unlink(filePath, function(err) {
//               if (err) throw err;
//             });
//           });
//         });
//       } catch (err) {
//         next(createError(500));
//       }
//     } else {
//       res.render('db-export', {Entries: dbRes.rows});
//     }
//   });
// });


/* GET /database/export */
// router.get('/:id', function(req, res, next) {
// eslint-disable-next-line max-len
//   const queryString = 'SELECT * FROM complete_table WHERE status=$1 AND entry_id=$2';

//   const argsArray = ['active', req.params.id];

//   db.query(queryString, argsArray, (dbErr, dbRes) => {
//     if (dbErr) {
//       return next(dbErr);
//     }

//     res.render('single-entry', {Entries: dbRes.rows});
//   });
// });


/* GET /database/reported */
router.get('/reported', isLoggedIn, function(req, res, next) {
  // placeholder
  res.render('db-reported');
});


/* GET /database/unapproved */
router.get('/unapproved', isLoggedIn, function(req, res, next) {
  // placeholder
  res.render('db-unapproved');
});

module.exports = router;

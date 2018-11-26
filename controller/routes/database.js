const express = require('express');
const router = express.Router();
const db = require('../db');
const createError = require('http-errors');

/* GET database page. */
router.get('/', function(req, res, next) {
  db.query('SELECT * FROM complete_table WHERE status=$1', ['active'], (dbErr, dbRes) => {
    if (dbErr) {
      return next(dbErr);
    }
    res.render('database', { Entries: dbRes.rows });
  });
});

/* POST database page */
router.post('/', function(req, res, next) {
  if (req.xhr) {
	var queryString = "SELECT * FROM complete_table WHERE status=$1 ";
	var argsArray = ['active'];
	var currentQueryIndex = 2;

	if (req.body.name !== "") {
		argsArray.push(req.body.name);
		queryString += ("AND meteorite_name ~* $" + currentQueryIndex + " ");
		currentQueryIndex++;
	}

	if (req.body.title !== "") {
		argsArray.push(req.body.title);
		queryString += ("AND title ~* $" + currentQueryIndex + " ");
		currentQueryIndex++;
	}

	if (req.body.author !== "") {
		argsArray.push(req.body.author);
		queryString += ("AND authors ~* $" + currentQueryIndex + " ");
		currentQueryIndex++;
	}

	if (req.body.group !== "Group") {
		argsArray.push(req.body.group);
		queryString += ("AND classification_group=$" + currentQueryIndex + " ");
		currentQueryIndex++;
	}

	if (req.body.element !== "Element" && req.body.range !== "Range") {
		argsArray.push(req.body.element);
		
		switch (req.body.range) {
			case 'major':
				queryString += ("AND major_elements ~* $" + currentQueryIndex + " ");
				break;
			case 'minor':
				queryString += ("AND minor_elements ~* $" + currentQueryIndex + " ");
				break;
			case 'trace':
				queryString += ("AND trace_elements ~* $" + currentQueryIndex + " ");
				break;
		}

		currentQueryIndex++;
	}


	db.query(queryString, argsArray, (dbErr, dbRes) => {
	    if (dbErr) {
	      return next(dbErr);
	    }
	    res.render('components/database-xhr-response', { Entries: dbRes.rows });
	});
  } else {
  	// If not ajax request, method not allowed.
  	next(createError(405));
  }
});


module.exports = router;

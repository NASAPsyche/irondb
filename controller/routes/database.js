var express = require('express');
var router = express.Router();

const { Client } = require('pg');
const client = new Client({
	connectionString: 'postgres://group16:abc123@pgdb:5432/postgres'
});


// Connect to database, should use env variable set in docker-compose
client.connect();

var query_response = "";
client.query('SELECT * FROM Entries', (err, result) => {
	// Store response
	if (!err) {
		query_response = result;
	}

	// Log Error
	console.log(err ? err.stack : "");

	// Close connection with database
	client.end((err) => {
		if (err) {
			console.log('Error during disconnection.', err.stack);
		} else {
			console.log('Disconnected from DB.');
		}
	})
});

/* GET database page. */
router.get('/', function(req, res, next) {
  res.render('database', { id: query_response.rows[0].entry_id, name: query_response.rows[0].name });
});



module.exports = router;
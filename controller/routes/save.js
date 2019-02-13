const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {isLoggedIn} = require('../middleware/auth');
const db = require('../db');


router.post('/', isLoggedIn, function(req, res, next) {
  console.log('data: ', req.body.data);
  db.getClient((err, client, done) => {
    const insertQuery =
      'INSERT INTO entry_store(username, savedata, pdf_path) VALUES($1,$2,$3)';
    const shouldAbort = (err) => {
      if (err) {
        console.error('Error in transaction', err.stack);
        client.query('ROLLBACK', (err) => {
          if (err) {
            console.error('Error rolling back client', err.stack);
          }
          // release the client back to the pool
          done();
          next();
        });
      }
      return !!err;
    };

    client.query('BEGIN', (err) => {
      if (shouldAbort(err)) return;
      client.query(
          insertQuery,
          [req.body.username, req.body.data, req.body.pdf_path],
          (err, res) => {
            if (shouldAbort(err)) return;
            client.query('COMMIT', (err) => {
              if (err) {
                console.error('Error committing transaction', err.stack);
              }
              console.log('done, next');
              done();
              next();
            });
          });
    });
  });
});


module.exports = router;

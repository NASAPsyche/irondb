const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');
const passport = require('passport');
const createError = require('http-errors');

/* GET registration page. */
router.get('/', async (req, res, next) => {
  // check if signed in
  let isSignedIn = false;
  if (req.isAuthenticated()) {
    isSignedIn = true;
  }
  let resObj = [];
  try {
    const users = db.aQuery('SELECT username FROM users', []);
    resObj = await Promise.all([users]);
  } catch (err) {
    next(createError(500));
  } finally {
    console.log(resObj[0]);
    res.render('register', {isSignedIn: isSignedIn, Users: resObj[0].rows});
  }
});

router.post('/', function(req, res, next) {
  // Register user, storing hash instead of password.
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      db.getClient((err, client, done) => {
        // Transaction functionality modified from example at: https://node-postgres.com/features/transactions
        let insertQuery = 'INSERT INTO Users(username, password_hash, role_of)';
        insertQuery += ' VALUES($1,$2,$3) RETURNING user_id';
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
              [req.body.username, hash, 'data-entry'], (err, res) => {
                if (shouldAbort(err)) return;

                client.query('COMMIT', (err) => {
                  if (err) {
                    console.error('Error committing transaction', err.stack);
                  }
                  done();
                  next();
                });
              });
        });
      });
    });
  });
});

router.use(function(req, res, next) {
  // After database insert transaction complete, athenticate and redirect.
  passport.authenticate('local')(req, res, function() {
    res.redirect('/panel');
  });
});

module.exports = router;

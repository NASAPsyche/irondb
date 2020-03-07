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
    // eslint-disable-next-line max-len
    let Alert = '';
    if ( req.header('Referer') !== undefined &&
    req.header('Referer').slice(-9) === '/register') {
      Alert = 'Failed to regisester ';
    }

    res.send('register', {
      isSignedIn: isSignedIn,
      Users: resObj[0].rows,
      UserTotal: resObj[0].rowCount,
      Alert: Alert,
      AlertType: 'error',
    });
  }
});

router.post('/', function(req, res, next) {
  console.log(JSON.stringify(req.body));
  // Register user, storing hash instead of password.
  let success = false;
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      db.getClient((err, client, done) => {
        // Transaction functionality modified from example at: https://node-postgres.com/features/transactions
        let insertQuery = 'INSERT INTO Users(username, password_hash, role_of)';
        insertQuery += ' VALUES($1,$2,$3) RETURNING user_id';
        const shouldAbort = (err) => {
          if (err) {
            //console.error('Error in transaction', err.stack);
            client.query('ROLLBACK', (err) => {
              if (err) {
                //console.error('Error rolling back client', err.stack);
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
                   // console.error('Error committing transaction', err.stack);
                  }

                  done();
                  next();
                });
              });
        });
      });
    });
  });

  if (success) {
    res.send({
      isRegistered: true,
      message: 'User Registration Successful!'
    });

  } else {
    res.send({
      isRegistered: false,
      message: 'Error committing transaction'
    });
  }

});

router.post('/new-user', async (req, res, next) => {
  const client = await db.pool.connect();
  let hashed = '';

  // salt and hash password
  const saltRounds = 10;
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });
  hashed = hashedPassword;

  // eslint-disable-next-line max-len
  const insertUser = 'INSERT INTO users(user_id,username, password_hash, role_of) VALUES ($1,$2,$3,$4)';
  // eslint-disable-next-line max-len
  const insertUserValues = [req.body.user_id, req.body.username, hashed, 'user'];

  // eslint-disable-next-line max-len
  let insertUserInfo = 'INSERT INTO user_info(user_id,first_name, last_name,email_address)';
  insertUserInfo += 'VALUES($1,$2,$3,$4)';
  // eslint-disable-next-line max-len
  const insertUserInfoValues = [req.body.user_id, req.body.first_name, req.body.last_name, req.body.email];

  try {
    // first name transaction
    await client.query('BEGIN');
    await client.query(insertUser, insertUserValues);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    next(createError(500));
  } try {
    await client.query('BEGIN');
    await client.query(insertUserInfo, insertUserInfoValues);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    next(createError(500));
  } finally {
    client.release();
  }
  res.send({ok: true});
});




router.use(function(req, res, next) {
  // After database insert transaction complete, athenticate and redirect.
  passport.authenticate('local')(req, res, function() {
    //res.redirect('/');
  });
});

module.exports = router;

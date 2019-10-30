const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const db = require('../db');
// eslint-disable-next-line no-unused-vars
const {isLoggedIn, isAdmin} = require('../middleware/auth');

// NOT FOR PRODUCTION

/* GET example page. */
router.get('/', function(req, res, next) {
  console.log('DEBUG------');
  console.log(req.session);
  console.log(req.session.fileName);
  console.log('DEBUG END --------');

  if (req.xhr === true) {
    // If ajax request return information.
    db.query('SELECT username FROM Users', [], (dbErr, dbRes) => {
      if (dbErr) {
        return next(dbErr);
      }
      res.json({usernames: dbRes.rows});
    });
  } else {
    // If not ajax handel as regular get request.
    res.render('example', {title: 'Example Route'});
  }
});

router.get('/secret', isLoggedIn, function(req, res, next) {
  res.send('super secret information.');
});

router.get('/test', isLoggedIn, function(req, res, next) {
  res.render('test', {isSignedIn: req.isAuthenticated()});
});

module.exports = router;


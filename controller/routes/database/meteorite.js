const createError = require('http-errors');
const db = require('../../db');
const Router = require('express-promise-router');
const router = new Router();

/* GET single entry */
router.get('/:id', async (req, res, next) => {
  let isSignedIn = false;
  if (req.isAuthenticated()) isSignedIn = true;
  try {
    const queryString = 'SELECT * FROM complete_table WHERE entry_id=$1';
    const argsArray = [req.params.id];
    const {rows} = await db.aQuery(queryString, argsArray);
    res.render('single-entry', {Entries: rows, isSignedIn: isSignedIn});
  } catch (err) {
    next(createError(500));
  }
});

module.exports = router;

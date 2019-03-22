
// const {PythonShell} = require('python-shell');
// const path = require('path');
// const sPath = path.join(__dirname, ('../../py/'));

const Router = require('express-promise-router');
const router = new Router();
const {isLoggedIn} = require('../../middleware/auth');
// const createError = require('http-errors');
const pg = require('../../db');

router.get('/', isLoggedIn, async (req, res, next) => {
  const fetchJsonQuery = `
  SELECT * FROM entry_store 
  WHERE entry_store.username = ($1)
  `;
  const fetchJsonValue = [req.user.username];
  const {rows} = await pg.aQuery(fetchJsonQuery, fetchJsonValue);
  const fetchedData = JSON.stringify(rows[0]['savedata']);
  res.render('editor', {
    username: req.user.username,
    data: null,
    sessionID: req.sessionID,
    savedData: fetchedData,
  });
});

module.exports = router;

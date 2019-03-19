const Router = require('express-promise-router');
const router = new Router();
const createError = require('http-errors');
const db = require('../db');

/* GET landing page. */
router.get('/', async function(req, res, next) {
  let resObj = [];
  try {
    const Groups = db.aQuery(
        'SELECT DISTINCT classification_group FROM complete_table',
        []
    );
    resObj = await Promise.all([Groups]);
  } catch (err) {
    next(createError(500));
  } finally {
    res.render('index', {
      isSignedIn: req.isAuthenticated(),
      Groups: resObj[0].rows,
    });
  }
});


module.exports = router;


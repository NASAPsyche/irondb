// eslint-disable-next-line new-cap
const Router = require('express-promise-router');
const router = new Router();
const db = require('../db');
const createError = require('http-errors');
const {isAdmin} = require('../middleware/auth');

router.get('/', isAdmin, async (req, res, next) => {
  let resObj = [];
  try {
    const users = db.aQuery('SELECT * FROM users_with_info', []);
    resObj = await Promise.all([users]);
  } catch (err) {
    next(createError(500));
  } finally {
    res.render('user-management', {
      Users: resObj[0].rows,
      userCount: resObj[0].rowCount,
    });
  }
});


module.exports = router;

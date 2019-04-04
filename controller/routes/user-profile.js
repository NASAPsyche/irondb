const Router = require('express-promise-router');
// eslint-disable-next-line new-cap
const router = new Router();
const createError = require('http-errors');
const {isLoggedIn} = require('../middleware/auth');
const db = require('../db');


/* GET /profile  */
router.get('/', isLoggedIn, async (req, res, next) => {
  const userID = req.user.id;
  let resObj = [];
  try {
    // eslint-disable-next-line max-len
    const user = db.aQuery(`SELECT * FROM users_with_info WHERE user_id = ${userID}`, []);
    resObj = await Promise.all([user]);
  } catch (err) {
    next(createError(500));
  } finally {
    res.render('profile', {User: resObj[0].rows});
    console.log(`USER IS ${JSON.stringify(resObj[0].rows)}`);
  }
});

module.exports = router;


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
    console.log(`AFTER IS ${JSON.stringify(resObj[0].rows)}`);
  } catch (err) {
    next(createError(500));
  } finally {
    res.render('profile', {User: resObj[0].rows});
  }
});

router.post('/update', isLoggedIn, async (req, res, next) => {
  const client = await db.pool.connect();

  // queries
  // eslint-disable-next-line max-len
  const updateFirstName = `UPDATE user_info SET first_name = $1 WHERE  user_id = $2`;
  const insertFirstName = [req.body.first_name, req.body.user_id];
  // eslint-disable-next-line max-len
  const updateLastName = `UPDATE user_info SET last_name = $1 WHERE  user_id = $2`;
  const insertLastName = [req.body.last_name, req.body.user_id];
  // eslint-disable-next-line max-len
  const updateEmail = `UPDATE user_info SET email_address = $1 WHERE  user_id = $2`;
  const insertEmail = [req.body.email, req.body.user_id];

  try {
    await client.query('BEGIN');
    await client.query(updateFirstName, insertFirstName);
    await client.query('COMMIT');
    await client.query('BEGIN');
    await client.query(updateLastName, insertLastName);
    await client.query('COMMIT');
    await client.query('BEGIN');
    await client.query(updateEmail, insertEmail);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    next(createError(500));
  } finally {
    client.release();
  }
  res.json({ok: true});
});

module.exports = router;


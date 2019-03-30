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

router.post('/update', isAdmin, async (req, res, next) => {
  const client = await db.pool.connect();

  try {
    for (let i = 0; i < req.body.length; i++) {
      const updateQuery =
        `UPDATE users SET role_of = $1 WHERE user_id = $2`;
      const insertValues = [req.body[i].role, req.body[i].user];
      await client.query('BEGIN');
      await client.query(updateQuery, insertValues);
      await client.query('COMMIT');
    }
  } catch (e) {
    await client.query('ROLLBACK');
    next(createError(500));
  } finally {
    client.release();
  }
  res.json({ok: true});
});

module.exports = router;

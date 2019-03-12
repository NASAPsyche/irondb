const createError = require('http-errors');
const pg = require('../../db');
const Router = require('express-promise-router');
const router = new Router();

router.post('/', async (req, res, next) => {
  console.log('data: ', req.body.data);
  const client = await pg.pool.connect();
  const insertQuery =
    `INSERT INTO entry_store(username, savedata, pdf_path) VALUES($1,$2,$3)`;
  const insertValues = [req.body.username, req.body.data, req.body.pdf_path];
  try {
    await client.query('BEGIN');
    // eslint-disable-next-line
    const {rows} = await client.query(insertQuery, insertValues);
    await client.query('COMMIT');
    res.json({ok: true});
  } catch (e) {
    await client.query('ROLLBACK');
    next(createError(500));
  } finally {
    client.release();
  }
  // res.sendStatus(200);
});

module.exports = router;

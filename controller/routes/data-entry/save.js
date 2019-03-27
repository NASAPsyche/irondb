const createError = require('http-errors');
const pg = require('../../db');
const Router = require('express-promise-router');
const router = new Router();

router.post('/', async (req, res, next) => {
  // console.log('data: ', req.body.data);
  const client = await pg.pool.connect();
  const insertQuery =
    `INSERT INTO entry_store(username, savedata, pdf_path) VALUES($1,$2,$3)`;
  const insertValues = [req.body.username, req.body.data, req.body.pdf_path];
  const removePriorQuery = `
  DELETE FROM entry_store
  WHERE entry_store.username = ($1)
  `;
  const removePriorValue = [req.body.username];
  try {
    await client.query('BEGIN');
    await client.query(removePriorQuery, removePriorValue);
    await client.query(insertQuery, insertValues);
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

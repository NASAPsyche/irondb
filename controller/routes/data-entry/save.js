const createError = require('http-errors');
const pg = require('../../db');
const Router = require('express-promise-router');
const router = new Router();


router.post('/', async (req, res, next) => {
  // console.log('data: ', req.body.data);
  const username = req.sanitize(req.body.username);
  // const bodyData = req.sanitize(req.body.data); //can't sanitize a json
  const pdfPath = req.sanitize(req.body.pdf_path);
  const client = await pg.pool.connect();
  const insertQuery =
    `INSERT INTO entry_store(username, savedata, pdf_path) VALUES($1,$2,$3)`;
  const insertValues = [username, req.body.data, pdfPath];
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
    res.json({ok: true});
  } catch (e) {
    await client.query('ROLLBACK');
    next(createError(500));
  } finally {
    client.release();
  }
});

module.exports = router;

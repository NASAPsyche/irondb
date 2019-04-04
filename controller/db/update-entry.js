const pg = require('./index');
/**
 */
async function updateEntry() {
  const client = await pg.pool.connect();
  try {
    await client.query('BEGIN');
    // Example of how to insert current timestamp
    // const query = `INSERT INTO ts_test(ts) VALUES($1)`;
    // const values = ['now()'];
    // await client.query(query, values);
    await client.query('COMMIT');
  } catch (error) {
    //
    await client.query('ROLLBACK');
    console.log(error);
    return 1;
  } finally {
    client.release();
  }
  return 0;
}

module.exports = {updateEntry};

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


/**
 * @param  {object} obj
 * @return {Promise} boolean
 */
async function parseAction( obj ) {
  if ( obj.hasOwnProperty('type') && obj.hasOwnProperty('command') ) {
    const type = obj.type;
    // eslint-disable-next-line no-unused-vars
    const command = obj.command;
    switch (type) {
      case 'basic':
        //
        break;

      case 'author':
        //
        break;

      case 'body':
        //
        break;

      case 'element':
        //
        break;

      case 'note':
        //
        break;

      default:
        return false;
    }
  } else {
    return false;
  }
}


module.exports = {updateEntry, parseAction};

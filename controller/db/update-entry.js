const pg = require('./index');
/**
 * @return {Promise} boolean
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
    return false;
  } finally {
    client.release();
  }
  return true;
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
        if ( (await validateBasic(obj)) == false ) {
          return false;
        }
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
        if ( (await validateNote(obj)) == false ) {
          return false;
        }
        break;

      default:
        return false;
    }
  } else {
    return false;
  }
}

/**
 * @param  {object} obj
 * @return {Promise} boolean
 */
async function validateBasic( obj ) {
  // Example object
  // obj ={
  //   paperID: '2',
  //   paperTitle: 'title',
  //   doi: '',
  //   journalID: '3',
  //   journalName: 'name',
  //   pub_year: '1998',
  //   volume: '12',
  //   issue: '11',
  //   series: '3',
  // };
  if ( obj.command == 'update' ) { // valid command
    if ( // has all the required properties
      obj.hasOwnProperty('paperID') &&
      obj.hasOwnProperty('paperTitle') &&
      obj.hasOwnProperty('doi') &&
      obj.hasOwnProperty('journalID') &&
      obj.hasOwnProperty('journalName') &&
      obj.hasOwnProperty('pub_year') &&
      obj.hasOwnProperty('volume') &&
      obj.hasOwnProperty('issues') &&
      obj.hasOwnProperty('series')
    ) {
      if ( obj.paperID == '' || isNaN(parseInt(obj.paperID)) ) {
        console.error('Basic: invalid paper ID');
        return false;
      }
      if ( obj.paperTitle == '' ) {
        console.error('Basic: invalid paper title');
        return false;
      }
      if ( obj.journalID == '' || isNaN(parseInt(obj.journalID)) ) {
        console.error('Basic: invalid journal ID');
        return false;
      }
      if ( obj.journalName == '' ) {
        console.error('Basic: invalid journal name');
        return false;
      }
      if ( obj.pub_year = '' || isNaN(parseInt(obj.pub_year)) ) {
        console.error('Basic: invalid publication year');
        return false;
      }
      if ( parseInt(obj.pub_year) < 1900 ) {
        console.error('Basic: invalid publication year < 1900');
        return false;
      }
      if ( obj.volume == '' ) {
        console.error('Basic: invalid journal volume');
        return false;
      }
      // All checks passed
      return true;
    } else {
      console.error('Basic: invalid command '+obj.command);
      return false;
    }
  } else {
    return false;
  }
}

/**
 * @param  {object} obj
 */
async function validateNote( obj ) {
  // Example note
  // obj = {
  //   type: 'note',
  //   command: 'update',
  //   noteID: '12',
  //   paperID: '2',
  //   note: 'this is a note',
  // };
  // {
  //     type: 'note',
  //     command: 'insert',
  //     noteID: '12',
  //     paperID: '2',
  //     note: 'this is a note'
  // }

  // {
  //     type: 'note',
  //     command: 'delete',
  //     noteID: '12'
  // }
  switch (obj.command) {
    case 'update':
      // intentional fallthrough
    case 'insert':
      if ( !obj.hasOwnProperty('paperID') ) {
        console.error('Note: no paperID field');
        return false;
      }
      if ( obj.paperID == '' || isNaN(parseInt(obj.paperID)) ) {
        console.error('Note: Invalid paper ID');
        return false;
      }
      if ( !obj.hasOwnProperty('note') ) {
        console.error('Note: no note field');
        return false;
      }
      // intentional fallthrough
    case 'delete':
      if ( !obj.hasOwnProperty('noteID') ) {
        console.error('Note: no noteID field');
        return false;
      }
      if ( obj.noteID == '' || isNaN(parseInt(obj.noteID)) ) {
        console.error('Note: Invalid note ID');
        return false;
      }
      // all checks passed
      break;

    default:
      console.error('Note: Invalid command '+obj.command);
      return false;
  }
  // json is valid
  return true;
}

module.exports = {updateEntry, parseAction};

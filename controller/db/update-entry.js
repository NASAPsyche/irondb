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
        if ( (await validateAuthor(obj)) == false ) {
          return false;
        }
        break;

      case 'body':
        //
        break;

      case 'element':
        if ( (await validateSingleElement(obj)) == false ) {
          return false;
        }
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
async function validateAuthor( obj ) {
  // Example author
  // obj = {
  //   type: 'author',
  //   command: 'update',
  //   paperID: '3',
  //   authorID: '2',
  //   primaryName: 'Wasson',
  //   firstName: 'John',
  //   middleName: 'T',
  // };
  // {
  //     type: 'author',
  //     command: 'insert',
  //     paperID: '3',
  //     primaryName: 'Wasson',
  //     firstName: 'John',
  //     middleName: 'T'
  // }
  // {
  //     type: 'author',
  //     command: 'delete',
  //     paperID: '3',
  //     authorID: '2',
  // }
  switch (obj.command) {
    case 'update':
      // intentional fallthrough
    case 'insert':
      if (
        !obj.hasOwnProperty('primaryName') ||
        !obj.hasOwnProperty('firstName') ||
        !obj.hasOwnProperty('middleName')
      ) {
        console.error('Author: missing one or more name fields');
        return false;
      }
      if ( obj.primaryName == '' || obj.primaryName == null ) {
        console.error('Author: invalid primary name');
        return false;
      }
      if ( obj.firstName == '' || obj.firstName == null ) {
        console.error('Author: invalid first name');
        return false;
      }
      // intentional fallthrough
    case 'delete':
      if ( !obj.hasOwnProperty('paperID') ) {
        console.error('Author: missing paper id');
        return false;
      }
      if ( obj.paperID == '' || isNaN(parseInt(obj.paperID)) ) {
        console.error('Author: invalid paper id');
        return false;
      }
      if ( !obj.hasOwnProperty('authorID') ) {
        console.error('Author: missing author id');
        return false;
      }
      if ( obj.authorID == '' || isNaN(parseInt(obj.authorID)) ) {
        console.error('Author: invalid author id');
        return false;
      }
      // All tests pass
      break;

    default:
      break;
  }
  // json is valid
  return true;
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

/**
 * @param  {object} obj
 * @return {Promise} boolean
 */
async function validateSingleElement( obj ) {
  // Example obj
  // obj = {
  //   type: 'element',
  //   command: 'delete',
  //   elementID: '123',
  // };
  if ( obj.command == 'delete' ) {
    if ( !obj.hasOwnProperty('elementID') ) {
      console.error('Single Element Delete: missing element ID');
      return false;
    }
    if ( obj.elementID == '' || isNaN(parseInt(obj.elementID)) ) {
      console.error('Single Element Delete: invalid element ID');
      return false;
    }
    // Checks passed
  } else {
    console.error('Single Element Delete: invalid command '+obj.command);
    return false;
  }
  // Valid json
  return true;
}

module.exports = {updateEntry, parseAction};

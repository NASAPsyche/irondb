/* eslint-disable max-len */
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
 * @param  {object} client pg client
 * @param  {int} submissionID
 * @param  {string} username
 * @return {Promise} boolean
 */
async function parseAction( obj, client, submissionID, username ) {
  if ( obj.hasOwnProperty('type') && obj.hasOwnProperty('command') ) {
    const type = obj.type;
    // eslint-disable-next-line no-unused-vars
    const command = obj.command;
    switch (type) {
      case 'basic':
        if ( (await validateBasic(obj)) === false ) {
          return false;
        }
        return execBasic(obj);

      case 'author':
        if ( (await validateAuthor(obj)) === false ) {
          return false;
        }
        return execAuthor( obj, client, submissionID, username );

      case 'body':
        if ( (await validateBody(obj)) === false ) {
          return false;
        }
        return execBody(obj, client, submissionID, username);

      case 'element':
        if ( (await validateSingleElementDelete(obj)) === false ) {
          return false;
        }
        return execSingleElementDelete(obj, client, username);

      case 'note':
        if ( (await validateNote(obj)) === false ) {
          return false;
        }
        return execNote(obj, client, submissionID, username);

      default:
        return false;
    }
  } else {
    return false;
  }
}

/** ******************
 * JSON VALIDATORS
****************** */

/**
 * @param  {object} obj
 * @return {Promise} boolean
 */
async function validateBasic( obj ) {
  // Example object
  // obj ={
  //     type: 'basic',
  //     command: 'update',
  //     paperID: '2',
  //     paperTitle: 'title',
  //     doi: '',
  //     journalID: '3',
  //     journalName: 'name',
  //     pub_year: '1998',
  //     volume: '12',
  //     issue: '11',
  //     series: '3'
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
async function validateSingleElementDelete( obj ) {
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
    // Valid json
    return true;
  } else {
    console.error('Single Element Delete: invalid command '+obj.command);
    return false;
  }
}

/**
 * @param  {object} obj
 * @return {Promise} boolean
 */
async function validateElement( obj ) {
  // Example element object
  // obj = {
  //   element: 'Fe',
  //   lessThan: 'true',
  //   units: 'ppb',
  //   technique: 'INAA',
  //   page: '12',
  //   sigfig: '3',
  //   convertedMeasurement: '200',
  //   convertedDeviation: '121',
  // };

  if (
    obj.hasOwnProperty('element') &&
    obj.hasOwnProperty('lessThan') &&
    obj.hasOwnProperty('units') &&
    obj.hasOwnProperty('technique') &&
    obj.hasOwnProperty('page') &&
    obj.hasOwnProperty('sigfig') &&
    obj.hasOwnProperty('convertedMeasurement') &&
    obj.hasOwnProperty('convertedDeviation')
  ) {
    // Element symbol
    if (
      typeof obj.element != 'string' ||
      obj.element.length < 2 ||
      obj.element.length > 3
    ) {
      console.error('Element: element symbol invalid');
      return false;
    }

    // Less than
    if ( typeof obj.lessThan == 'string' ) {
      if ( obj.lessThan != 'true' && obj.lessThan != 'false' ) {
        console.error('Element: lessThan must be either true or false');
        return false;
      }
    } else {
      console.error('Element: lessThan invalid type');
      return false;
    }

    // Units
    const validUnits = ['wt_percent', 'ppm', 'ppb', 'mg_g', 'ug_g', 'ng_g'];
    if ( typeof obj.units == 'string' ) {
      if ( !validUnits.contains(obj.units) ) {
        console.error('Element: units not matching expected values');
        return false;
      }
    } else {
      console.error('Element: units invalid type');
      return false;
    }

    // Technique
    if ( typeof obj.technique != 'string' ) {
      console.error('Element: technique must be a string');
      return false;
    }

    // Page
    if ( isNaN(parseInt(obj.page)) ) {
      console.error('Element: page did not parse to a number');
      return false;
    } else if ( parseInt(obj.page) < 1 ) {
      console.error('Element: page number out of range < 1');
      return false;
    }

    // Significant Figures
    if ( isNaN(parseInt(obj.sigfig)) ) {
      console.error('Element: Significant Figures did not parse to a number');
      return false;
    } else if ( parseInt(obj.sigfig) < 0 ) {
      console.error('Element: Significant Figures out of range < 0');
      return false;
    }

    // Measurement
    if ( isNaN(parseInt(obj.convertedMeasurement)) ) {
      console.error('Element: Measurement did not parse to a number');
      return false;
    } else if (
      parseInt(obj.convertedMeasurement) < 0 ||
      parseInt(obj.convertedMeasurement) > 1000000000
    ) {
      console.error('Element: measurement out of range');
      return false;
    }

    // Deviation
    if ( isNaN(parseInt(obj.convertedDeviation)) ) {
      console.error('Element: Deviation did not parse to a number');
      return false;
    } else if (
      parseInt(obj.convertedDeviation) < 0 ||
      parseInt(obj.convertedDeviation) > 1000000000
    ) {
      console.error('Element: measurement out of range');
      return false;
    }

    // All checks pass
    // Valid json
    return true;
  } else {
    console.error('Element: one or more missing fields');
    return false;
  }
}


/**
 * @param  {object} obj
 */
async function validateBody( obj ) {
  // Example body
  obj = {
    type: 'body',
    command: 'update',
    bodyName: 'Alt',
    bodyID: '3',
    group: 'IIG',
    groupID: '4',
    measurements: [{
      elementID: '123',
      element: 'Fe',
      lessThan: 'true',
      units: 'ppb',
      technique: 'INAA',
      page: '12',
      sigfig: '3',
      convertedMeasurement: '200',
      convertedDeviation: '121',
    }],
  };
  // {
  //     type: 'body',
  //     command: 'insert',
  //     bodyName: 'Alt',
  //     group: 'IIG',
  //     measurements: [{
  //         element: 'Fe',
  //         lessThan: 'true',
  //         units: 'ppb',
  //         technique: 'INAA',
  //         page: '12',
  //         sigfig: '3',
  //         convertedMeasurement: '200',
  //         convertedDeviation: '121'
  //     }] // array for if more than one element
  // }
  // {
  //     type: 'body',
  //     command: 'delete',
  //     bodyID: '3',
  //     groupID: '4',
  // }
  switch (obj.command) {
    case 'insert': {
      if (
        !obj.hasOwnProperty('bodyName') ||
        !obj.hasOwnProperty('group') ||
        !obj.hasOwnProperty('measurements')
      ) {
        console.error('Body: missing fields on command '+obj.command);
        return false;
      }
      if (
        typeof obj.bodyName == 'undefined' ||
        obj.bodyName == null ||
        obj.bodyName == ''
      ) {
        console.error('Body: invalid body name');
        return false;
      }

      if ( typeof obj.group == 'undefined' || obj.group == null ) {
        console.error('Body: invalid group');
        return false;
      }

      if ( !Array.isArray(obj.measurements) ) {
        console.error('Body: measurement must be an array');
        return false;
      }

      for ( const ms of obj.measurements ) {
        if ( !validateElement(ms) ) {
          console.error('Body: Invalid measurement');
          return false;
        }
      }
      break;
    }

    case 'update':
      if (
        !obj.hasOwnProperty('bodyName') ||
        !obj.hasOwnProperty('group') ||
        !obj.hasOwnProperty('measurements')
      ) {
        console.error('Body: missing fields on command '+obj.command);
        return false;
      }

      if (
        typeof obj.bodyName == 'undefined' ||
        obj.bodyName == null ||
        obj.bodyName == ''
      ) {
        console.error('Body: invalid body name');
        return false;
      }

      if ( typeof obj.group == 'undefined' || obj.group == null ) {
        console.error('Body: invalid group');
        return false;
      }

      if ( !Array.isArray(obj.measurements) ) {
        console.error('Body: measurement must be an array');
        return false;
      }

      for ( const ms of obj.measurements ) {
        if ( !validateElement(ms) ) {
          console.error('Body: Invalid measurement');
          return false;
        }
      }
      // intentional fallthrough

    case 'delete':
      if (
        !obj.hasOwnProperty('bodyID') ||
        !obj.hasOwnProperty('groupID')
      ) {
        console.error('Body: missing fields on command '+obj.command);
        return false;
      }
      if ( obj.bodyID == '' || isNaN(parseInt(obj.bodyID)) ) {
        console.error('Body: invalid body ID');
        return false;
      }
      if ( obj.groupID == '' || isNaN(parseInt(obj.groupID)) ) {
        console.error('Body: invalid body ID');
        return false;
      }
      // Passed all checks
      break;

    default:
      console.error('Body: invalid command');
      return false;
  }

  // Valid json
  return true;
}


/** ******************
 * EXECUTE ACTIONS
****************** */

/**
 * @param  {object} obj
 * @param  {object} client pg client
 * @return {Promise}
 */
async function execBasic( obj, client ) {
  // Example object
  // obj ={
  //   type: 'basic',
  //   command: 'update',
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

  switch (obj.command) {
    case 'update': {
      let query = `
      UPDATE journals
      SET (journal_name, volume, issue, series, published_year)
      = ($1, $2, $3, $4, $5) 
      WHERE journal_id = ($6)
      `;
      let values = [
        obj.journalName,
        obj.volume,
        obj.issue,
        obj.series,
        parseInt(obj.pub_year),
        parseInt(obj.journalID),
      ];

      await client.query(query, values);

      query = `
      UPDATE papers
      SET (title, doi)
      = ($1, $2)
      WHERE paper_id = ($3)
      `;
      values = [
        obj.paperTitle,
        obj.doi,
        obj.paperID,
      ];

      await client.query(query, values);

      break;
    }

    default:
      return false;
  }

  return true;
}

/**
 * @param  {object} obj
 * @param  {object} client pg client
 * @param  {int} submissionID
 * @param  {string} username
 */
async function execAuthor( obj, client, submissionID, username ) {
  // Example obj
  // obj = {
  //   type: 'author',
  //   command: 'update',
  //   paperID: '3',
  //   authorID: '2',
  //   primaryName: 'John',
  //   firstName: 'Wasson',
  //   middleName: 'T',
  // };
  // {
  //     type: 'author',
  //     command: 'insert',
  //     paperID: '3',
  //     primaryName: 'John',
  //     firstName: 'Wasson',
  //     middleName: 'T'
  // }
  // {
  //     type: 'author',
  //     command: 'delete',
  //     paperID: '3',
  //     authorID: '2',
  // }

  switch (obj.command) {
    case 'update': {
      const query = `
      UPDATE authors
      SET (primary_name, middle_name, first_name)
      = ($1, $2, $3)
      WHERE author_id = ($4)
      `;

      const values = [
        obj.primaryName,
        obj.middleName,
        obj.firstName,
        obj.authorID,
      ];

      await client.query(query, values);
      break;
    }

    case 'insert': {
      const queries = `
      INSERT INTO
      authors(primary_name, middle_name, first_name)
      VALUES($1, $2, $3)
      RETURNING author_id
      `;

      const values = [
        obj.primaryName,
        obj.middleName,
        obj.firstName,
      ];

      let rows = await client.query(queries, values);
      const authorID = rows.rows[0].author_id;

      // Build metadata for author
      const authorStatusQuery = `
      INSERT INTO
      author_status(author_id, current_status, submitted_by, submission_id)
      VALUES($1, $2, $3, $4)
      RETURNING status_id
      `;
      const authorStatusValue = [
        authorID,
        'pending',
        username,
        submissionID,
      ];
      rows = await client.query(authorStatusQuery, authorStatusValue);

      const statusIdAuthor = rows.rows[0].status_id;
      const authorUpdateQuery = `
      UPDATE authors
      SET status_id = ($1)
      WHERE author_id = ($2)
      `;
      const authorUpdateValue = [
        statusIdAuthor,
        authorID,
      ];
      await client.query(authorUpdateQuery, authorUpdateValue);

      // Build attribution for new author
      const attrQuery = `
      INSERT INTO
      attributions(paper_id, author_id)
      VALUES($1, $2)
      RETURNING attribution_id
      `;
      const attrValue = [
        obj.paperID,
        authorID,
      ];
      rows = await client.query(attrQuery, attrValue);

      const attrId = rows.rows[0].attribution_id;
      const attrStatusQuery = `
      INSERT INTO
      attribution_status(attribution_id, current_status, submitted_by, submission_id)
      VALUES($1, $2, $3, $4)
      RETURNING status_id
      `;
      const attrStatusValue = [
        attrId,
        'pending',
        username,
        submissionID,
      ];
      rows = await client.query(attrStatusQuery, attrStatusValue);
      const statusIdAttr = rows.rows[0].status_id;
      const attrUpdateQuery = `
      UPDATE attributions
      SET status_id = ($1)
      WHERE attribution_id = ($2)
      `;
      const attrUpdateValue = [
        statusIdAttr,
        attrId,
      ];
      await client.query(attrUpdateQuery, attrUpdateValue);

      // //

      break;
    }

    case 'delete': {
      // Get status_id for attribution
      let query = `
      SELECT status_id
      FROM attributions
      WHERE paper_id = ($1)
      AND author_id = ($2)
      `;
      let values = [
        obj.paperID,
        obj.authorID,
      ];
      let rows = await client.query(query, values);
      let statusID = rows.rows[0].status_id;

      // Get user_id from username
      query = `
      SELECT user_id
      FROM users
      WHERE username = ($1)
      `;
      values = [username];
      rows = await client.query(query, values);
      const userID = rows.rows[0].user_id;

      // Update metadata to rejected
      query = `
      UPDATE attribution_status
      SET (current_status, reviewed_by, reviewed_date) = ($1, $2, $3)
      WHERE status_id = ($4)
      `;
      values = [
        'rejected',
        userID,
        'now()',
        statusID,
      ];

      await client.query(query, values);

      // Get status_id for author
      query = `
      SELECT status_id
      FROM authors
      WHERE author_id = ($1)
      `;
      values = [obj.authorID];

      rows = await client.query(query, values);
      statusID = rows.rows[0].status_id;

      // Update metadata to rejected
      query = `
      UPDATE author_status
      SET (current_status, reviewed_by, reviewed_date) = ($1, $2, $3)
      WHERE status_id = ($4)
      `;
      values = [
        'rejected',
        userID,
        'now()',
        statusID,
      ];

      await client.query(query, values);

      break;
    }

    default:
      break;
  }
  return true;
}

/**
 * @param  {object} obj
 * @param  {object} client pg client
 * @param  {int} submissionID
 * @param  {string} username
 */
async function execNote( obj, client, submissionID, username ) {
  // Example object
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
    case 'update': {
      const query = `
      UPDATE notes
      SET (note)= ($1, $2, $3)
      WHERE note_id = ($4)
      `;

      const values = [
        obj.primaryName,
        obj.middleName,
        obj.firstName,
        obj.noteID,
      ];

      await client.query(query, values);
      break;
    }

    case 'insert': {
      const noteQuery = `
      INSERT INTO
      notes(paper_id, note)
      VALUES($1, $2)
      RETURNING note_id
      `;
      const noteValue = [
        obj.paperID,
        obj.note,
      ];
      let {rows} = await client.query(noteQuery, noteValue);

      const noteId = rows[0].note_id;
      const noteStatusQuery = `
      INSERT INTO
      note_status(note_id, current_status, submitted_by, submission_id)
      VALUES($1, $2, $3, $4)
      RETURNING status_id
      `;
      const noteStatusValue = [
        noteId,
        'pending',
        username,
        submissionID,
      ];
      rows = await client.query(noteStatusQuery, noteStatusValue);

      const statusIdNote = rows.rows[0].status_id;
      const noteUpdateQuery = `
      UPDATE notes
      SET status_id = ($1)
      WHERE note_id = ($2)
      `;
      const noteUpdateValue = [
        statusIdNote,
        noteId,
      ];
      await client.query(noteUpdateQuery, noteUpdateValue);
      break;
    }

    case 'delete': {
      // Get status_id for note
      let query = `
      SELECT status_id
      FROM notes
      WHERE note_id = ($1)
      `;
      let values = [obj.noteID];
      let rows = await client.query(query, values);
      const statusID = rows.rows[0].status_id;

      // Get user_id from username
      query = `
      SELECT user_id
      FROM users
      WHERE username = ($1)
      `;
      values = [username];
      rows = await client.query(query, values);
      const userID = rows.rows[0].user_id;

      // Update metadata to rejected
      query = `
      UPDATE note_status
      SET (current_status, reviewed_by, reviewed_date) = ($1, $2, $3)
      WHERE status_id = ($4)
      `;
      values = [
        'rejected',
        userID,
        'now()',
        statusID,
      ];
      await client.query(query, values);

      break;
    }

    default:
      return false;
  }

  return true;
}

/**
 * @param  {object} obj
 * @param  {object} client
 * @param  {String} username
 */
async function execSingleElementDelete( obj, client, username) {
  // Example object
  // obj = {
  //   type: 'element',
  //   command: 'delete',
  //   elementID: '123',
  // };

  switch (obj.command) {
    case 'delete': {
      // Get status_id for element
      let query = `
      SELECT status_id
      FROM element_entries
      WHERE element_id = ($1)
      `;
      let values = [obj.elementID];
      let rows = await client.query(query, values);
      const statusID = rows.rows[0].status_id;

      // Get user_id from username
      query = `
      SELECT user_id
      FROM users
      WHERE username = ($1)
      `;
      values = [username];
      rows = await client.query(query, values);
      const userID = rows.rows[0].user_id;

      // Update metadata to rejected
      query = `
      UPDATE element_status
      SET (current_status, reviewed_by, reviewed_date) = ($1, $2, $3)
      WHERE status_id = ($4)
      `;
      values = [
        'rejected',
        userID,
        'now()',
        statusID,
      ];
      await client.query(query, values);

      break;
    }


    default:
      return false;
  }

  return true;
}

/**
 * @param  {object} obj
 * @param  {object} client
 * @param  {int} submissionID
 * @param  {string} username
 */
async function execBody( obj, client, submissionID, username ) {
  // Example obj
  obj = {
    type: 'body',
    command: 'update',
    bodyName: 'Alt',
    bodyID: '3',
    group: 'IIG',
    groupID: '4',
    measurements: [{
      elementID: '123',
      element: 'Fe',
      lessThan: 'true',
      units: 'ppb',
      technique: 'INAA',
      page: '12',
      sigfig: '3',
      convertedMeasurement: '200',
      convertedDeviation: '121',
    }],
  };
  // {
  //     type: 'body',
  //     command: 'insert',
  //     bodyName: 'Alt',
  //     group: 'IIG',
  //     measurements: [{
  //         element: 'Fe',
  //         lessThan: 'true',
  //         units: 'ppb',
  //         technique: 'INAA',
  //         page: '12',
  //         sigfig: '3',
  //         convertedMeasurement: '200',
  //         convertedDeviation: '121'
  //     }] // array for if more than one element
  // }
  // {
  //     type: 'body',
  //     command: 'delete',
  //     bodyID: '3',
  //     groupID: '4',
  // }

  switch (obj.command) {
    case 'update': {
      // Update body nomenclature
      let query = `
      UPDATE bodies
      SET (nomenclature) = ($1)
      WHERE body_id = ($2)
      `;

      let values = [
        obj.bodyName,
        obj.bodyID,
      ];

      await client.query(query, values);

      // Update group
      query = `
      UPDATE groups
      SET (the_group) = ($1)
      WHERE group_id = ($2)
      `;
      values = [
        obj.group,
        obj.groupID,
      ];

      await client.query(query, values);

      for ( const measure of obj.measurements ) {
        // Do element stuff
        measure;
      }

      break;
    }

    case 'insert': {
      // START BODY TRANSACTION
      const bodyQuery = `
      INSERT INTO
      bodies(nomenclature)
      VALUES($1)
      RETURNING body_id
      `;
      const bodyValue = [
        obj.bodyName,
      ];
      let rows = await client.query(bodyQuery, bodyValue);

      const bodyId = rows.rows[0].body_id;
      const bodyStatusQuery = `
      INSERT INTO
      body_status(body_id, current_status, submitted_by, submission_id)
      VALUES($1, $2, $3, $4)
      RETURNING status_id
      `;
      const bodyStatusValue = [
        bodyId,
        'pending',
        username,
        submissionID,
      ];
      rows = await client.query(bodyStatusQuery, bodyStatusValue);

      const statusIdBody = rows.rows[0].status_id;
      const bodyUpdateQuery = `
      UPDATE bodies
      SET status_id = ($1)
      WHERE body_id = ($2)
      `;
      const bodyUpdateValue = [
        statusIdBody,
        bodyId,
      ];
      await client.query(bodyUpdateQuery, bodyUpdateValue);
      // END BODY TRANSACTION
      // START GROUP TRANSACTION
      const groupQuery = `
      INSERT INTO
      groups(body_id, the_group)
      VALUES($1, $2)
      RETURNING group_id
      `;
      const groupValue = [
        bodyId,
        obj.group,
      ];
      rows = await client.query(groupQuery, groupValue);
      const groupId = rows.rows[0].group_id;
      const groupStatusQuery = `
      INSERT INTO
      group_status(group_id, current_status, submitted_by, submission_id)
      VALUES($1, $2, $3, $4)
      RETURNING status_id
      `;
      const groupStatusValue = [
        groupId,
        'pending',
        username,
        submissionID,
      ];
      rows = await client.query(groupStatusQuery, groupStatusValue);

      const statusIdGroup = rows.rows[0].status_id;
      const groupUpdateQuery = `
      UPDATE groups
      SET status_id = ($1)
      WHERE group_id = ($2)
      `;
      const groupUpdateValue = [
        statusIdGroup,
        groupId,
      ];
      await client.query(groupUpdateQuery, groupUpdateValue);
      // END GROUP TRANSACTION
      for ( const measure of obj.measurements ) {
        // Do element stuff
        measure;
      }
      break;
    }

    case 'delete': {
      // Get status_id for body
      let query = `
      SELECT status_id
      FROM body
      WHERE body_id = ($1)
      `;
      let values = [obj.bodyID];
      let rows = await client.query(query, values);
      const statusID = rows.rows[0].status_id;

      // Get user_id from username
      query = `
      SELECT user_id
      FROM users
      WHERE username = ($1)
      `;
      values = [username];
      rows = await client.query(query, values);
      const userID = rows.rows[0].user_id;

      // Update metadata to rejected
      query = `
      UPDATE body_status
      SET (current_status, reviewed_by, reviewed_date) = ($1, $2, $3)
      WHERE status_id = ($4)
      `;
      values = [
        'rejected',
        userID,
        'now()',
        statusID,
      ];
      await client.query(query, values);

      // Erase elements too???

      break;
    }


    default:
      break;
  }
}

module.exports = {updateEntry, parseAction};


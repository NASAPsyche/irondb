/* eslint-disable max-len */
const pg = require('./index');

let client;
/**
 * @param  {object} obj
 * @param  {string} username
 * @return {Promise} boolean
 */
async function updateEntry( obj, username ) {
  if ( !obj.hasOwnProperty('submissionID') || !obj.hasOwnProperty('actions') ) {
    console.error('Request invalid, missing properties');
    return false;
  }
  if ( !Array.isArray(obj.actions) ) {
    console.error('Request invalid, actions needs to be an array');
    return false;
  }
  if ( obj.actions.length < 1 ) {
    console.error('Request invalid, no actions found');
    return false;
  }

  let submissionID = null;
  if ( !obj.hasOwnProperty('command') || (obj.hasOwnProperty('command') && obj.command !== 'insert') ) {
    submissionID = parseInt(obj.submissionID);
  }
  // const client = await pg.pool.connect();
  client = await pg.pool.connect();
  try {
    await client.query('BEGIN');

    if (obj.hasOwnProperty('command') && obj.command === 'insert') {
      const submissionQuery =`
      INSERT INTO
      submissions(pdf_path, username)
      VALUES($1, $2)
      RETURNING submission_id
      `;
      const submissionValue = [obj.pdfPath, username];
      const {rows} = await client.query(submissionQuery, submissionValue);
      submissionID = rows[0].submission_id;
      let journalId = null;
      let paperId = null;

      // START JOURNAL TRANSACTION
      {
        const journalQuery = `
        INSERT INTO
        journals(journal_name, volume, issue, series, published_year)
        VALUES($1, $2, $3, $4, $5)
        RETURNING journal_id
        `;
        const journalValue = [
          obj.basic.journalName,
          obj.basic.volume,
          obj.basic.issue,
          obj.basic.series,
          obj.basic.pubYear,
        ];
        let {rows} = await client.query(journalQuery, journalValue);
        const journalStatusQuery = `
        INSERT INTO journal_status(journal_id, current_status, submitted_by, submission_id)
        VALUES($1, $2, $3, $4)
        RETURNING status_id
        `;
        const journalId_ = rows[0].journal_id;
        journalId = journalId_;
        if ( journalId == null || journalId == '') {
          throw new Error( 'invalid journal ID');
        }
        const journalStatusValue = [
          journalId,
          'pending',
          username,
          submissionID,
        ];
        rows = await client.query(journalStatusQuery, journalStatusValue);

        const journalUpdateQuery = `
        UPDATE journals
        SET status_id = ($1)
        WHERE journal_id = ($2)
        `;
        const statusIdJournal = rows.rows[0].status_id;
        const journalUpdateValue = [
          statusIdJournal,
          journalId,
        ];
        await client.query(journalUpdateQuery, journalUpdateValue);
        // END JOURNAL TRANSACTION
      }

      { // PAPER TRANSACTION
        const paperQuery = `
        INSERT INTO
        papers(journal_id, title, doi)
        VALUES($1, $2, $3)
        RETURNING paper_id
        `;
        const paperValue = [
          journalId,
          obj.basic.paperTitle,
          obj.basic.doi,
        ];
        let {rows} = await client.query(paperQuery, paperValue);

        const paperId_ = rows[0].paper_id;
        paperId = paperId_;
        if ( paperId == null || paperId == '') {
          throw new Error( 'invalid paper ID');
        }

        const paperStatusQuery = `
        INSERT INTO
        paper_status(paper_id, current_status, submitted_by, submission_id)
        VALUES($1, $2, $3, $4)
        RETURNING status_id
        `;
        const paperStatusValue = [
          paperId,
          'pending',
          username,
          submissionID,
        ];
        rows = await client.query(paperStatusQuery, paperStatusValue);
        const statusIdPaper = rows.rows[0].status_id;
        const paperUpdateQuery = `
        UPDATE papers
        SET status_id = ($1)
        WHERE paper_id = ($2)
        `;
        const paperUpdateValue = [
          statusIdPaper,
          paperId,
        ];
        await client.query(paperUpdateQuery, paperUpdateValue);
        // END PAPER TRANSACTION
      }

      // Update Actions with paperID
      obj.actions.map((action) => {
        action.paperID = paperId;
        if (action.type === 'body') {
          action.measurements.map((measurement) => {
            measurement.paperID = paperId;
          });
        }
      });
    } else {
      const query = `
      UPDATE submissions
      SET username = ($1)
      WHERE submission_id = ($2)
      `;
      const values = [username, submissionID];
      await client.query(query, values); // submission now belongs to current user
    }

    console.log(obj.actions);
    // Perform each action
    let hasNonDelete = false;
    for ( const action of obj.actions ) {
      if (action.hasOwnProperty('command') && action.command !== 'delete') {
        hasNonDelete = true;
      }
      const res = await parseAction(action, submissionID, username);
      if ( res === false ) {
        console.dir(action);
        throw new Error('Action Failed');
      }
    }

    // If command 'delete' on object set submission pending to false
    // Otherwise set to true if has a non delete command
    if ( obj.hasOwnProperty('command') && obj.command === 'delete' ) {
      const query = `
      UPDATE submissions
      SET pending = ($1)
      WHERE submission_id = ($2)
      `;
      const values = [false, submissionID];
      await client.query(query, values);
    } else {
      const query = `
      UPDATE submissions
      SET pending = ($1)
      WHERE submission_id = ($2)
      `;
      const values = [hasNonDelete, submissionID];
      await client.query(query, values);
    }

    await client.query('COMMIT');
    return true;
  } catch (error) {
    //
    await client.query('ROLLBACK');
    console.error(error);
    return false;
  } finally {
    client.release();
  }
}


/**
 * @param  {object} obj
 * @param  {int} submissionID
 * @param  {string} username
 * @return {Promise} boolean
 */
async function parseAction( obj, submissionID, username ) {
  console.log('Handle action: ', obj);
  if ( obj.hasOwnProperty('type') && obj.hasOwnProperty('command') ) {
    const type = obj.type;
    switch (type) {
      case 'basic':
        if ( (await validateBasic(obj)) === false ) {
          return false;
        } else {
          console.log('BASIC json validated, executing...');
          return execBasic(obj, username);
        }
      case 'author':
        if ( (await validateAuthor(obj)) === false ) {
          return false;
        } else {
          console.log('AUTHOR json validated, executing...');
          return execAuthor( obj, submissionID, username );
        }
      case 'body':
        if ( (await validateBody(obj)) === false ) {
          return false;
        } else {
          console.log('BODY json validated, executing...');
          return execBody(obj, submissionID, username);
        }
      case 'element':
        if ( (await validateSingleElementDelete(obj)) === false ) {
          return false;
        } else {
          console.log('ELEMENT json validated, executing...');
          return execSingleElementDelete(obj, username);
        }

      case 'note':
        if ( (await validateNote(obj)) === false ) {
          return false;
        } else {
          console.log('NOTE json validated, executing...');
          return execNote(obj, submissionID, username);
        }

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
  switch (obj.command) {
    case 'update': {
      if ( !obj.hasOwnProperty('paperID') ) {
        console.error('Basic: missing paperID');
        return false;
      }
      if ( !obj.hasOwnProperty('paperTitle') ) {
        console.error('Basic: missing paperTitle');
        return false;
      }
      if ( !obj.hasOwnProperty('doi') ) {
        console.error('Basic: missing doi');
        return false;
      }
      if ( !obj.hasOwnProperty('journalID') ) {
        console.error('Basic: missing journalID');
        return false;
      }
      if ( !obj.hasOwnProperty('journalName') ) {
        console.error('Basic: missing journalName');
        return false;
      }
      if ( !obj.hasOwnProperty('pub_year') ) {
        console.error('Basic: missing pub_year');
        return false;
      }
      if ( !obj.hasOwnProperty('volume') ) {
        console.error('Basic: missing volume');
        return false;
      }
      if ( !obj.hasOwnProperty('issue') ) {
        console.error('Basic: missing issue');
        return false;
      }
      if ( !obj.hasOwnProperty('series') ) {
        console.error('Basic: missing series');
        return false;
      }
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
      if ( obj.pub_year == '' || isNaN(parseInt(obj.pub_year)) ) {
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
      break;
    }

    case 'delete': {
      if ( !obj.hasOwnProperty('paperID') ) {
        console.error('Basic: missing paperID');
        return false;
      }
      if ( obj.paperID == '' || isNaN(parseInt(obj.paperID)) ) {
        console.error('Basic: invalid paper ID');
        return false;
      }
      if ( !obj.hasOwnProperty('journalID') ) {
        console.error('Basic: missing journalID');
        return false;
      }
      if ( obj.journalID == '' || isNaN(parseInt(obj.journalID)) ) {
        console.error('Basic: invalid journal ID');
        return false;
      }
      break;
    }

    default:
      return false;
  }
  // json is valid
  return true;
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
      if ( !obj.hasOwnProperty('paperID') ) {
        console.error('Author: missing paper id');
        return false;
      }
      if ( obj.paperID == '' || isNaN(parseInt(obj.paperID)) ) {
        console.error('Author: invalid paper id');
        return false;
      }
      if ( obj.authorID == '' || isNaN(parseInt(obj.authorID)) ) {
        console.error('Author: invalid author id');
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
      break;

    case 'insert': {
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
      if ( !obj.hasOwnProperty('paperID') ) {
        console.error('Author: missing paper id');
        return false;
      }
      if ( obj.paperID == '' || isNaN(parseInt(obj.paperID)) ) {
        console.error('Author: invalid paper id');
        return false;
      }
      break;
    }

    case 'delete': {
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
      break;
    }

    default:
      return false;
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
  //   note: 'this is a note',
  // };
  // {
  //     type: 'note',
  //     command: 'insert',
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
      if ( !obj.hasOwnProperty('note') ) {
        console.error('Note: no note field');
        return false;
      }
      if ( !obj.hasOwnProperty('noteID') ) {
        console.error('Note: no noteID field');
        return false;
      }
      if ( obj.noteID == '' || isNaN(parseInt(obj.noteID)) ) {
        console.error('Note: Invalid note ID');
        return false;
      }
      break;
    }
    case 'insert': {
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
      break;
    }
    case 'delete': {
      if ( !obj.hasOwnProperty('noteID') ) {
        console.error('Note: no noteID field');
        return false;
      }
      if ( obj.noteID == '' || isNaN(parseInt(obj.noteID)) ) {
        console.error('Note: Invalid note ID');
        return false;
      }
      break;
    }
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
      obj.element.length < 1 ||
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
      if ( !validUnits.includes(obj.units) ) {
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
  // obj = {
  //   type: 'body',
  //   command: 'update',
  //   bodyName: 'Alt',
  //   bodyID: '3',
  //   group: 'IIG',
  //   groupID: '4',
  //   measurements: [{
  //     elementID: '123',
  //     element: 'Fe',
  //     lessThan: 'true',
  //     units: 'ppb',
  //     technique: 'INAA',
  //     page: '12',
  //     sigfig: '3',
  //     convertedMeasurement: '200',
  //     convertedDeviation: '121',
  //   }],
  // };
  // {
  //     type: 'body',
  //     command: 'insert',
  //     bodyName: 'Alt',
  //     group: 'IIG',
  //     paperID: '3',
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
        !obj.hasOwnProperty('measurements') ||
        !obj.hasOwnProperty('paperID')
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

      if ( obj.paperID == '' || obj.paperID == null || isNaN(parseInt(obj.paperID))) {
        console.error('Body: invlaid paper id');
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
 * @param  {string} username
 */
async function execBasic( obj, username ) {
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
      RETURNING status_id
      `;
      let values = [
        obj.journalName,
        obj.volume,
        obj.issue,
        obj.series,
        obj.pub_year,
        obj.journalID,
      ];

      let rows = await client.query(query, values);
      let statusID = rows.rows[0].status_id;

      // Update metadata to pending
      query = `
      UPDATE journal_status
      SET current_status = ($1)
      WHERE status_id = ($2)
      `;
      values = [
        'pending',
        statusID,
      ];

      await client.query(query, values);

      query = `
      UPDATE papers
      SET (title, doi)
      = ($1, $2)
      WHERE paper_id = ($3)
      RETURNING status_id
      `;
      values = [
        obj.paperTitle,
        obj.doi,
        obj.paperID,
      ];

      rows = await client.query(query, values);
      statusID = rows.rows[0].status_id;

      // Update metadata to pending
      query = `
      UPDATE paper_status
      SET current_status = ($1)
      WHERE status_id = ($2)
      `;
      values = [
        'pending',
        statusID,
      ];

      await client.query(query, values);
      break;
    }

    case 'delete': {
      // Get status_id for paper
      let query = `
      SELECT status_id
      FROM papers
      WHERE paper_id = ($1)
      `;
      let values = [obj.paperID];

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
      UPDATE paper_status
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

      // Get status_id for journal
      query = `
      SELECT status_id
      FROM journals
      WHERE journal_id = ($1)
      `;
      values = [obj.journalID];

      rows = await client.query(query, values);
      statusID = rows.rows[0].status_id;

      // Update metadata to rejected
      query = `
      UPDATE journal_status
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
 * @param  {int} submissionID
 * @param  {string} username
 */
async function execAuthor( obj, submissionID, username ) {
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
      RETURNING status_id
      `;

      const values = [
        obj.primaryName,
        obj.middleName,
        obj.firstName,
        obj.authorID,
      ];

      const rows = await client.query(query, values);
      const statusID = rows.rows[0].status_id;

      // Update metadata to pending
      const authorStatusQuery = `
      UPDATE author_status
      SET current_status = ($1)
      WHERE status_id = ($2)
      `;

      const authorStatusValue = [
        'pending',
        statusID,
      ];

      await client.query(authorStatusQuery, authorStatusValue);
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
 * @param  {int} submissionID
 * @param  {string} username
 */
async function execNote( obj, submissionID, username ) {
  // Example object
  // obj = {
  //   type: 'note',
  //   command: 'update',
  //   noteID: '12',
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
      let query = `
      UPDATE notes
      SET note= ($1)
      WHERE note_id = ($2)
      RETURNING status_id
      `;

      let values = [
        obj.note,
        obj.noteID,
      ];

      const rows = await client.query(query, values);
      const statusID = rows.rows[0].status_id;

      // Update metadata to pending
      query = `
      UPDATE note_status
      SET current_status = ($1)
      WHERE status_id = ($2)
      `;
      values = [
        'pending',
        statusID,
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
 * @param  {String} username
 */
async function execSingleElementDelete( obj, username) {
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
 * @param  {int} submissionID
 * @param  {string} username
 */
async function execBody( obj, submissionID, username ) {
  // Example obj
  // obj = {
  //   type: 'body',
  //   command: 'update',
  //   bodyName: 'Alt',
  //   bodyID: '3',
  //   group: 'IIG',
  //   groupID: '4',
  //   measurements: [{
  //     elementID: '123',
  //     element: 'Fe',
  //     lessThan: 'true',
  //     units: 'ppb',
  //     technique: 'INAA',
  //     page: '12',
  //     sigfig: '3',
  //     convertedMeasurement: '200',
  //     convertedDeviation: '121',
  //   }],
  // };
  // {
  //     type: 'body',
  //     command: 'insert',
  //     bodyName: 'Alt',
  //     group: 'IIG',
  //     paperID: '3'
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
      SET nomenclature = ($1)
      WHERE body_id = ($2)
      RETURNING status_id
      `;

      let values = [
        obj.bodyName,
        obj.bodyID,
      ];

      let rows = await client.query(query, values);
      let statusID = rows.rows[0].status_id;

      // Update metadata to pending
      query = `
      UPDATE body_status
      SET current_status = ($1)
      WHERE status_id = ($2)
      `;
      values = [
        'pending',
        statusID,
      ];

      await client.query(query, values);

      // Update group
      query = `
      UPDATE groups
      SET the_group = ($1)
      WHERE group_id = ($2)
      RETURNING status_id
      `;
      values = [
        obj.group,
        obj.groupID,
      ];

      rows = await client.query(query, values);
      statusID = rows.rows[0].status_id;

      // Update metadata to pending
      query = `
      UPDATE group_status
      SET current_status = ($1)
      WHERE status_id = ($2)
      `;
      values = [
        'pending',
        statusID,
      ];

      await client.query(query, values);

      for ( const measure of obj.measurements ) {
        // Example measure
        // measure ={
        //   elementID: '123',
        //   element: 'Fe',
        //   lessThan: 'true',
        //   units: 'ppb',
        //   technique: 'INAA',
        //   page: '12',
        //   sigfig: '3',
        //   convertedMeasurement: '200',
        //   convertedDeviation: '121',
        // };
        // measure;
        query = `
        UPDATE element_entries
        SET (
          element_symbol, 
          less_than, 
          original_unit, 
          technique, 
          page_number, 
          sigfig, 
          ppb_mean,
          deviation 
        ) = ($1, $2, $3, $4, $5, $6, $7, $8)
        WHERE element_id = ($9)
        RETURNING status_id
        `;
        values = [
          measure.element,
          measure.lessThan,
          measure.units,
          measure.technique,
          measure.page,
          measure.sigfig,
          measure.convertedMeasurement,
          measure.convertedDeviation,
          measure.elementID,
        ];

        rows = await client.query(query, values);
        statusID = rows.rows[0].status_id;

        // Update metadata to pending
        query = `
        UPDATE element_status
        SET current_status = ($1)
        WHERE status_id = ($2)
        `;
        values = [
          'pending',
          statusID,
        ];

        await client.query(query, values);
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
      // if completely new insert update elements with body ID
      if (obj.hasOwnProperty('command') && obj.command === 'insert') {
        obj.measurements.map((measurement) => {
          measurement.bodyID = bodyId;
        });
      }
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


      // START MEASUREMENTS FOR BODIES TRANSACTIONS
      for (const measure of obj.measurements) {
        // Convert data to appropriate type
        const measureVal = parseInt(measure.convertedMeasurement, 10);
        const deviation = parseInt(measure.convertedDeviation, 10);
        const sigfigVal = parseInt(measure.sigfig, 10);
        measure.element = String(measure.element).toLowerCase();

        const measureQuery = `
        INSERT INTO
        element_entries(
          body_id,
          element_symbol,
          paper_id,
          page_number,
          ppb_mean,
          deviation,
          less_than,
          original_unit,
          technique,
          sigfig
        )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING element_id
        `;
        const measureValue = [
          bodyId,
          measure.element,
          obj.paperID,
          measure.page,
          measureVal,
          deviation,
          measure.lessThan,
          measure.units,
          measure.technique,
          sigfigVal,
        ];
        let rows = await client.query(measureQuery, measureValue);

        const elementId = rows.rows[0].element_id;
        const measureStatusQuery = `
        INSERT INTO
        element_status(element_id, current_status, submitted_by, submission_id)
        VALUES($1, $2, $3, $4)
        RETURNING status_id
        `;
        const measureStatusValue = [
          elementId,
          'pending',
          username,
          submissionID,
        ];
        rows = await client.query(measureStatusQuery, measureStatusValue);

        const statusIdMeasure = rows.rows[0].status_id;
        const measureUpdateQuery = `
        UPDATE element_entries
        SET status_id = ($1)
        WHERE element_id = ($2)
        `;
        const measureUpdateValue = [
          statusIdMeasure,
          elementId,
        ];
        await client.query(measureUpdateQuery, measureUpdateValue);
      } // END MEASUREMENTS FOR BODIES TRANSACTIONS

      break;
    }

    case 'delete': {
      // Get status_id for body
      let query = `
      SELECT status_id
      FROM bodies
      WHERE body_id = ($1)
      `;
      let values = [parseInt(obj.bodyID)];
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

      // Get status_id for group
      query = `
      SELECT status_id
      FROM groups
      WHERE group_id = ($1)
      `;
      values = [obj.groupID];
      rows = await client.query(query, values);
      const groupStatusId = rows.rows[0].status_id;

      // Update metadata to rejected
      query = `
      UPDATE group_status
      SET (current_status, reviewed_by, reviewed_date) = ($1, $2, $3)
      WHERE status_id = ($4)
      `;
      values = [
        'rejected',
        userID,
        'now()',
        groupStatusId,
      ];
      await client.query(query, values);

      // Get elements
      query = `
      SELECT element_id
      FROM element_entries
      WHERE body_id = ($1)
      `;
      values = [parseInt(obj.bodyID)];

      rows = await client.query(query, values);
      for ( const row of rows.rows ) {
        let query = `
        SELECT status_id
        FROM element_entries
        WHERE element_id = ($1)
        `;
        let values = [parseInt(row.element_id)];
        const res = await client.query(query, values);
        const statusID = res.rows[0].status_id;
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
      }

      break;
    }


    default:
      break;
  }
}

module.exports = {
  updateEntry,
  validateBody,
  validateElement,
};


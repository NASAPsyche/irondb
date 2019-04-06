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
 * @return {Promise} success: {queries: [], values: []},
 * failure: false
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
        return buildQueryBasic(obj);

      case 'author':
        if ( (await validateAuthor(obj)) == false ) {
          return false;
        }
        break;

      case 'body':
        if ( (await validateBody(obj)) == false ) {
          return false;
        }
        break;

      case 'element':
        if ( (await validateSingleElementDelete(obj)) == false ) {
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
    case 'insert':
      // intentional fallthrough
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

/**
 * @param  {object} obj
 * @return {Promise} success: {queries: [], values: []},
 * failure: false
 */
async function buildQueryBasic( obj ) {
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
      const queries = [];
      const values = [];
      queries.push(`
      UPDATE journals
      SET (journal_name, volume, issue, series, published_year)
      = ($1, $2, $3, $4, $5) 
      WHERE journal_id = ($6)
      `);
      const journalValues = [];
      journalValues.push(obj.journalName);
      journalValues.push(obj.volume);
      journalValues.push(obj.issue);
      journalValues.push(obj.series);
      journalValues.push(parseInt(obj.pub_year));
      journalValues.push(parseInt(obj.journalID));
      values.push(journalValues);

      queries.push(`
      UPDATE papers
      SET (title, doi)
      = ($1, $2)
      WHERE paper_id = ($3)
      `);
      const paperValues = [];
      paperValues.push(obj.paperTitle);
      paperValues.push(obj.doi);
      paperValues.push(obj.paperID);
      values.push(paperValues);

      return {queries: queries, values: values};
    }

    default:
      return false;
  }
}

module.exports = {updateEntry, parseAction};

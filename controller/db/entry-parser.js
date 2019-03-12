/**
 * Collection of functions needed to parse the data from the data editor page
 */

/**
 * @description Gets keys from request body
 * @param  {object} reqBody
 * @return {object}
 */
function getKeys(reqBody) {
  // Get an array of the keys, needed for filtering
  const keys = Object.keys(reqBody);

  // Using the 'keys' array, get an array of all keys that match the regex
  // Authors
  const primaryNameKeys = keys.filter((value) => /^primaryName/.test(value));
  const singleEntityKeys = keys.filter((value) => /^singleEntity/.test(value));

  // Meteorites
  const bodyNameKeys = keys.filter((value) => /^bodyName/.test(value));

  // Measurements
  const elementKeys = keys.filter((value) => /^element/.test(value));
  const lessThanKeys = keys.filter((value) => /^lessThan/.test(value));

  // Notes
  const noteKeys = keys.filter((value) => /^note/.test(value));

  return {
    primaryNameKeys: primaryNameKeys,
    singleEntityKeys: singleEntityKeys,
    bodyNameKeys: bodyNameKeys,
    elementKeys: elementKeys,
    lessThanKeys: lessThanKeys,
    noteKeys: noteKeys,
  };
}


/**
 * @description Gets journal from request body
 * @param {object} reqBody The body of the request
 * @return {object} The journal
 */
function getJournal(reqBody) {
  // Get the values for the Journal and Paper
  const journalName = reqBody['journalName'];
  const volume = reqBody['volume'];
  const issue = reqBody['issue'];
  const series = reqBody['series'];
  const pubYear = reqBody['pubYear'];

  // Build journal object
  const journal = {
    'journalName': journalName,
    'volume': volume,
    'issue': issue,
    'series': series,
    'pubYear': pubYear,
  };
  return journal;
}


/**
 * @description Gets paper from request body
 * @param  {object} reqBody
 * @return {object} The paper
 */
function getPaper(reqBody) {
  // Get values for paper
  const paperTitle = reqBody['paperTitle'];
  const doi = reqBody['doi'];

  // Build paper object
  const paper = {
    'paperTitle': paperTitle,
    'doi': doi,
  };
  return paper;
}


/**
 * @description Gets authors from request body
 * @param  {object} reqBody
 * @param  {object} keys
 * @return {Array} Array of author objects
 */
function getAuthors(reqBody, keys) {
  // Grab the relevant keys
  const primaryNameKeys = keys.primaryNameKeys;
  const singleEntityKeys = keys.singleEntityKeys;
  // An array of author objects
  const authors = [];
  // Build each author as an object and add to the array
  primaryNameKeys.forEach((name) => {
    // Gets the number from the end of the primaryName key
    const strToMatch = 'primaryName';
    const num = name.substring(strToMatch.length);
    // Build the key names
    const firstName = 'firstName' + num.toString();
    const middleName = 'middleName' + num.toString();
    const singleEntity = 'singleEntity' + num.toString();
    let singleEntityVal = false;
    // If singleEntity* key exists, then it is always true
    if (singleEntityKeys.includes(String(singleEntity))) {
      singleEntityVal = true;
    }
    const author = {
      'primaryName': reqBody[String(name)],
      'firstName': reqBody[String(firstName)],
      'middleName': reqBody[String(middleName)],
      'singleEntity': singleEntityVal,
    };
    authors.push(author);
  });
  return authors;
}


/**
 * @description Gets meteorites and their measurements from request body
 * @param  {object} reqBody
 * @param  {object} keys
 * @return {Array} Array of meteorite objects
 */
function getBodies(reqBody, keys) {
  // Grab relevant keys
  const lessThanKeys = keys.lessThanKeys;
  const bodyNameKeys = keys.bodyNameKeys;
  const elementKeys = keys.elementKeys;
  // An array of meteorites
  const bodies = [];
  bodyNameKeys.forEach((name) => {
  // Get the meteorite number from end of key
    const strToMatch = 'bodyName';
    const bodyNum = name.substring(strToMatch.length); //
    // Build the key names
    const group = 'group' + bodyNum.toString();
    const classOf = 'class' + bodyNum.toString();
    const meteorite = {
      'nomenclature': reqBody[String(name)],
      'classification': reqBody[String(classOf)],
      'group': reqBody[String(group)],
      'measurements': [],
    };

    // Make a regular expression for matching the body with element numbers
    const elementKeyString = 'element' + String(bodyNum) + '-';
    const re = new RegExp(elementKeyString, 'g');

    const measurements = [];
    elementKeys.forEach((key) => {
    // returns not null if begins with elementKeyString
      if (key.match(re) != null) {
        measurements.push(key);
      }
    });

    // Build the measurements for each element per body
    measurements.forEach((elem) => {
      const elemNum = elem.substring(elementKeyString.length);
      const element = elem;
      // The index of the measurement, ex: '0-0'
      const idx = String(bodyNum) + '-' + String(elemNum);
      const lessThan = 'lessThan' + String(idx);
      let lessThanVal = false;
      if (lessThanKeys.includes(String(lessThan))) {
        lessThanVal = true;
      }
      const measurement = 'convertedMeasurement' + String(idx);
      const deviation = 'convertedDeviation' + String(idx);
      const unit = 'units' + String(idx);
      const technique = 'technique' + String(idx);
      const page = 'page' + String(idx);
      const units = convertUnitString(reqBody[String(unit)]);
      const sigfig = 'sigfig' + String(idx);
      if (isNaN(parseInt(reqBody[String(deviation)]))) {
        reqBody[String(deviation)] = 0;
      }
      // The measurement object
      const measure = {
        'element': reqBody[String(element)],
        'lessThan': lessThanVal,
        'measurement': parseInt(reqBody[String((measurement))]),
        'deviation': parseInt(reqBody[String(deviation)]),
        'unit': units,
        'technique': reqBody[String(technique)],
        'page': parseInt(reqBody[String(page)]),
        'sigfig': parseInt(reqBody[String(sigfig)]),
      };
      meteorite.measurements.push(measure);
    });
    bodies.push(meteorite);
  });
  return bodies;
}


/**
 * @description Get notes from request body
 * @param  {object} reqBody
 * @param  {object} keys
 * @return {Array}
 */
function getNotes(reqBody, keys) {
  const noteKeys = keys.noteKeys;
  const notes = [];
  noteKeys.forEach((key) => {
    const note = reqBody[String(key)];
    notes.push(note);
  });
  return notes;
}


/**
 * @description Converts units from values in form
 * to values expected by database
 * @param  {string} orignalUnit
 * @return {string} converted string
 */
function convertUnitString(orignalUnit) {
  let units;
  switch (orignalUnit) {
    case 'wt%':
      units = 'wt_percent';
      break;
    case 'ppm':
      units = 'ppm';
      break;
    case 'ppb':
      units = 'ppb';
      break;
    case 'mg/g':
      units = 'mg_g';
      break;
    case 'µg/g':
      units = 'ug_g';
      break;
    case 'ng/g':
      units = 'ng_g';
      break;
  }
  return units;
}


module.exports = {
  getJournal,
  getPaper,
  getKeys,
  getAuthors,
  getBodies,
  getNotes,
};

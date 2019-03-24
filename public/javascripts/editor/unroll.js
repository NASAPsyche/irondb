/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-undef
const dict = savedData; // savedData defined in editor.ejs

// Populate the single values (there can never be more than one of these)
changeValue('journalName', 'journalName', dict);
changeValue('volume', 'volume', dict);
changeValue('issue', 'issue', dict);
changeValue('series', 'series', dict);
changeValue('pubYear', 'pubYear', dict);
changeValue('paperTitle', 'paperTitle', dict);
changeValue('doi', 'doi', dict);

// gathering unique keys in preparation for dynamic number of elements
const keys = Object.keys(dict);
const primaryNameKeys = keys.filter((value) => /^primaryName/.test(value));
const singleEntityKeys = keys.filter((value) => /^singleEntity/.test(value));
const bodyNameKeys = keys.filter((value) => /^bodyName/.test(value));
const elementKeys = keys.filter((value) => /^element/.test(value));
const lessThanKeys = keys.filter((value) => /^lessThan/.test(value));
const noteKeys = keys.filter((value) => /^note/.test(value));

const uniqueIndex = {
  authors: [],
  bodies: [],
  elements: [],
  notes: [],
};

// Gather the unique indexes as arrays
for ( const author of primaryNameKeys) {
  const idx = author.substring('primaryName'.length);
  if ( !uniqueIndex.authors.includes(idx) ) {
    uniqueIndex.authors.push(idx);
  }
}

for ( const body of bodyNameKeys ) {
  const idx = body.substring('bodyName'.length);
  if ( !uniqueIndex.bodies.includes(idx) ) {
    uniqueIndex.bodies.push(idx);
  }
}

for ( const element of elementKeys ) {
  const idx = element.substring('element'.length);
  if ( !uniqueIndex.elements.includes(idx) ) {
    uniqueIndex.elements.push(idx);
  }
}

for ( const note of noteKeys ) {
  const idx = note.substring('note'.length);
  if ( !uniqueIndex.notes.includes(idx) ) {
    uniqueIndex.notes.push(idx);
  }
}
// console.dir(uniqueIndex);

// Populate author(s)
for ( const [index, element] of uniqueIndex.authors.entries() ) {
  // Add additional field for each additional element
  if ( index > 0 ) {
    // eslint-disable-next-line no-undef
    addAuthor('i.add-author');
  }

  // Build target and key strings
  const pName = 'primaryName';
  const pNameTarget = pName + index;
  const pNameKey = pName + element;
  const mName = 'middleName';
  const mNameTarget = mName + index;
  const mNameKey = mName + element;
  const fName = 'firstName';
  const fNameTarget = fName + index;
  const fNameKey = fName + element;
  const sEnt = 'singleEntity';
  const sEntTarget = sEnt + index;
  const sEntKey = sEnt + element;

  // Populate the fields
  changeValue(pNameTarget, pNameKey, dict);
  changeValue(mNameTarget, mNameKey, dict);
  changeValue(fNameTarget, fNameKey, dict);
  changeValue(sEntTarget, sEntKey, dict);
}

changeValue('bodyName0', 'bodyName0', dict);
changeValue('group0', 'group0', dict);
changeValue('class0', 'class0', dict);
changeValue('element0-0', 'element0-0', dict);
changeValue('lessThan0-0', 'lessThan0-0', dict);
changeValue('measurement0-0', 'measurement0-0', dict);
changeValue('deviation0-0', 'deviation0-0', dict);
changeValue('units0-0', 'units0-0', dict);
changeValue('technique0-0', 'technique0-0', dict);
changeValue('page0-0', 'page0-0', dict);
changeValue('note0', 'note0', dict);

/**
 * @description Changes the value of the target input.
 * @param  {string} target id of targeted input.
 * @param  {string} key the key to fetch the value
 * @param  {object} dict the dictionary of key-value pairs
 */
function changeValue(target, key, dict ) {
  if (typeof target !== 'string') return; // invalid parameter type
  if (typeof dict !== 'object') return; // invalid parameter type
  if (Object.keys(dict).includes(target)) {
    $('#' + target).val(dict[key]);
  }
}

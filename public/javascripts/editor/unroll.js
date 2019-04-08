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
const bodyNameKeys = keys.filter((value) => /^bodyName/.test(value));
const elementKeys = keys.filter((value) => /^element/.test(value));
const noteKeys = keys.filter((value) => /^note/.test(value));

const uniqueIndex = {
  authors: [],
  bodies: [],
  elements: [],
  notes: [],
};

// Gather the unique indexes as arrays
for ( const author of primaryNameKeys ) {
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

// Populate author(s)
for ( const [index, element] of uniqueIndex.authors.entries() ) {
  // Add additional field for each additional element
  if ( index > 0 ) {
    // eslint-disable-next-line no-undef
    addAuthor('i.add-author');
  }

  const pName = 'primaryName';
  const pNameTarget = pName + index;
  const pNameKey = pName + element;
  changeValue(pNameTarget, pNameKey, dict);

  const mName = 'middleName';
  const mNameTarget = mName + index;
  const mNameKey = mName + element;
  changeValue(mNameTarget, mNameKey, dict);

  const fName = 'firstName';
  const fNameTarget = fName + index;
  const fNameKey = fName + element;
  changeValue(fNameTarget, fNameKey, dict);
}

// Populate the notes
for ( const [index, element] of uniqueIndex.notes.entries() ) {
  if ( index > 0) {
    // eslint-disable-next-line no-undef
    addNote('i.add-note');
  }

  const noteTarget = 'note' + index;
  const noteKey = 'note' + element;
  changeValue(noteTarget, noteKey, dict);
}

let elementCounter = 0;
// const re = new RegExp(elementKeyString, 'g');
for ( const [index, element] of uniqueIndex.bodies.entries() ) {
  if ( index > 0 ) {
    // eslint-disable-next-line no-undef
    addMeteorite('i.add-meteorite');
  }

  const bodyTarget = 'bodyName' + index;
  const bodyKey = 'bodyName' + element;
  changeValue(bodyTarget, bodyKey, dict);

  const groupTarget = 'group' + index;
  const groupKey = 'group' + element;
  changeValue(groupTarget, groupKey, dict);

  const classTarget = 'class' + index;
  const classKey = 'class' + element;
  changeValue(classTarget, classKey, dict);

  // Gather indices of measurements that belong to this body
  const reStr = 'element' + element + '_';
  const re = new RegExp(reStr, 'g');
  const matchedElements = [];
  elementKeys.forEach((key) => {
    // returns not null if matches regexp
    if (key.match(re) != null) {
      matchedElements.push(key.substring(reStr.length));
    }
  });

  for ( const [subIndex, subElement] of matchedElements.entries() ) {
    if ( subIndex > 0 ) {
      // eslint-disable-next-line no-undef
      addMeasurement('i.add-measurement');
    }

    const targetIdx = String(index) + '_' + String(elementCounter);
    const elementIdx = String(element) + '_' + String(subElement);

    const elementTarget = 'element' + targetIdx;
    const elementKey = 'element' + elementIdx;
    changeValue(elementTarget, elementKey, dict);

    const lessThanTarget = 'lessThan' + targetIdx;
    const lessThanKey = 'lessThan' + elementIdx;
    changeValue(lessThanTarget, lessThanKey, dict, true);

    const measurementTarget = 'measurement' + targetIdx;
    const measurementKey = 'measurement' + elementIdx;
    changeValue(measurementTarget, measurementKey, dict);

    const unitTarget = 'units' + targetIdx;
    const unitKey = 'units' + elementIdx;
    changeValue(unitTarget, unitKey, dict);

    const deviationTarget = 'deviation' + targetIdx;
    const deviationKey = 'deviation' + elementIdx;
    changeValue(deviationTarget, deviationKey, dict);

    const techniqueTarget = 'technique' + targetIdx;
    const techniqueKey = 'technique' + elementIdx;
    changeValue(techniqueTarget, techniqueKey, dict);

    const pageTarget = 'page' + targetIdx;
    const pageKey = 'page' + elementIdx;
    changeValue(pageTarget, pageKey, dict);

    elementCounter++;
  }
}

/**
 * @description Changes the value of the target input.
 * @param  {string} target id of targeted input.
 * @param  {string} key the key to fetch the value
 * @param  {object} dict the dictionary of key-value pairs
 * @param  {boolean} isCheckBox true - the target is a checkbox
 */
function changeValue(target, key, dict, isCheckBox = false ) {
  if (typeof target !== 'string') return; // invalid parameter type
  if (typeof dict !== 'object') return; // invalid parameter type
  if ( Object.keys(dict).includes(target) ) {
    if (isCheckBox) {
      if ( dict[key] == 'on' ) {
        $('#' + target).prop('checked', true);
      }
    } else {
      $('#' + target).val(dict[key]);
    }
  }
}

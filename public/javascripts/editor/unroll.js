// eslint-disable-next-line no-undef
const dict = savedData; // savedData defined in editor.ejs
// gathering unique keys in preparation for dynamic number of elements
// const keys = Object.keys(dict);
// const primaryNameKeys = keys.filter((value) => /^primaryName/.test(value));
// const singleEntityKeys = keys.filter((value) => /^singleEntity/.test(value));
// const bodyNameKeys = keys.filter((value) => /^bodyName/.test(value));
// const elementKeys = keys.filter((value) => /^element/.test(value));
// const lessThanKeys = keys.filter((value) => /^lessThan/.test(value));
// const noteKeys = keys.filter((value) => /^note/.test(value));

changeValue('journalName', 'journalName', dict);
changeValue('volume', 'volume', dict);
changeValue('issue', 'issue', dict);
changeValue('series', 'series', dict);
changeValue('pubYear', 'pubYear', dict);
changeValue('paperTitle', 'paperTitle', dict);
changeValue('doi', 'doi', dict);

changeValue('primaryName0', 'primaryName0', dict);
changeValue('firstName0', 'firstName0', dict);
changeValue('middleName0', 'middleName0', dict);
changeValue('singleEntity0', 'singleEntity1', dict);
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

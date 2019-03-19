/**
 * @param  {number} num number in percent to be converted
 * @return {number} num converted to ppb
 * @description Converts weight percent to ppb
 */
function percentToPPB( num ) {
  return num * 10000000;
}

/**
 * @param  {number} num number in ppm to be converted
 * @return {number} num converted to ppb
 * @description Converts ppm to ppb
 */
function ppmToPPB( num ) {
  return num * 1000;
}

/**
 * @param  {number} num number in milligramsPerGram to be converted
 * @return {number} num converted to ppb
 * @description Converts milligramsPerGram to ppb
 */
function milligramsPerGramToPPB( num ) {
  return num * 1000000;
}

/**
 * @param  {number} num number in microgramsPerGram to be converted
 * @return {number} num converted to ppb
 * @description Converts microgramsPerGram to ppb
 */
function microgramsPerGramToPPB( num ) {
  return num * 1000;
}

/**
 * @param  {number} num number in nanogramPerGram to be converted
 * @return {number} num converted to ppb
 * @description Converts nanogramPerGram to ppb
 */
function nanogramPerGramToPPB( num ) {
  return num;
}

/**
 * @param  {number} num number in ppb to be converted
 * @param  {number} sigFigs number of signifcant figures in result
 * @return {number} num converted to weight percent
 * @description Converts ppb to weight percent
 */
function ppbToPercent( num, sigFigs ) {
  return parseFloat((num * (1 / 10000000)).toPrecision(sigFigs));
}

/**
 * @param  {number} num number in ppb to be converted
 * @param  {number} sigFigs number of signifcant figures in result
 * @return {number} num converted to ppm
 * @description Converts ppb to ppm
 */
function ppbToPPM( num, sigFigs ) {
  return parseFloat((num * (1 / 1000)).toPrecision(sigFigs));
}


module.exports = {
  percentToPPB,
  ppmToPPB,
  milligramsPerGramToPPB,
  microgramsPerGramToPPB,
  nanogramPerGramToPPB,
  ppbToPercent,
  ppbToPPM,
};

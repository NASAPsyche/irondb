
/**
 * @param  {string} num The number that you need the significant
 * figure of
 * @return {number}
 */
function getSigFig(num) {
  if (typeof num != 'string') return; // invalid
  if (isNaN(parseFloat(num))) return; // invalid
  if ((parseFloat(num)) == 0) return 0;
  const splitStr = num.split('.');
  // remove non numeric characters
  splitStr.forEach((value, i) =>{
    splitStr[i] = value.replace(/\D/g, '');
  });

  return (
    (typeof splitStr[1] == 'undefined') // if no decimals
    ? splitStr[0].length
    : splitStr[0].length + splitStr[1].length
  );
}


module.exports = {getSigFig};

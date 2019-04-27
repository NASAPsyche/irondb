module.exports = {
  ppbToPercent: ( num, sigFigs ) => {
    return parseFloat(num * (1 / 10000000)).toPrecision(sigFigs);
  },
  ppbToPPM: ( num, sigFigs ) => {
    return parseFloat(num * (1 / 1000)).toPrecision(sigFigs);
  },
  ppbToMilligramsPerGram: ( num, sigFigs ) => {
    return parseFloat(num * (1 / 1000000)).toPrecision(sigFigs);
  },
  ppbToMicrogramsPerGram: ( num, sigFigs ) => {
    return parseFloat(num * (1 / 1000)).toPrecision(sigFigs);
  },
};

module.exports = {
  ppbToPercent: ( num, sigFigs ) => {
    return (num * (1 / 10000000)).toPrecision(sigFigs);
  },
  ppbToPPM: ( num, sigFigs ) => {
    return (num * (1 / 1000)).toPrecision(sigFigs);
  },
};

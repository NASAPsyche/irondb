module.exports = {
  percentToPPB: function( num ) {
    return num * 10000000;
  },
  ppmToPPB: function( num ) {
    return num * 1000;
  },
  milligramsPerGramToPPB: function( num ) {
    return num * 1000000;
  },
  microgramsPerGramToPPB: function( num ) {
    return num * 1000;
  }
};

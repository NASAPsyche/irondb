const convert = require('../controller/utils/unit-conversion');

describe('Test percentToPPB function', () => {
  test('convert 7.5% to 75,000,000 ppb', () => {
    expect(convert.percentToPPB(7.5)).toBe(75000000);
  });
});

describe('Test ppmToPPB function', () => {
  test('convert 750 ppm to 750000 ppb', () => {
    expect(convert.ppmToPPB(750)).toBe(750000);
  });
});

describe('Test milligramsPerGramToPPB function', () => {
  test('convert 750 mg/g to 750000000 ppb', () => {
    expect(convert.milligramsPerGramToPPB(750)).toBe(750000000);
  });
});

describe('Test microgramsPerGramToPPB function', () => {
  test('convert 750 ug/g to 750000 ppb', () => {
    expect(convert.microgramsPerGramToPPB(750)).toBe(750000);
  });
});

describe('Test nanogramPerGramToPPB function', () => {
  test('convert 750 ng/g to 750 ppb', () => {
    expect(convert.nanogramPerGramToPPB(750)).toBe(750);
  });
});

describe('Test ppbToPercent function', () => {
  test('convert 44300000 ppb to 4.43 wt%', () => {
    expect(convert.ppbToPercent(44300000, 3)).toBe(4.43);
  });
});

describe('Test ppbToPPM function', () => {
  test('convert 5080000 ppb to 5080 ppm', () => {
    expect(convert.ppbToPPM(5080000, 3)).toBe(5080);
  });
});

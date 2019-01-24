const convert = require('../controller/utils/unit-conversion');

describe('Test percentToPPB function', () => {
  test('convert 7.5% to 75,000,000 ppb', () => {
    expect(convert.percentToPPB(7.5)).toBe(75000000);
  });
});

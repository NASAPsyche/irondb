/**
 * Tests for /controller/utils/sigfig which gets
 * the number of significant figures from a string
 * represenation of a number
 */

const sf = require('../controller/utils/sigfig');

describe('Test to get significant figures from numbers', () => {
  test('Positive integer', () => {
    expect(sf.getSigFig('123')).toBe(3);
  });
  test('Negative integer', () => {
    expect(sf.getSigFig('-100')).toBe(3);
  });
  test('Zero', () => {
    expect(sf.getSigFig('0')).toBe(0);
  });
  test('Positive trailing zeros', () => {
    expect(sf.getSigFig('1.10')).toBe(3);
  });
  test('Negative trailing zeros', () => {
    expect(sf.getSigFig('-1.10')).toBe(3);
  });
  test('Wrong type', () => {
    expect(sf.getSigFig(123)).toBe(undefined);
  });
  test('Invalid string', () => {
    expect(sf.getSigFig('a1.10')).toBe(undefined);
  });
  test('Junk trailing after numbers', () => {
    expect(sf.getSigFig('-1.01a')).toBe(3);
  });
});

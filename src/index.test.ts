import numericQuantity from '.';

it('works', () => {
  // Text
  expect(numericQuantity('NaN')).toBeNaN();
  expect(numericQuantity('NaN.25')).toBeNaN();
  expect(numericQuantity('NaN 1/4')).toBeNaN();
  expect(numericQuantity('')).toBeNaN();
  // Invalid numbers
  expect(numericQuantity('/1')).toBeNaN();
  expect(numericQuantity('/0')).toBeNaN();
  expect(numericQuantity('/0.5')).toBeNaN();
  expect(numericQuantity('0.0.0')).toBeNaN();
  // Whole numbers
  expect(numericQuantity('1')).toBe(1);
  expect(numericQuantity('-1')).toBe(-1);
  // TODO?: don't allow leading zeroes on whole numbers
  // expect(numericQuantity("010")).toBeNaN();
  expect(numericQuantity('100')).toBe(100);
  // Decimals
  expect(numericQuantity('.9')).toBe(0.9);
  expect(numericQuantity('1.1')).toBe(1.1);
  expect(numericQuantity('-1.1')).toBe(-1.1);
  // Halves
  expect(numericQuantity('1.51')).toBe(1.51);
  expect(numericQuantity('1 1/2')).toBe(1.5);
  expect(numericQuantity('-1 1/2')).toBe(-1.5);
  expect(numericQuantity('1.52')).toBe(1.52);
  // Thirds
  expect(numericQuantity('1.32')).toBe(1.32);
  expect(numericQuantity('1 1/3')).toBe(1.333);
  expect(numericQuantity('1.34')).toBe(1.34);
  expect(numericQuantity('1 2/3')).toBe(1.667);
  expect(numericQuantity('1.67')).toBe(1.67);
  // Quarters
  expect(numericQuantity('1 1/4')).toBe(1.25);
  expect(numericQuantity('1 3/4')).toBe(1.75);
  // Fifths
  expect(numericQuantity('1/5')).toBe(0.2);
  expect(numericQuantity('1 1/5')).toBe(1.2);
  expect(numericQuantity('2/5')).toBe(0.4);
  expect(numericQuantity('1 2/5')).toBe(1.4);
  expect(numericQuantity('3/5')).toBe(0.6);
  expect(numericQuantity('1 3/5')).toBe(1.6);
  expect(numericQuantity('4/5')).toBe(0.8);
  expect(numericQuantity('1 4/5')).toBe(1.8);
  // Unicode vulgar fractions
  expect(numericQuantity('\u00BC')).toBe(0.25); // 1/4
  expect(numericQuantity('-\u00BC')).toBe(-0.25); // -1/4
  expect(numericQuantity('\u00BD')).toBe(0.5); // 1/2
  expect(numericQuantity('\u00BE')).toBe(0.75); // 3/4
  expect(numericQuantity('\u2150')).toBe(0.143); // 1/7
  expect(numericQuantity('\u2151')).toBe(0.111); // 1/9
  expect(numericQuantity('\u2152')).toBe(0.1); // 1/10
  expect(numericQuantity('\u2153')).toBe(0.333); // 1/3
  expect(numericQuantity('\u2154')).toBe(0.667); // 2/3
  expect(numericQuantity('\u2155')).toBe(0.2); // 1/5
  expect(numericQuantity('\u2156')).toBe(0.4); // 2/5
  expect(numericQuantity('\u2157')).toBe(0.6); // 3/5
  expect(numericQuantity('\u2158')).toBe(0.8); // 4/5
  expect(numericQuantity('\u2159')).toBe(0.167); // 1/6
  expect(numericQuantity('\u215A')).toBe(0.833); // 5/6
  expect(numericQuantity('\u215B')).toBe(0.125); // 1/8
  expect(numericQuantity('\u215C')).toBe(0.375); // 3/8
  expect(numericQuantity('\u215D')).toBe(0.625); // 5/8
  expect(numericQuantity('\u215E')).toBe(0.875); // 7/8
  // Mixed unicode vulgar fraction
  expect(numericQuantity('2 \u2155')).toBe(2.2); // 2 1/5
  // Mixed unicode vulgar fraction - no space
  expect(numericQuantity('2\u2155')).toBe(2.2); // 2 1/5
});

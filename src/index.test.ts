import { numericQuantity } from '.';

const allTests: { title: string; tests: [string, number][] }[] = [
  {
    title: 'Non-numeric text',
    tests: [
      ['NaN', NaN],
      ['NaN.25', NaN],
      ['NaN 1/4', NaN],
      ['', NaN],
      ['   ', NaN],
    ],
  },
  {
    title: 'Invalid numbers',
    tests: [
      ['/1', NaN],
      ['/0', NaN],
      ['/0.5', NaN],
      ['0 . 0', NaN],
      ['0.0.0', NaN],
    ],
  },
  {
    title: 'Whole numbers',
    tests: [
      ['1', 1],
      ['-1', -1],
      ['010', 10],
      ['100', 100],
    ],
  },
  {
    title: 'Decimals',
    tests: [
      ['.9', 0.9],
      ['1.1', 1.1],
      ['01.1', 1.1],
      ['-1.1', -1.1],
    ],
  },
  {
    title: 'Acceptable white space',
    tests: [
      ['1 1/ 2', 1.5],
      ['1 1 /2', 1.5],
      ['1 1 / 2', 1.5],
      [' 1 1 / 2 ', 1.5],
      [' 1.5 ', 1.5],
    ],
  },
  {
    title: 'Leading zeroes',
    tests: [
      ['01', 1],
      ['01.010', 1.01],
      ['01 01/02', 1.5],
    ],
  },
  {
    title: 'Halves',
    tests: [
      ['1.51', 1.51],
      ['1 1/2', 1.5],
      ['-1 1/2', -1.5],
      ['1.52', 1.52],
    ],
  },
  {
    title: 'Thirds',
    tests: [
      ['1.32', 1.32],
      ['1 1/3', 1.333],
      ['1.34', 1.34],
      ['1 2/3', 1.667],
      ['1.67', 1.67],
    ],
  },
  {
    title: 'Quarters',
    tests: [
      ['1 1/4', 1.25],
      ['1 3/4', 1.75],
    ],
  },
  {
    title: 'Fifths',
    tests: [
      ['1/5', 0.2],
      ['1 1/5', 1.2],
      ['2/5', 0.4],
      ['1 2/5', 1.4],
      ['3/5', 0.6],
      ['1 3/5', 1.6],
      ['4/5', 0.8],
      ['1 4/5', 1.8],
    ],
  },
  {
    title: 'Unicode vulgar fractions',
    tests: [
      ['\u00BC', 0.25], // 1/4
      ['-\u00BC', -0.25], // -1/4
      ['\u00BD', 0.5], // 1/2
      ['\u00BE', 0.75], // 3/4
      ['\u2150', 0.143], // 1/7
      ['\u2151', 0.111], // 1/9
      ['\u2152', 0.1], // 1/10
      ['\u2153', 0.333], // 1/3
      ['\u2154', 0.667], // 2/3
      ['\u2155', 0.2], // 1/5
      ['\u2156', 0.4], // 2/5
      ['\u2157', 0.6], // 3/5
      ['\u2158', 0.8], // 4/5
      ['\u2159', 0.167], // 1/6
      ['\u215A', 0.833], // 5/6
      ['\u215B', 0.125], // 1/8
      ['\u215C', 0.375], // 3/8
      ['\u215D', 0.625], // 5/8
      ['\u215E', 0.875], // 7/8
    ],
  },
  {
    title: 'Mixed unicode vulgar fraction',
    tests: [
      ['2 \u2155', 2.2], // 2 1/5
    ],
  },
  {
    title: 'Mixed unicode vulgar fraction - no space',
    tests: [
      ['2\u2155', 2.2], // 2 1/5
    ],
  },
  {
    title: 'Unicode fraction slash',
    tests: [
      ['1⁄2', 0.5],
      ['2 1⁄2', 2.5],
    ],
  },
];

for (const { title, tests } of allTests) {
  it(title, () => {
    for (const [arg, expected] of tests) {
      if (isNaN(expected)) {
        expect(numericQuantity(arg)).toBeNaN();
      } else {
        expect(numericQuantity(arg)).toBe(expected);
      }
    }
  });
}

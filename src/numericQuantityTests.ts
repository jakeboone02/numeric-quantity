import { romanNumeralUnicodeToAsciiMap, romanNumeralValues } from './constants';
import { RomanNumeralUnicode } from './types';

export const numericQuantityTests: Record<string, [string | number, number][]> =
  {
    'Non-numeric stuff': [
      ['NaN', NaN],
      ['NaN.25', NaN],
      ['NaN 1/4', NaN],
      ['', NaN],
      ['   ', NaN],
      [{}, NaN],
      [() => {}, NaN],
      [[], NaN],
      [true, NaN],
      [undefined, NaN],
    ] as any,
    'Actual numbers': [
      [12, 12],
      [1.2, 1.2],
      [1 / 2, 0.5],
    ],
    'Invalid numbers': [
      ['/1', NaN],
      ['/0', NaN],
      ['1/0', Infinity],
      ['-1/0', -Infinity],
      ['/0.5', NaN],
      [',100', NaN],
      ['_100', NaN],
    ],
    'Whole numbers': [
      ['1', 1],
      ['-1', -1],
      ['012', 12],
      ['100', 100],
    ],
    Separators: [
      ['1,000', 1000],
      ['1,000,000', 1_000_000],
      ['1_000_000', 1_000_000],
      ['1,000_000', 1_000_000],
      ['10,00', 1000],
      ['10,00.10', 1000.1],
      ['-1,000', -1000],
      ['1_000', 1000],
      ['10_00', 1000],
      ['10_00.10', 1000.1],
      ['-1_000', -1000],
      ['1_1 1/2', 11.5],
      ['1,1 1/2', 11.5],
      // TODO: Should separators in the numerator be allowed?
      ['1_1/22', 0.5],
      ['1,1/22', 0.5],
    ],
    'Trailing invalid characters': [
      ['1 2 3', 1],
      ['.25 NaN', 0.25],
      ['-.25 NaN', -0.25],
      ['1.25 NaN', 1.25],
      ['-1.25 NaN', -1.25],
      ['1/2 NaN', 0.5],
      ['1/', 1],
      ['\u215F', 1],
      ['0 . 1', 0],
      ['0.1.2', 0.1],
      ['1.2,3', 1.2],
      ['1.2_3', 1.2],
      ['1/2,3', 0.5],
      ['1/2_3', 0.5],
      ['1 2/3,4', 1.667],
      ['1 2/3_4', 1.667],
      ['11 2_3/45', 11],
      ['11 2,3/45', 11],
    ],
    Decimals: [
      ['.9', 0.9],
      ['1.1', 1.1],
      ['01.1', 1.1],
      ['-1.1', -1.1],
    ],
    'Acceptable white space': [
      ['1 1/ 2', 1.5],
      ['1 1 /2', 1.5],
      ['1 1 / 2', 1.5],
      [' 1 1 / 2 ', 1.5],
      [' 1.5 ', 1.5],
    ],
    'Leading zeroes': [
      ['01', 1],
      ['01.010', 1.01],
      ['01 01/02', 1.5],
    ],
    Halves: [
      ['1.51', 1.51],
      ['1 1/2', 1.5],
      ['-1 1/2', -1.5],
      ['1.52', 1.52],
    ],
    Thirds: [
      ['1.32', 1.32],
      ['1 1/3', 1.333],
      ['1.34', 1.34],
      ['1 2/3', 1.667],
      ['1.67', 1.67],
    ],
    Quarters: [
      ['1 1/4', 1.25],
      ['1 3/4', 1.75],
    ],
    Fifths: [
      ['1/5', 0.2],
      ['1 1/5', 1.2],
      ['2/5', 0.4],
      ['1 2/5', 1.4],
      ['3/5', 0.6],
      ['1 3/5', 1.6],
      ['4/5', 0.8],
      ['1 4/5', 1.8],
    ],
    'Unicode vulgar fractions': [
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
      ['\u215F2', 0.5], // 1/2
      // Mixed unicode vulgar fractions
      ['2 \u2155', 2.2], // 2 1/5
      ['1 \u215F2', 1.5], // 1 1/2
      ['2\u2155', 2.2], // 2 1/5
      ['1\u215F2', 1.5], // 1 1/2
    ],
    'Unicode fraction slash': [
      ['1⁄2', 0.5],
      ['2 1⁄2', 2.5],
    ],
    'Roman numerals': [
      // Invalid
      ['-I', NaN],
      ['M M', NaN],
      ['MMMM', NaN],
      ['DD', NaN],
      ['CCCC', NaN],
      ['LL', NaN],
      ['XXXX', NaN],
      ['VV', NaN],
      ['IIII', NaN],
      ['IIV', NaN],
      ['IIX', NaN],
      ['XXL', NaN],
      ['XXC', NaN],
      ['CCD', NaN],
      ['CCM', NaN],
      // Miscellaneous
      ['MMII', 2002],
      ['MCMXCIX', 1999],
      ['MCMXCVIII', 1998],
      ['MCM', 1900],
      [' MCCXIV ', 1214],
      ['CMV', 905],
      ['XCV', 95],
      // Mixed case, mixed ASCII/Unicode
      ['MmⅪⅰ', 2012],
    ],
    'Automated Roman numeral tests (ASCII)': Object.entries(romanNumeralValues),
    'Automated Roman numeral tests (Unicode)': Object.entries(
      romanNumeralUnicodeToAsciiMap
    )
      // If XI and XII aren't in the romanNumeralValues map, filter them out:
      // .filter(entry => !['Ⅺ', 'Ⅻ', 'ⅺ', 'ⅻ'].includes(entry[0]))
      .map(
        ([unicodeChar, asciiSequence]) =>
          [
            unicodeChar as RomanNumeralUnicode,
            romanNumeralValues[asciiSequence],
          ] satisfies [RomanNumeralUnicode, number]
      ),
  };

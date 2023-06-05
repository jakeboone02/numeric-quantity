import { romanNumeralValues, romanNumeralUnicodeToAsciiMap } from './constants';
import { RomanNumeralUnicode } from './types';

export const numericQuantityTests: Record<string, [string, number][]> = {
  'Non-numeric text': [
    ['NaN', NaN],
    ['NaN.25', NaN],
    ['.25NaN', NaN],
    ['-.25NaN', NaN],
    ['0/1NaN', NaN],
    ['NaN 1/4', NaN],
    ['', NaN],
    ['   ', NaN],
  ],
  'Invalid numbers': [
    ['/1', NaN],
    ['/0', NaN],
    ['1/0', Infinity],
    ['-1/0', -Infinity],
    ['/0.5', NaN],
    ['1/', NaN],
    ['\u215F', NaN],
    ['0 . 0', NaN],
    ['0.0.0', NaN],
  ],
  'Whole numbers': [
    ['1', 1],
    ['-1', -1],
    ['010', 10],
    ['100', 100],
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
    ['MCM', 1900],
    ['MCMXCIX', 1999],
    [' MCCXIV ', 1214],
    ['MMII', 2002],
    // Unicode
    ['Ⅰ', 1],
    ['Ⅱ', 2],
    ['Ⅲ', 3],
    ['Ⅳ', 4],
    ['Ⅴ', 5],
    ['Ⅵ', 6],
    ['Ⅶ', 7],
    ['Ⅷ', 8],
    ['Ⅸ', 9],
    ['Ⅹ', 10],
    ['Ⅺ', 11],
    ['Ⅻ', 12],
    ['Ⅼ', 50],
    ['Ⅽ', 100],
    ['Ⅾ', 500],
    ['Ⅿ', 1000],
    ['ⅰ', 1],
    ['ⅱ', 2],
    ['ⅲ', 3],
    ['ⅳ', 4],
    ['ⅴ', 5],
    ['ⅵ', 6],
    ['ⅶ', 7],
    ['ⅷ', 8],
    ['ⅸ', 9],
    ['ⅹ', 10],
    ['ⅺ', 11],
    ['ⅻ', 12],
    ['ⅼ', 50],
    ['ⅽ', 100],
    ['ⅾ', 500],
    ['ⅿ', 1000],
    // ASCII
    ['I', 1],
    ['II', 2],
    ['III', 3],
    ['IV', 4],
    ['V', 5],
    ['VI', 6],
    ['VII', 7],
    ['VIII', 8],
    ['IX', 9],
    ['X', 10],
    ['XI', 11],
    ['XII', 12],
    ['L', 50],
    ['C', 100],
    ['D', 500],
    ['M', 1000],
    ['i', 1],
    ['ii', 2],
    ['iii', 3],
    ['iv', 4],
    ['v', 5],
    ['vi', 6],
    ['vii', 7],
    ['viii', 8],
    ['ix', 9],
    ['x', 10],
    ['xi', 11],
    ['xii', 12],
    ['l', 50],
    ['c', 100],
    ['d', 500],
    ['m', 1000],
    // Mixed case, mixed ASCII/Unicode
    ['MmⅪⅰ', 2012],
  ],
  'Automated tests': [
    // ASCII
    ...Object.entries(romanNumeralValues),
    // Unicode
    ...Object.entries(romanNumeralUnicodeToAsciiMap)
      // If XI and XII aren't in the romanNumeralValues map, filter them out:
      // .filter(entry => !['Ⅺ', 'Ⅻ', 'ⅺ', 'ⅻ'].includes(entry[0]))
      .map(
        entry =>
          [
            entry[0] as RomanNumeralUnicode,
            romanNumeralValues[entry[1]],
          ] satisfies [RomanNumeralUnicode, number]
      ),
  ],
};

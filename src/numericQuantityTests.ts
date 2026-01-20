import { romanNumeralUnicodeToAsciiMap, romanNumeralValues } from './constants';
import type { NumericQuantityOptions, RomanNumeralUnicode } from './types';

const allowTrailingInvalid = true;
const romanNumerals = true;

const noop = () => {};

export const numericQuantityTests: Record<
  string,
  (
    | [string | number, number]
    | [string | number, number, NumericQuantityOptions]
    | [
        string | number,
        number | bigint,
        NumericQuantityOptions & { bigIntOnOverflow: true },
      ]
  )[]
> = {
  'Non-numeric stuff': [
    ['NaN', NaN],
    ['NaN.25', NaN],
    ['NaN 1/4', NaN],
    ['', NaN],
    ['   ', NaN],
    [{} as any, NaN],
    [noop as any, NaN],
    [[] as any, NaN],
    [true as any, NaN],
    [undefined as any, NaN],
    [undefined as any, NaN, null as any],
  ],
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
    ['1', 1, null as any],
    ['1', 1, { allowTrailingInvalid: false }],
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
    ['1_1/22', 0.5],
    ['1,1/22', 0.5],
    ['11 1_1/2_2', 11.5],
    ['11 1,1/2,2', 11.5],
    ['1.2,3', 1.23],
    ['1.2_3', 1.23],
    ['1/2,3', 0.043],
    ['1/2_3', 0.043],
    ['1 2/3,4', 1.059],
    ['1 2/3_4', 1.059],
  ],
  // TODO: Add support for automatic decimal separator detection
  // 'Auto-detected decimal separator': [
  //   ['1.0,00', 10, { decimalSeparator: 'auto' }],
  //   ['1,00.0', 100, { decimalSeparator: 'auto' }],
  //   ['10.0,00.1', NaN, { decimalSeparator: 'auto' }],
  //   ['10,00.00,1', 1000.001, { decimalSeparator: 'auto' }],
  //   ['100,100', 100.1, { decimalSeparator: 'auto' }],
  //   ['100,1000', 100.1, { decimalSeparator: 'auto' }],
  //   ['1000,100', 1000.1, { decimalSeparator: 'auto' }],
  //   ['1000,1', 1000.1, { decimalSeparator: 'auto' }],
  // ],
  'Comma as decimal separator': [
    ['1.0,00', 10, { decimalSeparator: ',' }],
    ['1,00.0', 1, { decimalSeparator: ',' }],
    ['1.00.0', 1000, { decimalSeparator: ',' }],
    ['1,000,001', NaN, { decimalSeparator: ',' }],
    ['1,000,001', 1, { decimalSeparator: ',', allowTrailingInvalid }],
    ['1,00.1', 1.001, { decimalSeparator: ',', allowTrailingInvalid }],
    ['10.0,00.0', 100, { decimalSeparator: ',' }],
    ['10,00.00,0', NaN, { decimalSeparator: ',' }],
    ['10,00.00,0', 10, { decimalSeparator: ',', allowTrailingInvalid }],
    ['100,100', 100.1, { decimalSeparator: ',' }],
    ['100,1000', 100.1, { decimalSeparator: ',' }],
    ['1000,100', 1000.1, { decimalSeparator: ',' }],
    ['1000,1', 1000.1, { decimalSeparator: ',' }],
    ['1_.0,00', NaN, { decimalSeparator: ',' }],
    ['1_,00.0', NaN, { decimalSeparator: ',' }],
    ['1_.00.0', NaN, { decimalSeparator: ',' }],
    ['1_,000,001', NaN, { decimalSeparator: ',' }],
    ['1_,000,001', 1, { decimalSeparator: ',', allowTrailingInvalid }],
    ['1_,00.1', 1, { decimalSeparator: ',', allowTrailingInvalid }],
    ['1_0.0,00.0', 100, { decimalSeparator: ',' }],
    ['1_0,00.00,0', NaN, { decimalSeparator: ',' }],
    ['1_0,00.00,0', 10, { decimalSeparator: ',', allowTrailingInvalid }],
    ['1_00,100', 100.1, { decimalSeparator: ',' }],
    ['1_00,1000', 100.1, { decimalSeparator: ',' }],
    ['1_000,100', 1000.1, { decimalSeparator: ',' }],
    ['1_000,1', 1000.1, { decimalSeparator: ',' }],
  ],
  'Invalid/repeated/ignored separators': [
    ['_11 11/22', NaN],
    [',11 11/22', NaN],
    ['11 _11/22', NaN],
    ['11 ,11/22', NaN],
    ['11 11/_22', NaN],
    ['11 11/,22', NaN],
    ['11_ 11/22', NaN],
    ['11, 11/22', NaN],
    ['11 11_/22', NaN],
    ['11 11,/22', NaN],
    ['11 11/22_', NaN],
    ['11 11/22,', NaN],
    ['11__22', NaN],
    ['11,,22', NaN],
    ['11,_22', NaN],
    ['11,_22', NaN],
    ['11 _11/22', 11, { allowTrailingInvalid }],
    ['11 ,11/22', 11, { allowTrailingInvalid }],
    ['11 11/_22', 11, { allowTrailingInvalid }],
    ['11 11/,22', 11, { allowTrailingInvalid }],
    ['11_ 11/22', 11, { allowTrailingInvalid }],
    ['11, 11/22', 11, { allowTrailingInvalid }],
    ['11 11_/22', 11, { allowTrailingInvalid }],
    ['11 11,/22', 11, { allowTrailingInvalid }],
    ['11 11/22_', 11.5, { allowTrailingInvalid }],
    ['11 11/22,', 11.5, { allowTrailingInvalid }],
    ['11__22', 11, { allowTrailingInvalid }],
    ['11,,22', 11, { allowTrailingInvalid }],
    ['11,_22', 11, { allowTrailingInvalid }],
    ['11,_22', 11, { allowTrailingInvalid }],
  ],
  'Trailing invalid characters': [
    ['1 2 3', 1, { allowTrailingInvalid }],
    ['.25 NaN', 0.25, { allowTrailingInvalid }],
    ['-.25 NaN', -0.25, { allowTrailingInvalid }],
    ['1.25 NaN', 1.25, { allowTrailingInvalid }],
    ['-1.25 NaN', -1.25, { allowTrailingInvalid }],
    ['1/2 NaN', 0.5, { allowTrailingInvalid }],
    ['1/', 1, { allowTrailingInvalid }],
    ['\u215F', 1, { allowTrailingInvalid }],
    ['0 . 1', 0, { allowTrailingInvalid }],
    ['0.1.2', 0.1, { allowTrailingInvalid }],
    ['1 2 3', NaN],
    ['.25 NaN', NaN],
    ['-.25 NaN', NaN],
    ['1.25 NaN', NaN],
    ['-1.25 NaN', NaN],
    ['1/2 NaN', NaN],
    ['1/', NaN],
    ['\u215F', NaN],
    ['0 . 1', NaN],
    ['0.1.2', NaN],
  ],
  Decimals: [
    ['.9', 0.9],
    ['1.1', 1.1],
    ['01.1', 1.1],
    ['-1.1', -1.1],
  ],
  Exponents: [
    ['.9e2', 90],
    ['1.1e2', 110],
    ['01.1e2', 110],
    ['-1.1e-2', -0.011],
  ],
  Rounding: [
    ['1.23456789', 1.23456789, { round: false }],
    ['1 / 2345', 1 / 2345, { round: false }],
    ['1 2/345', 1 + 2 / 345, { round: false }],
    ['0.12345', 0.1235, { round: 4 }],
    ['0.12345', 0.123, null as any],
    ['1.2345e-2', 0.01, { round: 2 }],
    ['111.2345', 111, { round: 0 }],
    ['111.2345e-2', 1, { round: 0 }],
    ['123.456789', 123, { round: -4 }],
    ['123.456789', 123.4568, { round: 4.8 }],
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
  BigInts: [
    ['9007199254740992', 9007199254740992n, { bigIntOnOverflow: true }],
    ['-9007199254740992', -9007199254740992n, { bigIntOnOverflow: true }],
    ['123', 123, { bigIntOnOverflow: true }],
    ['-123', -123, { bigIntOnOverflow: true }],
  ],
  'Roman numerals': (
    [
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
    ] as const
  ).map(t => [t[0], t[1], { romanNumerals }]),
  'Automated Roman numeral tests (ASCII)': Object.entries(
    romanNumeralValues
  ).map(t => [t[0], t[1], { romanNumerals }]),
  'Automated invalid Roman numeral tests (ASCII)': Object.entries(
    romanNumeralValues
  ).map(t => [t[0], NaN, { romanNumerals: false }]),
  'Automated Roman numeral tests (Unicode)': Object.entries(
    romanNumeralUnicodeToAsciiMap
  )
    // If 'XI' and 'XII' were not in `romanNumeralValues`, we would need to
    // filter out their Unicode counterparts like this:
    // .filter(entry => !['Ⅺ', 'Ⅻ', 'ⅺ', 'ⅻ'].includes(entry[0]))
    .map(
      ([unicodeChar, asciiSequence]) =>
        [
          unicodeChar as RomanNumeralUnicode,
          romanNumeralValues[asciiSequence]!,
          { romanNumerals },
        ] satisfies [RomanNumeralUnicode, number, NumericQuantityOptions]
    ),
  'Automated invalid Roman numeral tests (Unicode)': Object.entries(
    romanNumeralUnicodeToAsciiMap
  ).map(
    ([unicodeChar]) =>
      [
        unicodeChar as RomanNumeralUnicode,
        NaN,
        { romanNumerals: false },
      ] satisfies [RomanNumeralUnicode, number, NumericQuantityOptions]
  ),
};

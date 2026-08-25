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
    | [string | number, number | bigint, NumericQuantityOptions & { bigIntOnOverflow: true }]
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
  'Leading + sign': [
    ['+1', 1],
    ['+1.5', 1.5],
    ['+1/2', 0.5],
    ['+1 1/2', 1.5],
    ['+.5', 0.5],
    ['+1,000', 1000],
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
    // Absurdly large `round` values: the rounding factor overflows to `Infinity`,
    // so no rounding is applied (rounding to >308 decimals is a no-op for a double)
    ['1.23456789', 1.23456789, { round: 1e21 }],
    ['1.23456789', 1.23456789, { round: 400 }],
    ['1 / 2345', 1 / 2345, { round: 1e21 }],
    ['1 2/345', 1 + 2 / 345, { round: 400 }],
    // Factor is finite but scaling the value overflows; falls back to the unrounded value
    ['1.5e300', 1.5e300, { round: 308 }],
  ],
  'Non-finite round values': [
    // Non-finite values are treated as `false` (no rounding)
    ['1.23456789', 1.23456789, { round: NaN }],
    ['1.23456789', 1.23456789, { round: Infinity }],
    ['1.23456789', 1.23456789, { round: -Infinity }],
    ['1 / 2345', 1 / 2345, { round: NaN }],
    ['1 2/345', 1 + 2 / 345, { round: NaN }],
    // Negative (finite) values still clamp to 0
    ['123.456789', 123, { round: -1 }],
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
  'Vulgar fraction edge cases': [
    ['1}', NaN],
    ['}', NaN],
    ['1}', 1, { allowTrailingInvalid }],
    ['1} 1/2', 1, { allowTrailingInvalid }],
    ['½}', 0.5, { allowTrailingInvalid }],
  ],
  'Unicode fraction slash': [
    ['1⁄2', 0.5],
    ['2 1⁄2', 2.5],
  ],
  'Unicode superscript/subscript fractions': [
    ['¹⁄₂', 0.5],
    ['1 ¹⁄₂', 1.5],
    ['¹¹⁄₁₆', 0.688],
    ['2 ³⁄₈', 2.375],
    ['-¹⁄₂', -0.5],
  ],
  BigInts: [
    ['9007199254740992', 9007199254740992n, { bigIntOnOverflow: true }],
    ['-9007199254740992', -9007199254740992n, { bigIntOnOverflow: true }],
    ['123', 123, { bigIntOnOverflow: true }],
    ['-123', -123, { bigIntOnOverflow: true }],
  ],
  'BigInt with non-integers': [
    // Fractional tails round half-up (half away from zero for negatives)
    ['9007199254740993.5', 9007199254740994n, { bigIntOnOverflow: true }],
    ['9007199254740993.4', 9007199254740993n, { bigIntOnOverflow: true }],
    ['-9007199254740993.5', -9007199254740994n, { bigIntOnOverflow: true }],
    // Positive exponents are exact; no rounding involved
    ['9007199254740993e1', 90071992547409930n, { bigIntOnOverflow: true }],
    // Negative exponents are a denominator factor
    ['900719925474099300e-1', 90071992547409930n, { bigIntOnOverflow: true }],
    ['90071992547409935e-1', 9007199254740994n, { bigIntOnOverflow: true }],
    ['9007199254740993 1/2', 9007199254740994n, { bigIntOnOverflow: true }],
    ['9007199254740993 1/3', 9007199254740993n, { bigIntOnOverflow: true }],
    // Pure fractions participate on the same rational path
    ['90071992547409930/2', 45035996273704965n, { bigIntOnOverflow: true }],
    ['90071992547409930/ 4', 22517998136852483n, { bigIntOnOverflow: true }],
    ['90071992547409930/10000', 9007199254740.994, { bigIntOnOverflow: true }],
    // Rounding can push a non-overflowing integer part into overflow
    ['9007199254740991.6', 9007199254740992n, { bigIntOnOverflow: true }],
    // `round` is not consulted for bigint results
    ['9007199254740993.5', 9007199254740994n, { bigIntOnOverflow: true, round: false }],
    ['9007199254740993.5', 9007199254740994n, { bigIntOnOverflow: true, round: 0 }],
    ['9007199254740993.5', 9007199254740994n, { bigIntOnOverflow: true, round: 4 }],
    // Zero denominators fall through to the `number` path
    ['9007199254740993 1/0', Infinity, { bigIntOnOverflow: true }],
    // Leading-decimal scientific notation still gets exact evaluation
    ['.1e17', 10000000000000000n, { bigIntOnOverflow: true }],
    ['-.1e17', -10000000000000000n, { bigIntOnOverflow: true }],
    // No overflow: untouched by the bigint path
    ['1.5', 1.5, { bigIntOnOverflow: true }],
    ['.1e15', 100000000000000, { bigIntOnOverflow: true }],
    ['9007199254740993.5', 9007199254740992, { round: false }],
  ],
  'BigInt percentages': [
    // No overflow, so the (lossy) `number` path handles it
    ['9007199254740993%', 90071992547409.92, { bigIntOnOverflow: true, percentage: 'decimal' }],
    ['900719925474099300%', 9007199254740993n, { bigIntOnOverflow: true, percentage: 'decimal' }],
    ['900719925474099399%', 9007199254740994n, { bigIntOnOverflow: true, percentage: 'decimal' }],
    ['900719925474099350%', 9007199254740994n, { bigIntOnOverflow: true, percentage: 'decimal' }],
    [
      '900719925474099300001%',
      9007199254740993000n,
      { bigIntOnOverflow: true, percentage: 'decimal' },
    ],
    ['-900719925474099350%', -9007199254740994n, { bigIntOnOverflow: true, percentage: 'decimal' }],
    // `percentage: 'number'` contributes no denominator factor
    ['9007199254740993%', 9007199254740993n, { bigIntOnOverflow: true, percentage: 'number' }],
    ['900719925474099300%', 900719925474099300n, { bigIntOnOverflow: true, percentage: 'number' }],
    ['900719925474099399%', 900719925474099399n, { bigIntOnOverflow: true, percentage: 'number' }],
    [
      '900719925474099300001%',
      900719925474099300001n,
      { bigIntOnOverflow: true, percentage: 'number' },
    ],
    [
      '-900719925474099350%',
      -900719925474099350n,
      { bigIntOnOverflow: true, percentage: 'number' },
    ],
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
  'Automated Roman numeral tests (ASCII)': Object.entries(romanNumeralValues).map(t => [
    t[0],
    t[1],
    { romanNumerals },
  ]),
  'Automated invalid Roman numeral tests (ASCII)': Object.entries(romanNumeralValues).map(t => [
    t[0],
    NaN,
    { romanNumerals: false },
  ]),
  'Automated Roman numeral tests (Unicode)': Object.entries(romanNumeralUnicodeToAsciiMap)
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
      [unicodeChar as RomanNumeralUnicode, NaN, { romanNumerals: false }] satisfies [
        RomanNumeralUnicode,
        number,
        NumericQuantityOptions,
      ]
  ),
  'Non-ASCII numeral systems': [
    // Arabic-Indic (U+0660–U+0669)
    ['٠', 0],
    ['٣', 3],
    ['١٢٣', 123],
    ['٣ ١/٢', 3.5],
    ['١.٥', 1.5],
    ['-٣', -3],
    // Extended Arabic-Indic / Persian (U+06F0–U+06F9)
    ['۰', 0],
    ['۲', 2],
    ['۱۲۳', 123],
    ['۲ ۱/۲', 2.5],
    // Devanagari (U+0966–U+096F)
    ['०', 0],
    ['२', 2],
    ['१२३', 123],
    ['२ १/२', 2.5],
    // Bengali (U+09E6–U+09EF)
    ['০', 0],
    ['৩', 3],
    ['১২৩', 123],
    ['৩ ১/২', 3.5],
    // Fullwidth (U+FF10–U+FF19)
    ['０', 0],
    ['２', 2],
    ['１２３', 123],
    ['２ １/２', 2.5],
    ['１.５', 1.5],
    // Thai (U+0E50–U+0E59)
    ['๐', 0],
    ['๓', 3],
    ['๑๒๓', 123],
    // Mixed ASCII and non-ASCII
    ['1٢3', 123],
    ['1 ٢/٤', 1.5],
    // Balinese (U+1B50-U+1B59)
    ['᭑', 1],
    ['᭑᭒᭓', 123],
  ],
  'Percentage parsing': [
    // Without option - should fail
    ['50%', NaN],
    ['50%', NaN, { percentage: false }],
    // With 'decimal' option (divide by 100)
    ['50%', 0.5, { percentage: 'decimal' }],
    ['100%', 1, { percentage: 'decimal' }],
    ['0.5%', 0.005, { percentage: 'decimal' }],
    ['1/2%', 0.005, { percentage: 'decimal' }],
    ['½%', 0.005, { percentage: 'decimal' }],
    ['-50%', -0.5, { percentage: 'decimal' }],
    ['1 1/2%', 0.015, { percentage: 'decimal' }],
    // With true (same as 'decimal')
    ['50%', 0.5, { percentage: true }],
    ['25%', 0.25, { percentage: true }],
    // With 'number' option (keep value)
    ['50%', 50, { percentage: 'number' }],
    ['100%', 100, { percentage: 'number' }],
    ['0.5%', 0.5, { percentage: 'number' }],
    ['1/2%', 0.5, { percentage: 'number' }],
    ['-50%', -50, { percentage: 'number' }],
    // Roman numerals with percentage
    ['L%', 0.5, { percentage: 'decimal', romanNumerals: true }],
    ['L%', 50, { percentage: 'number', romanNumerals: true }],
    ['MCMXCIX%', 19.99, { percentage: 'decimal', romanNumerals: true }],
    ['I%', 0.01, { percentage: 'decimal', romanNumerals: true }],
    ['I%', 0.01, { percentage: 'decimal', romanNumerals: true, round: 0 }],
    ['$L%', 0.5, { allowCurrency: true, percentage: 'decimal', romanNumerals: true }],
    // Without % symbol - should work normally
    ['50', 50, { percentage: 'decimal' }],
  ],
  'Percentage rounding': [
    // `round` applies to the value as written, before percentage division, on every path
    ['1%', 0.01, { percentage: 'decimal', round: 0 }],
    ['1.0%', 0.01, { percentage: 'decimal', round: 0 }],
    ['1/1%', 0.01, { percentage: 'decimal', round: 0 }],
    ['1%', 0.01, { percentage: 'decimal', round: 3 }],
    ['1.0%', 0.01, { percentage: 'decimal', round: 3 }],
    ['1/1%', 0.01, { percentage: 'decimal', round: 3 }],
    ['1%', 0.01, { percentage: 'decimal', round: false }],
    ['1.0%', 0.01, { percentage: 'decimal', round: false }],
    ['1/1%', 0.01, { percentage: 'decimal', round: false }],
    // Precision is no longer destroyed by re-rounding after the division
    ['12.345%', 0.12345, { percentage: 'decimal', round: 3 }],
    ['1/3%', 0.00333, { percentage: 'decimal', round: 3 }],
    // 0.667 / 100 is not exactly representable
    ['2/3%', 0.006670000000000001, { percentage: 'decimal', round: 3 }],
    ['12345%', 123.45, { percentage: 'decimal', round: 3 }],
    // The non-dividing path is untouched
    ['12.345%', 12.345, { percentage: 'number', round: 3 }],
  ],
  'Currency stripping': [
    // Without option - should fail
    ['$100', NaN],
    ['€100', NaN],
    ['100€', NaN],
    // With allowCurrency option
    ['$100', 100, { allowCurrency: true }],
    ['€100', 100, { allowCurrency: true }],
    ['£100', 100, { allowCurrency: true }],
    ['¥100', 100, { allowCurrency: true }],
    ['₹100', 100, { allowCurrency: true }],
    ['₽100', 100, { allowCurrency: true }],
    ['₿100', 100, { allowCurrency: true }],
    ['₩100', 100, { allowCurrency: true }],
    // Suffix position
    ['100€', 100, { allowCurrency: true }],
    ['100£', 100, { allowCurrency: true }],
    // With decimals
    ['$100.50', 100.5, { allowCurrency: true }],
    ['€1,000', 1000, { allowCurrency: true }],
    // Negative
    ['-$100', -100, { allowCurrency: true }],
    // Positive with + sign
    ['+$100', 100, { allowCurrency: true }],
    // Multiple currency symbols
    ['$$100', 100, { allowCurrency: true }],
    // Currency + percentage combined
    ['$50%', 0.5, { allowCurrency: true, percentage: 'decimal' }],
    ['50%€', 0.5, { allowCurrency: true, percentage: 'decimal' }],
    // With spaces
    ['$ 100', 100, { allowCurrency: true }],
    ['100 €', 100, { allowCurrency: true }],
  ],
  'Currency/percentage affix ordering': [
    ['100€%', 1, { allowCurrency: true, percentage: 'decimal' }],
    ['50%€', 0.5, { allowCurrency: true, percentage: 'decimal' }],
    ['€50%', 0.5, { allowCurrency: true, percentage: 'decimal' }],
    ['$50%', 0.5, { allowCurrency: true, percentage: 'decimal' }],
    ['50%$', 0.5, { allowCurrency: true, percentage: 'decimal' }],
    ['100 € %', 1, { allowCurrency: true, percentage: 'decimal' }],
    ['€ 100 %', 1, { allowCurrency: true, percentage: 'decimal' }],
    ['100€%', 100, { allowCurrency: true, percentage: 'number' }],
    ['-100€%', -1, { allowCurrency: true, percentage: 'decimal' }],
    // At most one `%` is stripped
    ['50%%', NaN, { percentage: 'decimal' }],
    ['50%€%', NaN, { allowCurrency: true, percentage: 'decimal' }],
    // Currency without the option is still invalid
    ['100€%', NaN, { percentage: 'decimal' }],
  ],
};

import type {
  RomanNumeral,
  RomanNumeralAscii,
  RomanNumeralUnicode,
  VulgarFraction,
} from './types';

// #region Arabic numerals
/**
 * Map of Unicode fraction code points to their ASCII equivalents
 */
export const vulgarFractionToAsciiMap: Record<VulgarFraction, string> = {
  '¼': '1/4',
  '½': '1/2',
  '¾': '3/4',
  '⅐': '1/7',
  '⅑': '1/9',
  '⅒': '1/10',
  '⅓': '1/3',
  '⅔': '2/3',
  '⅕': '1/5',
  '⅖': '2/5',
  '⅗': '3/5',
  '⅘': '4/5',
  '⅙': '1/6',
  '⅚': '5/6',
  '⅛': '1/8',
  '⅜': '3/8',
  '⅝': '5/8',
  '⅞': '7/8',
  '⅟': '1/',
};

/**
 * Captures the individual elements of a numeric string.
 *
 * Capture groups:
 *
 *     +=====+====================+========================+
 *     |  #  |    Description     |        Example         |
 *     +=====+====================+========================+
 *     |  0  |  entire string     |  "2 1/3" from "2 1/3"  |
 *     +-----+--------------------+------------------------+
 *     |  1  |  "negative" dash   |  "-" from "-2 1/3"     |
 *     +-----+--------------------+------------------------+
 *     |  2  |  the whole number  |  "2" from "2 1/3"      |
 *     |     |  - OR -            |                        |
 *     |     |  the numerator     |  "1" from "1/3"        |
 *     +-----+--------------------+------------------------+
 *     |  3  |  entire fraction   |  "1/3" from "2 1/3"    |
 *     |     |  - OR -            |                        |
 *     |     |  decimal portion   |  ".33" from "2.33"     |
 *     |     |  - OR -            |                        |
 *     |     |  denominator       |  "/3" from "1/3"       |
 *     +=====+====================+========================+
 *
 * @example
 *     numericRegex.exec("1")     // [ "1",     "1", null,   null ]
 *     numericRegex.exec("1.23")  // [ "1.23",  "1", ".23",  null ]
 *     numericRegex.exec("1 2/3") // [ "1 2/3", "1", " 2/3", " 2" ]
 *     numericRegex.exec("2/3")   // [ "2/3",   "2", "/3",   null ]
 *     numericRegex.exec("2 / 3") // [ "2 / 3", "2", "/ 3",  null ]
 */
export const numericRegex = /^(-)?\s*(\d*)(\.\d+|(\s+\d*\s*)?\s*\/\s*\d+)?\s*$/;

/**
 * Captures any Unicode vulgar fractions
 */
export const vulgarFractionsRegex = new RegExp(
  `(${Object.keys(vulgarFractionToAsciiMap).join('|')})`
);
// #endregion

// #region Roman numerals
type RomanNumeralSequenceFragment =
  | `${RomanNumeralAscii}`
  | `${RomanNumeralAscii}${RomanNumeralAscii}`
  | `${RomanNumeralAscii}${RomanNumeralAscii}${RomanNumeralAscii}`
  | `${RomanNumeralAscii}${RomanNumeralAscii}${RomanNumeralAscii}${RomanNumeralAscii}`;

export const romanNumeralValues = {
  MMM: 3000,
  MM: 2000,
  M: 1000,
  CM: 900,
  DCCC: 800,
  DCC: 700,
  DC: 600,
  D: 500,
  CD: 400,
  CCC: 300,
  CC: 200,
  C: 100,
  XC: 90,
  LXXX: 80,
  LXX: 70,
  LX: 60,
  L: 50,
  XL: 40,
  XXX: 30,
  XX: 20,
  XII: 12, // only here for tests; not used in practice
  XI: 11, // only here for tests; not used in practice
  X: 10,
  IX: 9,
  VIII: 8,
  VII: 7,
  VI: 6,
  V: 5,
  IV: 4,
  III: 3,
  II: 2,
  I: 1,
} satisfies { [k in RomanNumeralSequenceFragment]?: number };

/**
 * Map of Unicode Roman numeral code points to their ASCII equivalents
 */
export const romanNumeralUnicodeToAsciiMap: Record<
  RomanNumeralUnicode,
  string
> = {
  Ⅰ: 'I', // Roman Numeral One (U+2160)
  Ⅱ: 'II', // Roman Numeral Two (U+2161)
  Ⅲ: 'III', // Roman Numeral Three (U+2162)
  Ⅳ: 'IV', // Roman Numeral Four (U+2163)
  Ⅴ: 'V', // Roman Numeral Five (U+2164)
  Ⅵ: 'VI', // Roman Numeral Six (U+2165)
  Ⅶ: 'VII', // Roman Numeral Seven (U+2166)
  Ⅷ: 'VIII', // Roman Numeral Eight (U+2167)
  Ⅸ: 'IX', // Roman Numeral Nine (U+2168)
  Ⅹ: 'X', // Roman Numeral Ten (U+2169)
  Ⅺ: 'XI', // Roman Numeral Eleven (U+216A)
  Ⅻ: 'XII', // Roman Numeral Twelve (U+216B)
  Ⅼ: 'L', // Roman Numeral Fifty (U+216C)
  Ⅽ: 'C', // Roman Numeral One Hundred (U+216D)
  Ⅾ: 'D', // Roman Numeral Five Hundred (U+216E)
  Ⅿ: 'M', // Roman Numeral One Thousand (U+216F)
  ⅰ: 'I', // Small Roman Numeral One (U+2170)
  ⅱ: 'II', // Small Roman Numeral Two (U+2171)
  ⅲ: 'III', // Small Roman Numeral Three (U+2172)
  ⅳ: 'IV', // Small Roman Numeral Four (U+2173)
  ⅴ: 'V', // Small Roman Numeral Five (U+2174)
  ⅵ: 'VI', // Small Roman Numeral Six (U+2175)
  ⅶ: 'VII', // Small Roman Numeral Seven (U+2176)
  ⅷ: 'VIII', // Small Roman Numeral Eight (U+2177)
  ⅸ: 'IX', // Small Roman Numeral Nine (U+2178)
  ⅹ: 'X', // Small Roman Numeral Ten (U+2179)
  ⅺ: 'XI', // Small Roman Numeral Eleven (U+217A)
  ⅻ: 'XII', // Small Roman Numeral Twelve (U+217B)
  ⅼ: 'L', // Small Roman Numeral Fifty (U+217C)
  ⅽ: 'C', // Small Roman Numeral One Hundred (U+217D)
  ⅾ: 'D', // Small Roman Numeral Five Hundred (U+217E)
  ⅿ: 'M', // Small Roman Numeral One Thousand (U+217F)
};

/**
 * Captures all Unicode Roman numeral code points
 */
export const romanNumeralUnicodeRegex = new RegExp(
  `(${Object.keys(romanNumeralUnicodeToAsciiMap).join('|')})`,
  'gi'
);

/**
 * Captures a valid Roman numeral sequence
 *
 * Capture groups:
 *
 *     +=====+=================+==========================+
 *     |  #  |   Description   |         Example          |
 *     +=====+=================+==========================+
 *     |  0  |  Entire string  |  "MCCXIV" from "MCCXIV"  |
 *     +-----+-----------------+--------------------------+
 *     |  1  |  Thousands      |  "M" from "MCCXIV"       |
 *     +-----+-----------------+--------------------------+
 *     |  2  |  Hundreds       |  "CC" from "MCCXIV"      |
 *     +-----+-----------------+--------------------------+
 *     |  3  |  Tens           |  "X" from "MCCXIV"       |
 *     +-----+-----------------+--------------------------+
 *     |  4  |  Ones           |  "IV" from "MCCXIV"      |
 *     +=====+=================+==========================+
 *
 * @example
 *     romanNumeralRegex.exec("M")      // [      "M", "M",   "",  "",   "" ]
 *     romanNumeralRegex.exec("XII")    // [    "XII",  "",   "", "X", "II" ]
 *     romanNumeralRegex.exec("MCCXIV") // [ "MCCXIV", "M", "CC", "X", "IV" ]
 */
export const romanNumeralRegex =
  /^(?=[MDCLXVI])(M{0,3})(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$/i;
// #endregion

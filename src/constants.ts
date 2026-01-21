import type {
  NumericQuantityOptions,
  RomanNumeralAscii,
  RomanNumeralUnicode,
  VulgarFraction,
} from './types';

// #region Arabic numerals
/**
 * Map of Unicode fraction code points to their ASCII equivalents.
 */
export const vulgarFractionToAsciiMap: Record<
  VulgarFraction,
  `${number}/${number | ''}`
> = {
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
} as const;

/**
 * Captures the individual elements of a numeric string. Commas and underscores are allowed
 * as separators, as long as they appear between digits and are not consecutive.
 *
 * Capture groups:
 *
 * |  #  |    Description                                   |        Example(s)                                                   |
 * | --- | ------------------------------------------------ | ------------------------------------------------------------------- |
 * | `0` | entire string                                    | `"2 1/3"` from `"2 1/3"`                                            |
 * | `1` | "negative" dash                                  | `"-"` from `"-2 1/3"`                                               |
 * | `2` | whole number or numerator                        | `"2"` from `"2 1/3"`; `"1"` from `"1/3"`                            |
 * | `3` | entire fraction, decimal portion, or denominator | `" 1/3"` from `"2 1/3"`; `".33"` from `"2.33"`; `"/3"` from `"1/3"` |
 *
 * _Capture group 2 may include comma/underscore separators._
 *
 * @example
 *
 * ```ts
 * numericRegex.exec("1")     // [ "1",     "1", null,   null ]
 * numericRegex.exec("1.23")  // [ "1.23",  "1", ".23",  null ]
 * numericRegex.exec("1 2/3") // [ "1 2/3", "1", " 2/3", " 2" ]
 * numericRegex.exec("2/3")   // [ "2/3",   "2", "/3",   null ]
 * numericRegex.exec("2 / 3") // [ "2 / 3", "2", "/ 3",  null ]
 * ```
 */
export const numericRegex: RegExp =
  /^(?=-?\s*\.\d|-?\s*\d)(-)?\s*((?:\d(?:[,_]\d|\d)*)*)(([eE][+-]?\d(?:[,_]\d|\d)*)?|\.\d(?:[,_]\d|\d)*([eE][+-]?\d(?:[,_]\d|\d)*)?|(\s+\d(?:[,_]\d|\d)*\s*)?\s*\/\s*\d(?:[,_]\d|\d)*)?$/;
/**
 * Same as {@link numericRegex}, but allows (and ignores) trailing invalid characters.
 */
export const numericRegexWithTrailingInvalid: RegExp =
  /^(?=-?\s*\.\d|-?\s*\d)(-)?\s*((?:\d(?:[,_]\d|\d)*)*)(([eE][+-]?\d(?:[,_]\d|\d)*)?|\.\d(?:[,_]\d|\d)*([eE][+-]?\d(?:[,_]\d|\d)*)?|(\s+\d(?:[,_]\d|\d)*\s*)?\s*\/\s*\d(?:[,_]\d|\d)*)?(?:\s*[^.\d/].*)?/;

/**
 * Captures any Unicode vulgar fractions.
 */
export const vulgarFractionsRegex: RegExp = /([¼½¾⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞⅟}])/g;
// #endregion

// #region Roman numerals
type RomanNumeralSequenceFragment =
  | `${RomanNumeralAscii}`
  | `${RomanNumeralAscii}${RomanNumeralAscii}`
  | `${RomanNumeralAscii}${RomanNumeralAscii}${RomanNumeralAscii}`
  | `${RomanNumeralAscii}${RomanNumeralAscii}${RomanNumeralAscii}${RomanNumeralAscii}`;

/**
 * Map of Roman numeral sequences to their decimal equivalents.
 */
export const romanNumeralValues: {
  [k in RomanNumeralSequenceFragment]?: number;
} = {
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
} as const;

/**
 * Map of Unicode Roman numeral code points to their ASCII equivalents.
 */
export const romanNumeralUnicodeToAsciiMap: Record<
  RomanNumeralUnicode,
  keyof typeof romanNumeralValues
> = {
  // Roman Numeral One (U+2160)
  Ⅰ: 'I',
  // Roman Numeral Two (U+2161)
  Ⅱ: 'II',
  // Roman Numeral Three (U+2162)
  Ⅲ: 'III',
  // Roman Numeral Four (U+2163)
  Ⅳ: 'IV',
  // Roman Numeral Five (U+2164)
  Ⅴ: 'V',
  // Roman Numeral Six (U+2165)
  Ⅵ: 'VI',
  // Roman Numeral Seven (U+2166)
  Ⅶ: 'VII',
  // Roman Numeral Eight (U+2167)
  Ⅷ: 'VIII',
  // Roman Numeral Nine (U+2168)
  Ⅸ: 'IX',
  // Roman Numeral Ten (U+2169)
  Ⅹ: 'X',
  // Roman Numeral Eleven (U+216A)
  Ⅺ: 'XI',
  // Roman Numeral Twelve (U+216B)
  Ⅻ: 'XII',
  // Roman Numeral Fifty (U+216C)
  Ⅼ: 'L',
  // Roman Numeral One Hundred (U+216D)
  Ⅽ: 'C',
  // Roman Numeral Five Hundred (U+216E)
  Ⅾ: 'D',
  // Roman Numeral One Thousand (U+216F)
  Ⅿ: 'M',
  // Small Roman Numeral One (U+2170)
  ⅰ: 'I',
  // Small Roman Numeral Two (U+2171)
  ⅱ: 'II',
  // Small Roman Numeral Three (U+2172)
  ⅲ: 'III',
  // Small Roman Numeral Four (U+2173)
  ⅳ: 'IV',
  // Small Roman Numeral Five (U+2174)
  ⅴ: 'V',
  // Small Roman Numeral Six (U+2175)
  ⅵ: 'VI',
  // Small Roman Numeral Seven (U+2176)
  ⅶ: 'VII',
  // Small Roman Numeral Eight (U+2177)
  ⅷ: 'VIII',
  // Small Roman Numeral Nine (U+2178)
  ⅸ: 'IX',
  // Small Roman Numeral Ten (U+2179)
  ⅹ: 'X',
  // Small Roman Numeral Eleven (U+217A)
  ⅺ: 'XI',
  // Small Roman Numeral Twelve (U+217B)
  ⅻ: 'XII',
  // Small Roman Numeral Fifty (U+217C)
  ⅼ: 'L',
  // Small Roman Numeral One Hundred (U+217D)
  ⅽ: 'C',
  // Small Roman Numeral Five Hundred (U+217E)
  ⅾ: 'D',
  // Small Roman Numeral One Thousand (U+217F)
  ⅿ: 'M',
} as const;

/**
 * Captures all Unicode Roman numeral code points.
 */
export const romanNumeralUnicodeRegex: RegExp =
  /([ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫⅬⅭⅮⅯⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹⅺⅻⅼⅽⅾⅿ])/gi;

/**
 * Captures a valid Roman numeral sequence.
 *
 * Capture groups:
 *
 * |  #  |  Description    |         Example          |
 * | --- | --------------- | ------------------------ |
 * | `0` |  Entire string  |  "MCCXIV" from "MCCXIV"  |
 * | `1` |  Thousands      |  "M" from "MCCXIV"       |
 * | `2` |  Hundreds       |  "CC" from "MCCXIV"      |
 * | `3` |  Tens           |  "X" from "MCCXIV"       |
 * | `4` |  Ones           |  "IV" from "MCCXIV"      |
 *
 * @example
 *
 * ```ts
 * romanNumeralRegex.exec("M")      // [      "M", "M",   "",  "",   "" ]
 * romanNumeralRegex.exec("XII")    // [    "XII",  "",   "", "X", "II" ]
 * romanNumeralRegex.exec("MCCXIV") // [ "MCCXIV", "M", "CC", "X", "IV" ]
 * ```
 */
export const romanNumeralRegex: RegExp =
  /^(?=[MDCLXVI])(M{0,3})(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$/i;
// #endregion

/**
 * Default options for {@link numericQuantity}.
 */
export const defaultOptions: Required<NumericQuantityOptions> = {
  round: 3,
  allowTrailingInvalid: false,
  romanNumerals: false,
  bigIntOnOverflow: false,
  decimalSeparator: '.',
} as const;

import type {
  NumericQuantityOptions,
  RomanNumeralAscii,
  RomanNumeralUnicode,
  SubscriptDigit,
  SuperscriptDigit,
  VulgarFraction,
} from './types';

// #region Decimal_Number Unicode category

/**
 * Unicode decimal digit block start code points.
 * Each block contains 10 contiguous digits (0-9).
 * This list covers all \p{Nd} (Decimal_Number) blocks through Unicode 17.0.
 * The drift test in index.test.ts validates completeness against the JS engine.
 */
const decimalDigitBlockStarts = [
  0x0030, // ASCII (0-9)
  0x0660, // Arabic-Indic
  0x06f0, // Extended Arabic-Indic (Persian/Urdu)
  0x07c0, // NKo
  0x0966, // Devanagari
  0x09e6, // Bengali
  0x0a66, // Gurmukhi
  0x0ae6, // Gujarati
  0x0b66, // Oriya
  0x0be6, // Tamil
  0x0c66, // Telugu
  0x0ce6, // Kannada
  0x0d66, // Malayalam
  0x0de6, // Sinhala Lith
  0x0e50, // Thai
  0x0ed0, // Lao
  0x0f20, // Tibetan
  0x1040, // Myanmar
  0x1090, // Myanmar Shan
  0x17e0, // Khmer
  0x1810, // Mongolian
  0x1946, // Limbu
  0x19d0, // New Tai Lue
  0x1a80, // Tai Tham Hora
  0x1a90, // Tai Tham Tham
  0x1b50, // Balinese
  0x1bb0, // Sundanese
  0x1c40, // Lepcha
  0x1c50, // Ol Chiki
  0xa620, // Vai
  0xa8d0, // Saurashtra
  0xa900, // Kayah Li
  0xa9d0, // Javanese
  0xa9f0, // Myanmar Tai Laing
  0xaa50, // Cham
  0xabf0, // Meetei Mayek
  0xff10, // Fullwidth
  0x104a0, // Osmanya
  0x10d30, // Hanifi Rohingya
  0x10d40, // Garay
  0x11066, // Brahmi
  0x110f0, // Sora Sompeng
  0x11136, // Chakma
  0x111d0, // Sharada
  0x112f0, // Khudawadi
  0x11450, // Newa
  0x114d0, // Tirhuta
  0x11650, // Modi
  0x116c0, // Takri
  0x116d0, // Myanmar Pao
  0x116da, // Myanmar Eastern Pwo Karen
  0x11730, // Ahom
  0x118e0, // Warang Citi
  0x11950, // Dives Akuru
  0x11bf0, // Sunuwar
  0x11c50, // Bhaiksuki
  0x11d50, // Masaram Gondi
  0x11da0, // Gunjala Gondi
  0x11de0, // Tolong Siki
  0x11f50, // Kawi
  0x16130, // Gurung Khema
  0x16a60, // Mro
  0x16ac0, // Tangsa
  0x16b50, // Pahawh Hmong
  0x16d70, // Kirat Rai
  0x1ccf0, // Outlined Digits
  0x1d7ce, // Mathematical Bold
  0x1d7d8, // Mathematical Double-Struck
  0x1d7e2, // Mathematical Sans-Serif
  0x1d7ec, // Mathematical Sans-Serif Bold
  0x1d7f6, // Mathematical Monospace
  0x1e140, // Nyiakeng Puachue Hmong
  0x1e2f0, // Wancho
  0x1e4f0, // Nag Mundari
  0x1e5f1, // Ol Onal
  0x1e950, // Adlam
  0x1fbf0, // Segmented Digits
] as const;

/**
 * Normalizes non-ASCII decimal digits to ASCII digits.
 * Converts characters from Unicode decimal digit blocks (e.g., Arabic-Indic,
 * Devanagari, Bengali) to their ASCII equivalents (0-9).
 *
 * All current Unicode \p{Nd} blocks are included in decimalDigitBlockStarts.
 */
export const normalizeDigits = (str: string): string =>
  str.replace(/\p{Nd}/gu, ch => {
    const cp = ch.codePointAt(0)!;
    // ASCII digits (0x0030-0x0039) don't need conversion
    if (cp <= 0x39) return ch;
    // Binary search for the largest block start ≤ cp
    let lo = 0;
    let hi = decimalDigitBlockStarts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >>> 1;
      if (decimalDigitBlockStarts[mid] <= cp) {
        lo = mid;
      } else {
        hi = mid - 1;
      }
    }
    return String(cp - decimalDigitBlockStarts[lo]!);
  });

/**
 * Map of Unicode superscript and subscript digit code points to ASCII digits.
 */
export const superSubDigitToAsciiMap: Record<SuperscriptDigit | SubscriptDigit, `${number}`> = {
  '⁰': '0',
  '¹': '1',
  '²': '2',
  '³': '3',
  '⁴': '4',
  '⁵': '5',
  '⁶': '6',
  '⁷': '7',
  '⁸': '8',
  '⁹': '9',
  '₀': '0',
  '₁': '1',
  '₂': '2',
  '₃': '3',
  '₄': '4',
  '₅': '5',
  '₆': '6',
  '₇': '7',
  '₈': '8',
  '₉': '9',
} as const;

/**
 * Captures Unicode superscript and subscript digits.
 */
export const superSubDigitsRegex: RegExp = /[⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉]/g;

/**
 * Map of Unicode fraction code points to their ASCII equivalents.
 */
export const vulgarFractionToAsciiMap: Record<VulgarFraction, `${number}/${number | ''}`> = {
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
 * |  #  | Description                                        | Example(s)                                                              |
 * | --- | -------------------------------------------------- | ----------------------------------------------------------------------- |
 * | `0` | entire match                                       | `"2 1/3"` from `"2 1/3"`                                                |
 * | `1` | sign (`-` or `+`)                                  | `"-"` from `"-2 1/3"`                                                   |
 * | `2` | whole number or numerator                          | `"2"` from `"2 1/3"`; `"1"` from `"1/3"`                                |
 * | `3` | entire tail: fraction, decimal, and/or exponent    | `" 1/3"` from `"2 1/3"`; `".23"` from `"1.23"`; `".5e3"` from `"1.5e3"` |
 * | `4` | exponent, when there is no decimal portion         | `"e3"` from `"1e3"`                                                     |
 * | `5` | exponent, when there is a decimal portion          | `"e-3"` from `"1.5e-3"`                                                 |
 * | `6` | numerator of a mixed number (incl. leading space)  | `" 2"` from `"1 2/3"`                                                   |
 *
 * Groups 4–6 are subgroups of group 3 and are not used directly by
 * {@link numericQuantity}; only groups 1–3 are consumed.
 *
 * _Capture groups 2 and 3 may include comma/underscore separators._
 *
 * @example
 *
 * ```ts
 * numericRegex.exec("1")      // [ "1",      null, "1",     null,     null, null,  null ]
 * numericRegex.exec("1.23")   // [ "1.23",   null, "1",     ".23",    null, null,  null ]
 * numericRegex.exec("1 2/3")  // [ "1 2/3",  null, "1",     " 2/3",   null, null,  " 2" ]
 * numericRegex.exec("2/3")    // [ "2/3",    null, "2",     "/3",     null, null,  null ]
 * numericRegex.exec("2 / 3")  // [ "2 / 3",  null, "2",     " / 3",   null, null,  null ]
 * numericRegex.exec("-2 1/3") // [ "-2 1/3", "-",  "2",     " 1/3",   null, null,  " 1" ]
 * numericRegex.exec("1e3")    // [ "1e3",    null, "1",     "e3",     "e3", null,  null ]
 * numericRegex.exec("1.5e-3") // [ "1.5e-3", null, "1",     ".5e-3",  null, "e-3", null ]
 * numericRegex.exec("1,000")  // [ "1,000",  null, "1,000", null,     null, null,  null ]
 * ```
 *
 * @remarks
 *
 * This pattern and {@link numericRegexWithTrailingInvalid} are maintained as two separate
 * literals and must be kept in sync. They differ _only_ in the tail: `$` here versus
 * `(\s*[^.\d/].*)?` there. `src/index.test.ts` asserts that equality.
 */
export const numericRegex: RegExp =
  /^(?=[-+]?\s*\.\d|[-+]?\s*\d)([-+])?\s*((?:\d(?:[,_]\d|\d)*)*)(([eE][+-]?\d(?:[,_]\d|\d)*)?|\.\d(?:[,_]\d|\d)*([eE][+-]?\d(?:[,_]\d|\d)*)?|(\s+\d(?:[,_]\d|\d)*\s*)?\s*\/\s*\d(?:[,_]\d|\d)*)?$/;
/**
 * Same as {@link numericRegex}, but allows (and ignores) trailing invalid characters.
 * Capture groups 1–6 are identical to {@link numericRegex}'s; capture group 7 contains the
 * trailing invalid portion.
 *
 * @example
 *
 * ```ts
 * numericRegexWithTrailingInvalid.exec("1abc")
 * // [ "1abc",      null, "1", null,   null, null, null, "abc"  ]
 * numericRegexWithTrailingInvalid.exec("1 2/3 xyz")
 * // [ "1 2/3 xyz", null, "1", " 2/3", null, null, " 2", " xyz" ]
 * ```
 *
 * @remarks
 *
 * Must be kept in sync with {@link numericRegex} — see that pattern's remarks.
 */
export const numericRegexWithTrailingInvalid: RegExp =
  /^(?=[-+]?\s*\.\d|[-+]?\s*\d)([-+])?\s*((?:\d(?:[,_]\d|\d)*)*)(([eE][+-]?\d(?:[,_]\d|\d)*)?|\.\d(?:[,_]\d|\d)*([eE][+-]?\d(?:[,_]\d|\d)*)?|(\s+\d(?:[,_]\d|\d)*\s*)?\s*\/\s*\d(?:[,_]\d|\d)*)?(\s*[^.\d/].*)?/;

/**
 * Captures any Unicode vulgar fractions.
 */
export const vulgarFractionsRegex: RegExp = /([¼½¾⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞⅟])/g;

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
  // XII/XI are redundant for ASCII input (X + II / X + I), but `romanNumeralUnicodeToAsciiMap`
  // maps Ⅻ/ⅻ and Ⅺ/ⅺ onto these keys, so they are used in practice.
  XII: 12,
  XI: 11,
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
export const romanNumeralUnicodeRegex: RegExp = /([ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫⅬⅭⅮⅯⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹⅺⅻⅼⅽⅾⅿ])/gi;

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
  allowCurrency: false,
  percentage: false,
  verbose: false,
} as const;

export interface NumericQuantityOptions {
  /**
   * Allow and ignore trailing invalid characters _à la_ `parseFloat`.
   *
   * @default false
   */
  allowTrailingInvalid?: boolean;
  /**
   * Attempt to parse Roman numerals if Arabic numeral parsing fails.
   *
   * @default false
   */
  romanNumerals?: boolean;
}

/**
 * Unicode vulgar fraction code points
 */
export type VulgarFraction =
  | '¼'
  | '½'
  | '¾'
  | '⅐'
  | '⅑'
  | '⅒'
  | '⅓'
  | '⅔'
  | '⅕'
  | '⅖'
  | '⅗'
  | '⅘'
  | '⅙'
  | '⅚'
  | '⅛'
  | '⅜'
  | '⅝'
  | '⅞'
  | '⅟';

/**
 * Allowable Roman numeral characters (ASCII, uppercase only)
 */
export type RomanNumeralAscii = 'I' | 'V' | 'X' | 'L' | 'C' | 'D' | 'M';

/**
 * Unicode Roman numeral code points (uppercase and lowercase,
 * representing 1-12, 50, 100, 500, and 1000)
 */
export type RomanNumeralUnicode =
  | 'Ⅰ'
  | 'Ⅱ'
  | 'Ⅲ'
  | 'Ⅳ'
  | 'Ⅴ'
  | 'Ⅵ'
  | 'Ⅶ'
  | 'Ⅷ'
  | 'Ⅸ'
  | 'Ⅹ'
  | 'Ⅺ'
  | 'Ⅻ'
  | 'Ⅼ'
  | 'Ⅽ'
  | 'Ⅾ'
  | 'Ⅿ'
  | 'ⅰ'
  | 'ⅱ'
  | 'ⅲ'
  | 'ⅳ'
  | 'ⅴ'
  | 'ⅵ'
  | 'ⅶ'
  | 'ⅷ'
  | 'ⅸ'
  | 'ⅹ'
  | 'ⅺ'
  | 'ⅻ'
  | 'ⅼ'
  | 'ⅽ'
  | 'ⅾ'
  | 'ⅿ';

/**
 * Union of ASCII and Unicode Roman numeral characters/code points
 */
export type RomanNumeral = RomanNumeralAscii | RomanNumeralUnicode;

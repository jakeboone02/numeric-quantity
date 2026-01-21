export interface NumericQuantityOptions {
  /**
   * Round the result to this many decimal places. Defaults to 3; must
   * be greater than or equal to zero.
   *
   * @default 3
   */
  round?: number | false;
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
  /**
   * Generates a `bigint` value if the string represents
   * a valid integer too large for the `number` type.
   */
  bigIntOnOverflow?: boolean;
  /**
   * Specifies which character ("." or ",") to treat as the decimal separator.
   *
   * @default "."
   */
  // TODO: Add support for automatic decimal separator detection
  // decimalSeparator?: ',' | '.' | 'auto';
  decimalSeparator?: ',' | '.';
}

/**
 * Unicode vulgar fraction code points.
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
 * Allowable Roman numeral characters (ASCII, uppercase only).
 */
export type RomanNumeralAscii = 'I' | 'V' | 'X' | 'L' | 'C' | 'D' | 'M';

/**
 * Unicode Roman numeral code points (uppercase and lowercase,
 * representing 1-12, 50, 100, 500, and 1000).
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
 * Union of ASCII and Unicode Roman numeral characters/code points.
 */
export type RomanNumeral = RomanNumeralAscii | RomanNumeralUnicode;

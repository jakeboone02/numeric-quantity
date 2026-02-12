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
  /**
   * Allow and strip currency symbols (Unicode `\p{Sc}` category) from the
   * start and/or end of the string.
   *
   * @default false
   */
  allowCurrency?: boolean;
  /**
   * Parse percentage strings by stripping the `%` suffix.
   * - `'decimal'` or `true`: `"50%"` → `0.5` (divide by 100)
   * - `'number'`: `"50%"` → `50` (strip `%`, keep value)
   * - `false` or omitted: `"50%"` → `NaN` (default behavior)
   *
   * @default false
   */
  percentage?: 'decimal' | 'number' | boolean;
  /**
   * Return a verbose result object with additional parsing metadata.
   *
   * @default false
   */
  verbose?: boolean;
}

/**
 * Resolves the return type of {@link numericQuantity} based on the options provided.
 */
export type NumericQuantityReturnType<
  T extends NumericQuantityOptions | undefined = undefined,
> = T extends { verbose: true }
  ? NumericQuantityVerboseResult
  : T extends { bigIntOnOverflow: true }
    ? number | bigint
    : number;

/**
 * Verbose result returned when `verbose: true` is set.
 */
export interface NumericQuantityVerboseResult {
  /** The parsed numeric value (NaN if invalid). */
  value: number | bigint;
  /** The original input string. */
  input: string;
  /** Currency symbol(s) stripped from the start, if any. */
  currencyPrefix?: string;
  /** Currency symbol(s) stripped from the end, if any. */
  currencySuffix?: string;
  /** True if a `%` suffix was stripped. */
  percentageSuffix?: boolean;
  /** Trailing invalid (usually non-numeric) characters detected in the input, if any. Populated even when `allowTrailingInvalid` is `false`. */
  trailingInvalid?: string;
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

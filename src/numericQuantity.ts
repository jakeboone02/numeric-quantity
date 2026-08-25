import {
  defaultOptions,
  normalizeDigits,
  numericRegexWithTrailingInvalid,
  superSubDigitToAsciiMap,
  superSubDigitsRegex,
  vulgarFractionToAsciiMap,
  vulgarFractionsRegex,
} from './constants';
import { parseRomanNumerals } from './parseRomanNumerals';
import type {
  NumericQuantityOptions,
  NumericQuantityReturnType,
  NumericQuantityVerboseResult,
} from './types';

const leadingSlashRegex = /^\s*\//;
const currencyPrefixRegex = /^([-+]?)\s*(\p{Sc}+)\s*/u;
const currencySuffixRegex = /\s*(\p{Sc}+)\s*$/u;
const percentageSuffixRegex = /\s*%$/;

const maxSafeBigInt = BigInt(Number.MAX_SAFE_INTEGER);
/**
 * Upper bound on `10 ** exp` magnitudes evaluated exactly. Anything beyond this
 * overflows/underflows the `number` path to `Infinity`/`0` anyway, so bounding it
 * avoids allocating absurdly large `bigint`s (and `BigInt(Infinity)` throwing).
 */
const maxExactExponent = 10_000;
const pow10 = (exp: number) => 10n ** BigInt(exp);

/**
 * Evaluates the parsed numeric components as an exact `bigint` rational (magnitude only,
 * sign is applied by the caller) and rounds the result half-up.
 *
 * Returns the rounded `bigint` only if its magnitude exceeds `Number.MAX_SAFE_INTEGER`;
 * otherwise returns `undefined`, meaning "no overflow, use the `number` path".
 *
 * @param group1 - Whole number or numerator (separators already stripped).
 * @param group2 - Decimal/exponent/fraction tail, if any.
 * @param divideBy100 - Whether a percentage suffix was stripped.
 */
const toRoundedBigInt = (
  group1: string,
  group2: string | undefined,
  divideBy100: boolean
): bigint | undefined => {
  let numerator: bigint;
  let denominator = 1n;

  if (!group2) {
    // Plain integer
    numerator = BigInt(group1);
  } else if (group2.startsWith('.') || group2.startsWith('e') || group2.startsWith('E')) {
    // Decimal and/or scientific notation
    const expIndex = group2.search(/[eE]/);
    const exponent = expIndex === -1 ? 0 : parseInt(group2.slice(expIndex + 1));
    // Defer to the `number` path for non-finite/absurd exponents, before allocating any
    // `bigint`s. Fractional digit counts are bounded by the input length, but the exponent
    // is not, so validate it first.
    if (!Number.isFinite(exponent) || Math.abs(exponent) > maxExactExponent) return undefined;
    const fractionDigits = (expIndex === -1 ? group2 : group2.slice(0, expIndex)).slice(1);
    numerator = BigInt(`${group1}${fractionDigits}`);
    if (fractionDigits) denominator = pow10(fractionDigits.length);
    if (exponent > 0) numerator *= pow10(exponent);
    else if (exponent < 0) denominator *= pow10(-exponent);
  } else if (leadingSlashRegex.test(group2)) {
    // Pure fraction, e.g. "1/2"
    numerator = BigInt(group1);
    denominator = BigInt(group2.replace('/', '').trim());
  } else {
    // Mixed number, e.g. "1 2/3"
    const [n, d] = group2.split('/');
    denominator = BigInt(d.trim());
    numerator = BigInt(group1) * denominator + BigInt(n.trim());
  }

  if (divideBy100) denominator *= 100n;

  // Let the `number` path produce `Infinity` for zero denominators
  if (denominator === 0n) return undefined;

  // Round half-up (BigInt division truncates, i.e. floors for non-negative operands)
  const rounded = (2n * numerator + denominator) / (2n * denominator);

  return rounded > maxSafeBigInt ? rounded : undefined;
};

/**
 * Converts a string to a number, like an enhanced version of `parseFloat`.
 *
 * The string can include mixed numbers, vulgar fractions, or Roman numerals.
 * Input is expected to be a `string`, but will be coerced to `string` if necessary.
 *
 * @param quantity - The value to parse as a numeric quantity.
 * @param options - Optional settings to control parsing behavior.
 */
function numericQuantity(quantity: unknown): number;
function numericQuantity<const T extends NumericQuantityOptions | undefined | null>(
  quantity: unknown,
  options: T
): NumericQuantityReturnType<T>;
function numericQuantity(
  quantity: unknown,
  options: NumericQuantityOptions | null = defaultOptions
): number | bigint | NumericQuantityVerboseResult {
  const opts: Required<NumericQuantityOptions> = {
    ...defaultOptions,
    ...options,
  };

  // `String` (unlike a template literal) does not throw for `symbol` input, but it does
  // throw for objects with a null prototype or throwing `toString`/`valueOf` methods.
  // Coercion failures fall through as an empty string, which parses to `NaN`.
  let originalInput: string;
  if (typeof quantity === 'string') {
    originalInput = quantity;
  } else {
    try {
      originalInput = String(quantity);
    } catch {
      originalInput = '';
    }
  }

  // Metadata for verbose output
  let currencyPrefix: string | undefined;
  let currencySuffix: string | undefined;
  let percentageSuffix: boolean | undefined;
  let trailingInvalid: string | undefined;
  let parsedSign: '-' | '+' | undefined;
  let parsedWhole: number | undefined;
  let parsedNumerator: number | undefined;
  let parsedDenominator: number | undefined;

  const buildVerboseResult = (value: number | bigint): NumericQuantityVerboseResult => {
    const result: NumericQuantityVerboseResult = {
      value,
      input: originalInput,
    };
    if (currencyPrefix) result.currencyPrefix = currencyPrefix;
    if (currencySuffix) result.currencySuffix = currencySuffix;
    if (percentageSuffix) result.percentageSuffix = percentageSuffix;
    if (trailingInvalid) result.trailingInvalid = trailingInvalid;
    if (parsedSign) result.sign = parsedSign;
    if (parsedWhole !== undefined) result.whole = parsedWhole;
    if (parsedNumerator !== undefined) result.numerator = parsedNumerator;
    if (parsedDenominator !== undefined) result.denominator = parsedDenominator;
    return result;
  };

  const returnValue = (value: number | bigint) =>
    opts.verbose ? buildVerboseResult(value) : value;

  /**
   * Divides by 100 if a percentage suffix was stripped. Exact scaling, no rounding:
   * `round` applies to the quantity as written, before this division.
   */
  const applyPercentage = (value: number) =>
    percentageSuffix && opts.percentage !== 'number' ? value / 100 : value;

  if (typeof quantity === 'symbol') {
    // `String(sym)` is e.g. `'Symbol(1)'`; never a valid quantity
    return returnValue(NaN);
  }

  if (typeof quantity === 'number' || typeof quantity === 'bigint') {
    return returnValue(quantity);
  }

  let finalResult = NaN;
  let workingString = originalInput;

  // Strip currency/percentage affixes until none match, so the two are order-independent.
  // At most one `%` is stripped per parse, so `'50%%'` remains invalid.
  let affixStripped = true;
  while (affixStripped) {
    affixStripped = false;

    if (opts.allowCurrency) {
      const prefixMatch = currencyPrefixRegex.exec(workingString);
      if (prefixMatch?.[2]) {
        currencyPrefix = (currencyPrefix ?? '') + prefixMatch[2];
        // Keep the sign if present, remove currency symbol
        workingString = (prefixMatch[1] || '') + workingString.slice(prefixMatch[0].length);
        affixStripped = true;
      }

      const suffixMatch = currencySuffixRegex.exec(workingString);
      if (suffixMatch) {
        currencySuffix = suffixMatch[1] + (currencySuffix ?? '');
        workingString = workingString.slice(0, -suffixMatch[0].length);
        affixStripped = true;
      }
    }

    if (!percentageSuffix && opts.percentage) {
      const pctMatch = percentageSuffixRegex.exec(workingString);
      if (pctMatch) {
        percentageSuffix = true;
        workingString = workingString.slice(0, -pctMatch[0].length);
        affixStripped = true;
      }
    }
  }

  // Coerce to string and normalize
  const quantityAsString = normalizeDigits(
    workingString
      // Convert vulgar fractions to ASCII, with a leading space
      // to keep the whole number and the fraction separate
      .replace(
        vulgarFractionsRegex,
        (_m, vf: keyof typeof vulgarFractionToAsciiMap) => ` ${vulgarFractionToAsciiMap[vf]}`
      )
      // Convert superscript/subscript digits to ASCII
      .replace(
        superSubDigitsRegex,
        ch => superSubDigitToAsciiMap[ch as keyof typeof superSubDigitToAsciiMap]
      )
      // Convert fraction slash to standard slash
      .replace('⁄', '/')
      .trim()
  );

  // Bail out if the string was only white space
  if (quantityAsString.length === 0) {
    return returnValue(NaN);
  }

  let normalizedString = quantityAsString;

  if (opts.decimalSeparator === ',') {
    const commaCount = (quantityAsString.match(/,/g) || []).length;
    if (commaCount === 1) {
      // Treat lone comma as decimal separator; remove all "." since they represent
      // thousands/whatever separators
      normalizedString = quantityAsString.replaceAll('.', '_').replace(',', '.');
    } else if (commaCount > 1) {
      // The second comma and everything after is "trailing invalid"
      const firstCommaIndex = quantityAsString.indexOf(',');
      const secondCommaIndex = quantityAsString.indexOf(',', firstCommaIndex + 1);
      normalizedString = quantityAsString
        .substring(0, secondCommaIndex)
        .replaceAll('.', '_')
        .replace(',', '.');
    } else {
      // No comma as decimal separator, so remove all "." since they represent
      // thousands/whatever separators
      normalizedString = quantityAsString.replaceAll('.', '_');
    }
  }

  const regexResult = numericRegexWithTrailingInvalid.exec(normalizedString);

  // If the Arabic numeral regex fails, try Roman numerals
  if (!regexResult) {
    if (!opts.romanNumerals) return returnValue(NaN);
    return returnValue(applyPercentage(parseRomanNumerals(quantityAsString)));
  }

  // Capture trailing invalid characters. Group 7 catches chars starting with [^.\d/], but
  // the regex (which lacks a $ anchor) may also leave unconsumed input starting with ".",
  // "/", or digits (e.g. "0.1.2" or "1/"), and the comma-decimal path above may have
  // truncated the string. All normalization steps are length-preserving, so the number of
  // consumed characters maps 1:1 onto `quantityAsString`; slice the remainder from the
  // original (normalized-digit) input so nothing is dropped and no internal placeholder
  // ("_" for a stripped ".") leaks into the metadata.
  const consumedLength = regexResult[0].length - (regexResult[7]?.length ?? 0);
  const rawTrailing = quantityAsString.slice(consumedLength).trim();
  if (rawTrailing) {
    trailingInvalid = rawTrailing;
    if (!opts.allowTrailingInvalid) {
      return returnValue(NaN);
    }
  }

  const [, sign, rawGroup1, rawGroup2] = regexResult;
  if (sign === '-' || sign === '+') parsedSign = sign;
  const numberGroup1 = rawGroup1.replaceAll(',', '').replaceAll('_', '');
  const numberGroup2 = rawGroup2?.replaceAll(',', '').replaceAll('_', '');

  // Exact overflow evaluation must precede the empty-whole shortcut below, otherwise
  // leading-decimal scientific values (e.g. ".1e17") skip the `bigint` path entirely.
  if (opts.bigIntOnOverflow) {
    const asBigInt = toRoundedBigInt(
      numberGroup1,
      numberGroup2,
      !!percentageSuffix && opts.percentage !== 'number'
    );
    if (asBigInt !== undefined) {
      return returnValue(sign === '-' ? -asBigInt : asBigInt);
    }
  }

  // Numerify capture group 1
  finalResult =
    !numberGroup1 && numberGroup2 && numberGroup2.startsWith('.') ? 0 : parseInt(numberGroup1);

  // If capture group 2 is null, then we're dealing with an integer
  // and there is nothing left to process
  if (!numberGroup2) {
    finalResult = sign === '-' ? finalResult * -1 : finalResult;
    return returnValue(applyPercentage(finalResult));
  }

  // Non-finite `round` values are treated as `false` (no rounding);
  // negative values clamp to 0 (round to whole number)
  const roundTo =
    typeof opts.round === 'number' && Number.isFinite(opts.round)
      ? Math.floor(Math.max(0, opts.round))
      : false;
  // `10 ** roundTo` (not `parseFloat('1e' + roundTo)`, which mangles exponential notation,
  // e.g. `1e21` => "1e1e+21" => 10). Factors beyond `Number.MAX_VALUE` are `Infinity`, which
  // would poison the arithmetic below; rounding to >308 decimals is a no-op for a double
  // anyway, so fall back to no rounding. `NaN` means "no rounding".
  const roundingFactorRaw = roundTo === false ? NaN : 10 ** roundTo;
  const roundingFactor = Number.isFinite(roundingFactorRaw) ? roundingFactorRaw : NaN;

  /** Rounds to `roundTo` decimal places, falling back to `value` if the scaling overflows. */
  const round = (value: number, scaled: number) => {
    const result = Math.round(scaled) / roundingFactor;
    return Number.isFinite(result) || !Number.isFinite(value) ? result : value;
  };

  if (
    numberGroup2.startsWith('.') ||
    numberGroup2.startsWith('e') ||
    numberGroup2.startsWith('E')
  ) {
    // If first char of `numberGroup2` is "." or "e"/"E", it's a decimal
    const decimalValue = parseFloat(`${finalResult}${numberGroup2}`);
    finalResult = isNaN(roundingFactor)
      ? decimalValue
      : round(decimalValue, decimalValue * roundingFactor);
  } else if (leadingSlashRegex.test(numberGroup2)) {
    // If the first non-space char is "/" it's a pure fraction (e.g. "1/2")
    const numerator = parseInt(numberGroup1);
    const denominator = parseInt(numberGroup2.replace('/', ''));
    parsedNumerator = numerator;
    parsedDenominator = denominator;
    finalResult = isNaN(roundingFactor)
      ? numerator / denominator
      : round(numerator / denominator, (numerator * roundingFactor) / denominator);
  } else {
    // Otherwise it's a mixed fraction (e.g. "1 2/3")
    const fractionArray = numberGroup2.split('/');
    const [numerator, denominator] = fractionArray.map(v => parseInt(v));
    parsedWhole = finalResult;
    parsedNumerator = numerator;
    parsedDenominator = denominator;
    finalResult += isNaN(roundingFactor)
      ? numerator / denominator
      : round(numerator / denominator, (numerator * roundingFactor) / denominator);
  }

  finalResult = sign === '-' ? finalResult * -1 : finalResult;

  return returnValue(applyPercentage(finalResult));
}

export { numericQuantity };

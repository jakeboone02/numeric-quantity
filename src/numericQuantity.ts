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
// RegExp ctor (not literals) so old Babel regex transforms (e.g. Expo Snackager) skip `\p{}`
const currencyPrefixRegex = new RegExp('^([-+]?)\\s*(\\p{Sc}+)\\s*', 'u');
const currencySuffixRegex = new RegExp('\\s*(\\p{Sc}+)\\s*$', 'u');
const percentageSuffixRegex = /\s*%$/;
// A superscript numerator that directly follows a whole-number digit ("2¹⁄₂")
const superscriptNumeratorAfterDigitRegex = new RegExp('(\\p{Nd})([⁰¹²³⁴⁵⁶⁷⁸⁹]+\\s*[⁄/])', 'gu');

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
    const { fraction: fractionDigits, exponent } = splitDecimal(group2);
    // Defer to the `number` path for non-finite/absurd exponents, before allocating any
    // `bigint`s. Fractional digit counts are bounded by the input length, but the exponent
    // is not, so validate it first.
    if (!Number.isFinite(exponent) || Math.abs(exponent) > maxExactExponent) return undefined;
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

/** Largest `n` for which `10 ** n` is exact as a double. */
const maxExactPow10 = 22;

/**
 * Exactly rounds the non-negative rational `numerator / denominator * 10 ** exp10` half-up to
 * `places` decimals, divides by `10 ** divExp`, and returns the closest double. Both integer
 * strings must be unsigned and `denominator` nonzero. Returns `NaN` if `|exp10|` exceeds
 * `maxExactExponent`.
 */
const roundRational = (
  numerator: string,
  denominator: string,
  exp10: number,
  places: number,
  divExp: number
): number => {
  const shift = exp10 + places;
  const outExp = places + divExp;
  // Fast path: all-safe-integer double math is exact (`%` is exact; `q / 10 ** outExp` is a
  // single correctly-rounded division of exact operands)
  if (outExp <= maxExactPow10 && shift <= maxExactPow10 && shift >= -maxExactPow10) {
    const n = shift > 0 ? Number(numerator) * 10 ** shift : Number(numerator);
    const d = shift < 0 ? Number(denominator) * 10 ** -shift : Number(denominator);
    if (Number.isSafeInteger(n) && Number.isSafeInteger(d)) {
      const rem = n % d;
      return ((n - rem) / d + (2 * rem >= d ? 1 : 0)) / 10 ** outExp;
    }
  }
  if (Math.abs(exp10) > maxExactExponent) return NaN;
  let n = BigInt(numerator);
  let d = BigInt(denominator);
  if (shift > 0) n *= pow10(shift);
  else if (shift < 0) d *= pow10(-shift);
  return Number(`${(2n * n + d) / (2n * d)}e-${outExp}`);
};

/** Bit length of a positive `bigint`. */
const bitLength = (n: bigint) => n.toString(2).length;

/**
 * Closest double (ties to even) to the positive rational `n / d`, including subnormals and
 * overflow to `Infinity`.
 */
const bigRatioToNumber = (n: bigint, d: bigint): number => {
  if (n === 0n) return 0;
  // `n / d` is in [2 ** (e - 1), 2 ** (e + 1)); scale so the quotient has >= 55 bits
  const e = bitLength(n) - bitLength(d);
  const s = 55 - e;
  const sn = s > 0 ? n << BigInt(s) : n;
  const sd = s < 0 ? d << BigInt(-s) : d;
  const q = sn / sd;
  const sticky = sn % sd !== 0n;
  // Keep 53 significant bits, fewer if subnormal (result LSB can't go below 2 ** -1074)
  const drop = Math.max(bitLength(q) - 53, s - 1074);
  const dropBig = BigInt(drop);
  let m = q >> dropBig;
  const rest = q - (m << dropBig);
  const half = 1n << (dropBig - 1n);
  if (rest > half || (rest === half && (sticky || (m & 1n) === 1n))) m += 1n;
  return Number(m) * 2 ** (drop - s);
};

/**
 * Divides `numerator` by `denominator * 10 ** divExp` with a single rounding. Both integer
 * strings must be unsigned. Returns `NaN` for a zero denominator, so the caller keeps its
 * own math (`Infinity`/`NaN`).
 */
const divideRational = (numerator: string, denominator: string, divExp: number): number => {
  const n = Number(numerator);
  const d = Number(denominator) * 10 ** divExp;
  if (d === 0) return NaN;
  if (Number.isSafeInteger(n) && Number.isSafeInteger(d)) return n / d;
  return bigRatioToNumber(BigInt(numerator), BigInt(denominator) * pow10(divExp));
};

/** Numerator of the improper fraction for mixed number `whole numerator/denominator`. */
const improperNumerator = (whole: string, numerator: string, denominator: string): string => {
  const improper = parseInt(whole) * parseInt(denominator) + parseInt(numerator);
  return Number.isSafeInteger(improper)
    ? `${improper}`
    : `${BigInt(whole) * BigInt(denominator) + BigInt(numerator)}`;
};

/**
 * Splits a decimal/scientific tail (e.g. `".25e-3"`) into its fraction digits and exponent.
 * The exponent is `Infinity` for absurdly long exponent digit runs.
 */
const splitDecimal = (group2: string): { fraction: string; exponent: number } => {
  const expIndex = group2.search(/[eE]/);
  return {
    fraction: (expIndex === -1 ? group2 : group2.slice(0, expIndex)).slice(1),
    exponent: expIndex === -1 ? 0 : Number(group2.slice(expIndex + 1)),
  };
};

/**
 * Converts a string to a number, like an enhanced version of `parseFloat`.
 *
 * The string can include mixed numbers, vulgar fractions, or Roman numerals.
 * Input is expected to be a `string`, but will be coerced to `string` if necessary.
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
      // Add a space between a whole number and a superscript numerator so the
      // digits don't merge once converted ("2¹⁄₂" -> "2 ¹⁄₂")
      .replace(superscriptNumeratorAfterDigitRegex, '$1 $2')
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

  // Numerify capture group 1 (empty only for ".5"-style input; decimal branch handles it)
  finalResult = parseInt(numberGroup1);

  const divExp = percentageSuffix && opts.percentage !== 'number' ? 2 : 0;

  // If capture group 2 is null, then we're dealing with an integer
  // and there is nothing left to process
  if (!numberGroup2) {
    // Move the decimal point; `finalResult / 100` rounds twice beyond `MAX_SAFE_INTEGER`
    if (divExp) finalResult = Number(`${numberGroup1}e-${divExp}`);
    return returnValue(sign === '-' ? -finalResult : finalResult);
  }

  // Non-finite `round` values are treated as `false` (no rounding); negative values clamp to 0
  // (round to whole number). Rounding to >308 decimals is a no-op for a double, so skip it.
  const roundTo =
    typeof opts.round === 'number' && Number.isFinite(opts.round) && opts.round < 309
      ? Math.floor(Math.max(0, opts.round))
      : false;

  // Result with any percentage division folded in, rounded once (to `roundTo` places, or to
  // the closest double without `roundTo`); `NaN` means "use `finalResult`"
  let exact = NaN;

  if (
    numberGroup2.startsWith('.') ||
    numberGroup2.startsWith('e') ||
    numberGroup2.startsWith('E')
  ) {
    // If first char of `numberGroup2` is "." or "e"/"E", it's a decimal. Parse digits as
    // written; `finalResult` stringifies as "1e+21" from 1e21 up, breaking appended exponent.
    const { fraction, exponent } = splitDecimal(numberGroup2);
    const digits = `${numberGroup1 || '0'}${fraction}`;
    if (roundTo !== false) {
      // Round the digits as written, not the parsed double (`0.5005 * 1000` is
      // `500.49999999999994`). `NaN` (absurd exponent) falls back to the parsed value.
      exact = roundRational(digits, '1', exponent - fraction.length, roundTo, divExp);
    } else if (divExp && Math.abs(exponent) <= maxExactExponent) {
      // Move the decimal point instead of dividing the parsed double (`0.9 / 100` is
      // `0.009000000000000001`, but `9e-3` is `0.009`)
      exact = Number(`${digits}e${exponent - fraction.length - divExp}`);
    }
    if (isNaN(exact)) finalResult = parseFloat(`${numberGroup1 || '0'}${numberGroup2}`);
  } else if (leadingSlashRegex.test(numberGroup2)) {
    // If the first non-space char is "/" it's a pure fraction (e.g. "1/2")
    const denominatorString = numberGroup2.replace('/', '').trim();
    const numerator = parseInt(numberGroup1);
    const denominator = parseInt(denominatorString);
    parsedNumerator = numerator;
    parsedDenominator = denominator;
    finalResult = numerator / denominator;
    if (roundTo !== false && denominator !== 0) {
      exact = roundRational(numberGroup1, denominatorString, 0, roundTo, divExp);
    } else if (roundTo === false) {
      exact = divideRational(numberGroup1, denominatorString, divExp);
    }
  } else {
    // Otherwise it's a mixed fraction (e.g. "1 2/3")
    const [numeratorString, denominatorString] = numberGroup2.split('/').map(v => v.trim());
    const numerator = parseInt(numeratorString);
    const denominator = parseInt(denominatorString);
    parsedWhole = finalResult;
    parsedNumerator = numerator;
    parsedDenominator = denominator;
    // Evaluate whole + fraction as one rational, not the fraction alone then add
    const improper = improperNumerator(numberGroup1, numeratorString, denominatorString);
    if (roundTo !== false && denominator !== 0) {
      exact = roundRational(improper, denominatorString, 0, roundTo, divExp);
    } else if (roundTo === false) {
      // `1 + 2 / 3` is `1.6666666666666665`, but `5 / 3` is `1.6666666666666667`
      exact = divideRational(improper, denominatorString, divExp);
    }
    finalResult += numerator / denominator;
  }

  finalResult = isNaN(exact) ? applyPercentage(finalResult) : exact;

  return returnValue(sign === '-' ? -finalResult : finalResult);
}

export { numericQuantity };

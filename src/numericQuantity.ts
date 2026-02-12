import {
  defaultOptions,
  normalizeDigits,
  numericRegexWithTrailingInvalid,
  vulgarFractionToAsciiMap,
  vulgarFractionsRegex,
} from './constants';
import { parseRomanNumerals } from './parseRomanNumerals';
import type {
  NumericQuantityOptions,
  NumericQuantityReturnType,
  NumericQuantityVerboseResult,
} from './types';

const spaceThenSlashRegex = /^\s*\//;
const currencyPrefixRegex = /^(-?)\s*(\p{Sc}+)\s*/u;
const currencySuffixRegex = /\s*(\p{Sc}+)$/u;
const percentageSuffixRegex = /%$/;

/**
 * Converts a string to a number, like an enhanced version of `parseFloat`.
 *
 * The string can include mixed numbers, vulgar fractions, or Roman numerals.
 */
function numericQuantity(quantity: string | number): number;
function numericQuantity<T extends NumericQuantityOptions>(
  quantity: string | number,
  options: T
): NumericQuantityReturnType<T>;
function numericQuantity(
  quantity: string | number,
  options?: NumericQuantityOptions
): number;
function numericQuantity(
  quantity: string | number,
  options: NumericQuantityOptions = defaultOptions
): number | bigint | NumericQuantityVerboseResult {
  const opts: Required<NumericQuantityOptions> = {
    ...defaultOptions,
    ...options,
  };

  // Metadata for verbose output
  const originalInput = typeof quantity === 'string' ? quantity : `${quantity}`;
  let currencyPrefix: string | undefined;
  let currencySuffix: string | undefined;
  let percentageSuffix: boolean | undefined;
  let trailingInvalid: string | undefined;

  const buildVerboseResult = (
    value: number | bigint
  ): NumericQuantityVerboseResult => {
    const result: NumericQuantityVerboseResult = { value, input: originalInput };
    if (currencyPrefix) result.currencyPrefix = currencyPrefix;
    if (currencySuffix) result.currencySuffix = currencySuffix;
    if (percentageSuffix) result.percentageSuffix = percentageSuffix;
    if (trailingInvalid) result.trailingInvalid = trailingInvalid;
    return result;
  };

  const returnValue = (value: number | bigint) =>
    opts.verbose ? buildVerboseResult(value) : value;

  if (typeof quantity === 'number' || typeof quantity === 'bigint') {
    return returnValue(quantity);
  }

  let finalResult = NaN;
  let workingString = `${quantity}`;

  // Strip currency prefix if allowed (preserving leading dash for negatives)
  if (opts.allowCurrency) {
    const prefixMatch = currencyPrefixRegex.exec(workingString);
    if (prefixMatch && prefixMatch[2]) {
      currencyPrefix = prefixMatch[2];
      // Keep the dash if present, remove currency symbol
      workingString =
        (prefixMatch[1] || '') + workingString.slice(prefixMatch[0].length);
    }
  }

  // Strip currency suffix if allowed (before percentage check)
  if (opts.allowCurrency) {
    const suffixMatch = currencySuffixRegex.exec(workingString);
    if (suffixMatch) {
      currencySuffix = suffixMatch[1];
      workingString = workingString.slice(0, -suffixMatch[0].length);
    }
  }

  // Strip percentage suffix if option is set
  if (opts.percentage && percentageSuffixRegex.test(workingString)) {
    percentageSuffix = true;
    workingString = workingString.slice(0, -1);
  }

  // Coerce to string and normalize
  const quantityAsString = normalizeDigits(
    workingString
      // Convert vulgar fractions to ASCII, with a leading space
      // to keep the whole number and the fraction separate
      .replace(
        vulgarFractionsRegex,
        (_m, vf: keyof typeof vulgarFractionToAsciiMap) =>
          ` ${vulgarFractionToAsciiMap[vf]}`
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
      normalizedString = quantityAsString
        .replaceAll('.', '_')
        .replace(',', '.');
    } else if (commaCount > 1) {
      // The second comma and everything after is "trailing invalid"
      if (!opts.allowTrailingInvalid) {
        // Bail out if trailing invalid is not allowed
        return returnValue(NaN);
      }

      const firstCommaIndex = quantityAsString.indexOf(',');
      const secondCommaIndex = quantityAsString.indexOf(
        ',',
        firstCommaIndex + 1
      );
      const beforeSecondComma = quantityAsString
        .substring(0, secondCommaIndex)
        .replaceAll('.', '_')
        .replace(',', '.');
      const afterSecondComma = quantityAsString.substring(secondCommaIndex + 1);
      normalizedString = opts.allowTrailingInvalid
        ? beforeSecondComma + '&' + afterSecondComma
        : beforeSecondComma;
    } else {
      // No comma as decimal separator, so remove all "." since they represent
      // thousands/whatever separators
      normalizedString = quantityAsString.replaceAll('.', '_');
    }
  }

  const regexResult = numericRegexWithTrailingInvalid.exec(normalizedString);

  // If the Arabic numeral regex fails, try Roman numerals
  if (!regexResult) {
    return returnValue(
      opts.romanNumerals ? parseRomanNumerals(quantityAsString) : NaN);
  }

  // Capture trailing invalid characters: group 7 catches chars starting with
  // [^.\d/], but the regex (which lacks a $ anchor) may also leave unconsumed
  // input starting with ".", "/", or digits (e.g. "0.1.2" or "1/").
  const rawTrailing = (
    regexResult[7] || normalizedString.slice(regexResult[0].length)
  ).trim();
  if (rawTrailing) {
    trailingInvalid = rawTrailing;
    if (!opts.allowTrailingInvalid) {
      return returnValue(NaN);
    }
  }

  const [, dash, ng1temp, ng2temp] = regexResult;
  const numberGroup1 = ng1temp.replaceAll(',', '').replaceAll('_', '');
  const numberGroup2 = ng2temp?.replaceAll(',', '').replaceAll('_', '');

  // Numerify capture group 1
  if (!numberGroup1 && numberGroup2 && numberGroup2.startsWith('.')) {
    finalResult = 0;
  } else {
    if (opts.bigIntOnOverflow) {
      const asBigInt = dash ? BigInt(`-${numberGroup1}`) : BigInt(numberGroup1);
      if (
        asBigInt > BigInt(Number.MAX_SAFE_INTEGER) ||
        asBigInt < BigInt(Number.MIN_SAFE_INTEGER)
      ) {
        // Note: percentage division not applied to bigint overflow
        return returnValue(asBigInt);
      }
    }

    finalResult = parseInt(numberGroup1);
  }

  // If capture group 2 is null, then we're dealing with an integer
  // and there is nothing left to process
  if (!numberGroup2) {
    finalResult = dash ? finalResult * -1 : finalResult;
    if (percentageSuffix && opts.percentage !== 'number') {
      finalResult = finalResult / 100;
    }
    return returnValue(finalResult);
  }

  const roundingFactor =
    opts.round === false
      ? NaN
      : parseFloat(`1e${Math.floor(Math.max(0, opts.round))}`);

  if (
    numberGroup2.startsWith('.') ||
    numberGroup2.startsWith('e') ||
    numberGroup2.startsWith('E')
  ) {
    // If first char of `numberGroup2` is "." or "e"/"E", it's a decimal
    const decimalValue = parseFloat(`${finalResult}${numberGroup2}`);
    finalResult = isNaN(roundingFactor)
      ? decimalValue
      : Math.round(decimalValue * roundingFactor) / roundingFactor;
  } else if (spaceThenSlashRegex.test(numberGroup2)) {
    // If the first non-space char is "/" it's a pure fraction (e.g. "1/2")
    const numerator = parseInt(numberGroup1);
    const denominator = parseInt(numberGroup2.replace('/', ''));
    finalResult = isNaN(roundingFactor)
      ? numerator / denominator
      : Math.round((numerator * roundingFactor) / denominator) / roundingFactor;
  } else {
    // Otherwise it's a mixed fraction (e.g. "1 2/3")
    const fractionArray = numberGroup2.split('/');
    const [numerator, denominator] = fractionArray.map(v => parseInt(v));
    finalResult += isNaN(roundingFactor)
      ? numerator / denominator
      : Math.round((numerator * roundingFactor) / denominator) / roundingFactor;
  }

  finalResult = dash ? finalResult * -1 : finalResult;

  // Apply percentage division if needed
  if (percentageSuffix && opts.percentage !== 'number') {
    finalResult = isNaN(roundingFactor)
      ? finalResult / 100
      : Math.round((finalResult / 100) * roundingFactor) / roundingFactor;
  }

  return returnValue(finalResult);
}

export { numericQuantity };

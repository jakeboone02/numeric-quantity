import {
  defaultOptions,
  numericRegex,
  numericRegexWithTrailingInvalid,
  vulgarFractionToAsciiMap,
  vulgarFractionsRegex,
} from './constants';
import { parseRomanNumerals } from './parseRomanNumerals';
import type { NumericQuantityOptions } from './types';

const spaceThenSlashRegex = /^\s*\//;

/**
 * Converts a string to a number, like an enhanced version of `parseFloat`.
 *
 * The string can include mixed numbers, vulgar fractions, or Roman numerals.
 */
function numericQuantity(quantity: string | number): number;
function numericQuantity(
  quantity: string | number,
  options: NumericQuantityOptions & { bigIntOnOverflow: true }
): number | bigint;
function numericQuantity(
  quantity: string | number,
  options?: NumericQuantityOptions
): number;
function numericQuantity(
  quantity: string | number,
  options: NumericQuantityOptions = defaultOptions
) {
  if (typeof quantity === 'number' || typeof quantity === 'bigint') {
    return quantity;
  }

  let finalResult = NaN;

  // Coerce to string in case qty is a number
  const quantityAsString = `${quantity}`
    // Convert vulgar fractions to ASCII, with a leading space
    // to keep the whole number and the fraction separate
    .replace(
      vulgarFractionsRegex,
      (_m, vf: keyof typeof vulgarFractionToAsciiMap) =>
        ` ${vulgarFractionToAsciiMap[vf]}`
    )
    // Convert fraction slash to standard slash
    .replace('⁄', '/')
    .trim();

  // Bail out if the string was only white space
  if (quantityAsString.length === 0) {
    return NaN;
  }

  const opts: Required<NumericQuantityOptions> = {
    ...defaultOptions,
    ...options,
  };

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
        return NaN;
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

  const regexResult = (
    opts.allowTrailingInvalid ? numericRegexWithTrailingInvalid : numericRegex
  ).exec(normalizedString);

  // If the Arabic numeral regex fails, try Roman numerals
  if (!regexResult) {
    return opts.romanNumerals ? parseRomanNumerals(quantityAsString) : NaN;
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
        return asBigInt;
      }
    }

    finalResult = parseInt(numberGroup1);
  }

  // If capture group 2 is null, then we're dealing with an integer
  // and there is nothing left to process
  if (!numberGroup2) {
    return dash ? finalResult * -1 : finalResult;
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

  return dash ? finalResult * -1 : finalResult;
}

export { numericQuantity };

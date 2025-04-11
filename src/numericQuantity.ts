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
export const numericQuantity = (
  quantity: string | number,
  options: NumericQuantityOptions = defaultOptions
): number => {
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

  const regexResult = (
    opts.allowTrailingInvalid ? numericRegexWithTrailingInvalid : numericRegex
  ).exec(quantityAsString);

  // If the Arabic numeral regex fails, try Roman numerals
  if (!regexResult) {
    return opts.romanNumerals ? parseRomanNumerals(quantityAsString) : NaN;
  }

  const [, dash, ng1temp, ng2temp] = regexResult;
  const numberGroup1 = ng1temp.replace(/[,_]/g, '');
  const numberGroup2 = ng2temp?.replace(/[,_]/g, '');

  // Numerify capture group 1
  if (!numberGroup1 && numberGroup2 && numberGroup2.startsWith('.')) {
    finalResult = 0;
  } else {
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
};

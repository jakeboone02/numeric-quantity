import {
  numericRegex,
  numericRegexWithTrailingInvalid,
  vulgarFractionToAsciiMap,
  vulgarFractionsRegex,
} from './constants';
import { parseRomanNumerals } from './parseRomanNumerals';
import { NumericQuantityOptions } from './types';

const spaceThenSlashRegex = /^\s*\//;

/**
 * Converts a string to a number, like an enhanced version of `parseFloat`.
 *
 * The string can include mixed numbers, vulgar fractions, or Roman numerals.
 */
export const numericQuantity = (
  quantity: string | number,
  options: NumericQuantityOptions = { allowTrailingInvalid: false }
) => {
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

  const regexResult = (
    options?.allowTrailingInvalid
      ? numericRegexWithTrailingInvalid
      : numericRegex
  ).exec(quantityAsString);

  // If the Arabic numeral regex fails, try Roman numerals
  if (!regexResult) {
    return parseRomanNumerals(quantityAsString);
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

  if (numberGroup2.startsWith('.')) {
    // If first char is "." it's a decimal so just trim to 3 decimal places
    const numerator = parseFloat(numberGroup2);
    finalResult += Math.round(numerator * 1000) / 1000;
  } else if (spaceThenSlashRegex.test(numberGroup2)) {
    // If the first non-space char is "/" it's a pure fraction (e.g. "1/2")
    const numerator = parseInt(numberGroup1);
    const denominator = parseInt(numberGroup2.replace('/', ''));
    finalResult = Math.round((numerator * 1000) / denominator) / 1000;
  } else {
    // Otherwise it's a mixed fraction (e.g. "1 2/3")
    const fractionArray = numberGroup2.split('/');
    const [numerator, denominator] = fractionArray.map(v => parseInt(v));
    finalResult += Math.round((numerator * 1000) / denominator) / 1000;
  }

  return dash ? finalResult * -1 : finalResult;
};

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
  | '⅞';

export const vulgarFractionToAsciiMap = {
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
} as const;

/**
 * Captures the individual elements of a numeric string.
 *
 * Capture groups:
 *
 *     +=====+====================+========================+
 *     |  #  |    Description     |        Example         |
 *     +=====+====================+========================+
 *     |  0  |  entire string     |  "2 1/3" from "2 1/3"  |
 *     +-----+--------------------+------------------------+
 *     |  1  |  "negative" dash   |  "-" from "-2 1/3"     |
 *     +-----+--------------------+------------------------+
 *     |  2  |  the whole number  |  "2" from "2 1/3"      |
 *     |     |  - OR -            |                        |
 *     |     |  the numerator     |  "1" from "1/3"        |
 *     +-----+--------------------+------------------------+
 *     |  3  |  entire fraction   |  "1/3" from "2 1/3"    |
 *     |     |  - OR -            |                        |
 *     |     |  decimal portion   |  ".33" from "2.33"     |
 *     |     |  - OR -            |                        |
 *     |     |  denominator       |  "/3" from "1/3"       |
 *     +=====+====================+========================+
 *
 * @example
 *     numericRegex.exec("1")     // [ "1",     "1", null,   null ]
 *     numericRegex.exec("1.23")  // [ "1.23",  "1", ".23",  null ]
 *     numericRegex.exec("1 2/3") // [ "1 2/3", "1", " 2/3", " 2" ]
 *     numericRegex.exec("2/3")   // [ "2/3",   "2", "/3",   null ]
 *     numericRegex.exec("2 / 3") // [ "2 / 3", "2", "/ 3",  null ]
 */
export const numericRegex = /^(-)?\s*(\d*)(\.\d+|(\s+\d*\s*)?\s*\/\s*\d+)?\s*$/;

/**
 * Captures any unicode vulgar fractions
 */
export const vulgarFractionsRegex = /(¼|½|¾|⅐|⅑|⅒|⅓|⅔|⅕|⅖|⅗|⅘|⅙|⅚|⅛|⅜|⅝|⅞)/;

const spaceThenSlashRegex = /^\s*\//;

const badResult = NaN;

/**
 * Converts a string to a number.  The string can include mixed numbers
 * or vulgar fractions.
 */
export function numericQuantity(qty: string) {
  let finalResult = badResult;

  // Coerce to string in case qty is a number
  const sQty = `${qty}`
    // Convert vulgar fractions to ASCII, with a leading space
    // to keep the whole number and the fraction separate
    .replace(
      vulgarFractionsRegex,
      (_m, vf: keyof typeof vulgarFractionToAsciiMap) =>
        ` ${vulgarFractionToAsciiMap[vf]}`
    )
    // Convert fraction slash to standard slash
    .replace(/⁄/, '/')
    .trim();

  // Bail out if the string was only white space
  if (sQty.length === 0) {
    return badResult;
  }

  const regexResult = numericRegex.exec(sQty);

  // Bail out if the regex fails
  if (!regexResult) {
    return badResult;
  }

  const [, dash, numberGroup1, numberGroup2] = regexResult;

  // Numerify capture group 1
  if (!numberGroup1 && numberGroup2 && numberGroup2.startsWith('.')) {
    finalResult = 0;
  } else {
    finalResult = parseInt(numberGroup1);
  }

  if (isNaN(finalResult)) {
    return badResult;
  }

  // If capture group 2 is null, then we're dealing with an integer
  // and there is nothing left to process
  if (!numberGroup2) {
    return finalResult * (dash === '-' ? -1 : 1);
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

  return finalResult * (dash === '-' ? -1 : 1);
}

type VulgarFraction =
  | '\u00BC'
  | '\u00BD'
  | '\u00BE'
  | '\u2150'
  | '\u2151'
  | '\u2152'
  | '\u2153'
  | '\u2154'
  | '\u2155'
  | '\u2156'
  | '\u2157'
  | '\u2158'
  | '\u2159'
  | '\u215A'
  | '\u215B'
  | '\u215C'
  | '\u215D'
  | '\u215E';

/**
 * Converts a string to a number.  The string can include mixed numbers
 * or vulgar fractions.
 */
function numericQuantity(qty: string) {
  const badResult = NaN;
  let finalResult = badResult;

  // Resolve any unicode vulgar fractions
  const vulgarFractionsRegex = /(\u00BC|\u00BD|\u00BE|\u2150|\u2151|\u2152|\u2153|\u2154|\u2155|\u2156|\u2157|\u2158|\u2159|\u215A|\u215B|\u215C|\u215D|\u215E)/;

  const vulgarFractionsCharMap: { [k in VulgarFraction]: string } = {
    '\u00BC': ' 1/4',
    '\u00BD': ' 1/2',
    '\u00BE': ' 3/4',
    '\u2150': ' 1/7',
    '\u2151': ' 1/9',
    '\u2152': ' 1/10',
    '\u2153': ' 1/3',
    '\u2154': ' 2/3',
    '\u2155': ' 1/5',
    '\u2156': ' 2/5',
    '\u2157': ' 3/5',
    '\u2158': ' 4/5',
    '\u2159': ' 1/6',
    '\u215A': ' 5/6',
    '\u215B': ' 1/8',
    '\u215C': ' 3/8',
    '\u215D': ' 5/8',
    '\u215E': ' 7/8',
  };

  const sQty = `${qty}`
    .replace(
      vulgarFractionsRegex,
      (m, vf: VulgarFraction) => vulgarFractionsCharMap[vf]
    )
    .trim();

  /**
   *                    Regex captures
   *
   *  +=====+====================+========================+
   *  |  #  |    Description     |        Example         |
   *  +=====+====================+========================+
   *  |  0  |  entire string     |  "2 2/3" from "2 2/3"  |
   *  +-----+--------------------+------------------------+
   *  |  1  |  the dash          |  "-" from "-2 2/3"     |
   *  +-----+--------------------+------------------------+
   *  |  2  |  the whole number  |  "2" from "2 2/3"      |
   *  |     |  - OR -            |                        |
   *  |     |  the numerator     |  "2" from "2/3"        |
   *  +-----+--------------------+------------------------+
   *  |  3  |  entire fraction   |  "2/3" from "2 2/3"    |
   *  |     |  - OR -            |                        |
   *  |     |  decimal portion   |  ".66" from "2.66"     |
   *  |     |  - OR -            |                        |
   *  |     |  denominator       |  "/3" from "2/3"       |
   *  +=====+====================+========================+
   *
   *  re.exec("1")       // [ "1",     "1", null,   null ]
   *  re.exec("1.23")    // [ "1.23",  "1", ".23",  null ]
   *  re.exec("1 2/3")   // [ "1 2/3", "1", " 2/3", " 2" ]
   *  re.exec("2/3")     // [ "2/3",   "2", "/3",   null ]
   *  re.exec("2 / 3")   // [ "2 / 3", "2", "/ 3",  null ]
   */
  const re = /^(-)?\s*(\d*)(\.\d+|(\s+\d*\s*)?\s*\/\s*\d+)?$/;

  const ar = re.exec(sQty);

  // If the regex fails, give up
  if (!ar) {
    return badResult;
  }

  // Store the capture groups so we don't have to access the array
  // elements over and over
  const [, dash, numberGroup1, numberGroup2] = ar;

  // The regex can pass and still capture nothing in the relevant groups,
  // which means it failed for our purposes
  if (!numberGroup1 && !numberGroup2) {
    return badResult;
  }

  // Numerify capture group 1
  if (!numberGroup1 && numberGroup2 && numberGroup2.search(/^\./) !== -1) {
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

  if (numberGroup2.search(/^\./) !== -1) {
    // If first char is "." it's a decimal so just trim to 3 decimal places
    const numerator = parseFloat(numberGroup2);
    finalResult += Math.round(numerator * 1000) / 1000;
  } else if (numberGroup2.search(/^\s*\//) !== -1) {
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

export default numericQuantity;

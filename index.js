module.exports = function(qty) {

  var finalResult = -1;

  // Resolve any unicode vulgar fractions
  var sQty = (qty + "")
    .replace(/\u00BC/g, " 1/4")
    .replace(/\u00BD/g, " 1/2")
    .replace(/\u00BE/g, " 3/4")
    .replace(/\u2150/g, " 1/7")
    .replace(/\u2151/g, " 1/9")
    .replace(/\u2152/g, " 1/10")
    .replace(/\u2153/g, " 1/3")
    .replace(/\u2154/g, " 2/3")
    .replace(/\u2155/g, " 1/5")
    .replace(/\u2156/g, " 2/5")
    .replace(/\u2157/g, " 3/5")
    .replace(/\u2158/g, " 4/5")
    .replace(/\u2159/g, " 1/6")
    .replace(/\u215A/g, " 5/6")
    .replace(/\u215B/g, " 1/8")
    .replace(/\u215C/g, " 3/8")
    .replace(/\u215D/g, " 5/8")
    .replace(/\u215E/g, " 7/8");

  /*
                    Regex captures

  +=====+====================+========================+
  |  #  |    Description     |        Example         |
  +=====+====================+========================+
  |  0  |  entire string     |  "2 2/3" from "2 2/3"  |
  +-----+--------------------+------------------------+
  |  1  |  the whole number  |  "2" from "2 2/3"      |
  |     |  - OR -            |                        |
  |     |  the numerator     |  "2" from "2/3"        |
  +-----+--------------------+------------------------+
  |  2  |  entire fraction   |  "2/3" from "2 2/3"    |
  |     |  - OR -            |                        |
  |     |  decimal portion   |  ".66" from "2.66"     |
  |     |  - OR -            |                        |
  |     |  denominator       |  "/3" from "2/3"       |
  +=====+====================+========================+

  re.exec("1")       // [ "1",     "1", null,   null ]
  re.exec("1.23")    // [ "1.23",  "1", ".23",  null ]
  re.exec("1 2/3")   // [ "1 2/3", "1", " 2/3", " 2" ]
  re.exec("2/3")     // [ "2/3",   "2", "/3",   null ]
  re.exec("2 / 3")   // [ "2 / 3", "2", "/ 3",  null ]
  */
  var re = /^\s*(\d+)(\.\d+|(\s+\d*\s*)?\s*\/\s*\d+)?\s*$/;

  var ar = re.exec(sQty);

  // if the regex fails, return -1
  if ( ar == null ) {
    return finalResult;
  }

  var fractionArray;
  var numerator = 0;
  var denominator = 1;

  // Numerify capture section [1]
  finalResult = parseInt( ar[1] );

  // If capture section [2] is null, then we're dealing with an integer
  // and there is nothing left to process
  if ( ar[2] == null ) {
    return finalResult;
  }

  if ( ar[2].search(/^\./) !== -1 ) {

    // If first char is "." it's a decimal so just trim to 3 decimal places
    numerator = parseFloat( ar[2] );
    finalResult += Math.round(numerator * 1000) / 1000;

  } else if ( ar[2].search(/^\s*\//) != -1 ) {

    // If the first non-space char is "/" it's a pure fraction (e.g. "1/2")
    numerator = parseInt( ar[1] );
    denominator = parseInt( ar[2].replace("/", "") );
    finalResult = Math.round((numerator * 1000) / denominator) / 1000;

  } else {

    // Otherwise it's a mixed fraction (e.g. "1 2/3")
    fractionArray = ar[2].split("/");
    numerator = parseInt( fractionArray[0] );
    denominator = parseInt( fractionArray[1] );
    finalResult += Math.round( numerator * 1000 / denominator ) / 1000;

  }

  return finalResult;
}

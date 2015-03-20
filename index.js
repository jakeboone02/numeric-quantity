module.exports = function(qty) {

  var finalResult = -1;

  // Resolve any unicode vulgar fractions
  var vulgarFractionsRegex = /(\u00BC|\u00BD|\u00BE|\u2150|\u2151|\u2152|\u2153|\u2154|\u2155|\u2156|\u2157|\u2158|\u2159|\u215A|\u215B|\u215C|\u215D|\u215E)/;

  var vulgarFractionsCharMap = {
    "\u00BC": " 1/4",
    "\u00BD": " 1/2",
    "\u00BE": " 3/4",
    "\u2150": " 1/7",
    "\u2151": " 1/9",
    "\u2152": " 1/10",
    "\u2153": " 1/3",
    "\u2154": " 2/3",
    "\u2155": " 1/5",
    "\u2156": " 2/5",
    "\u2157": " 3/5",
    "\u2158": " 4/5",
    "\u2159": " 1/6",
    "\u215A": " 5/6",
    "\u215B": " 1/8",
    "\u215C": " 3/8",
    "\u215D": " 5/8",
    "\u215E": " 7/8"
  };

  var sQty = (qty + "").replace(vulgarFractionsRegex, function(m, vf) {
    return vulgarFractionsCharMap[vf];
  });

  /**
   *                    Regex captures
   *
   *  +=====+====================+========================+
   *  |  #  |    Description     |        Example         |
   *  +=====+====================+========================+
   *  |  0  |  entire string     |  "2 2/3" from "2 2/3"  |
   *  +-----+--------------------+------------------------+
   *  |  1  |  the whole number  |  "2" from "2 2/3"      |
   *  |     |  - OR -            |                        |
   *  |     |  the numerator     |  "2" from "2/3"        |
   *  +-----+--------------------+------------------------+
   *  |  2  |  entire fraction   |  "2/3" from "2 2/3"    |
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

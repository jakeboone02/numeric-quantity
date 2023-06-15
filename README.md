# numeric-quantity

[![npm][badge-npm]](https://www.npmjs.com/package/numeric-quantity)
![workflow status](https://github.com/jakeboone02/numeric-quantity/actions/workflows/main.yml/badge.svg)
[![codecov.io](https://codecov.io/github/jakeboone02/numeric-quantity/coverage.svg?branch=main)](https://codecov.io/github/jakeboone02/numeric-quantity?branch=main)
[![downloads](https://img.shields.io/npm/dm/numeric-quantity.svg)](http://npm-stat.com/charts.html?package=numeric-quantity&from=2015-08-01)
[![MIT License](https://img.shields.io/npm/l/numeric-quantity.svg)](http://opensource.org/licenses/MIT)

Converts a string to a number, like an enhanced version of `parseFloat`.

In addition to plain integers and decimals, `numeric-quantity` can parse numbers with comma or underscore separators (`'1,000'` or `'1_000'`), mixed numbers (`'1 2/3'`), vulgar fractions (`'1⅖'`), the fraction slash character (`'1 2⁄3'`), and Roman numerals (`'MCCXIV'` or `'Ⅻ'`). The return value will be `NaN` if the provided string does not resemble a number.

To allow and ignore trailing invalid characters _à la_ `parseFloat`, pass `{ allowTrailingInvalid: true }` as the second argument.

> _For the inverse operation—converting a number to an imperial measurement—check out [format-quantity](https://www.npmjs.com/package/format-quantity)._
>
> _For a more complete solution to parsing recipe ingredients, try [parse-ingredient](https://www.npmjs.com/package/parse-ingredient)._

## Usage

### Installed

```js
import { numericQuantity } from 'numeric-quantity';

console.log(numericQuantity('1 1/2')); // 1.5
console.log(numericQuantity('2 2/3')); // 2.667
```

### CDN

As an ES module:

```html
<script type="module">
  import { numericQuantity } from 'https://cdn.jsdelivr.net/npm/numeric-quantity/+esm';

  console.log(numericQuantity('10½')); // 10.5
</script>
```

As UMD (all exports are properties of the global object `NumericQuantity`):

```html
<script src="https://unpkg.com/numeric-quantity"></script>
<script>
  console.log(NumericQuantity.numericQuantity('xii')); // 12
</script>
```

## Other exports

| Name                              | Type        | Description                                                                                          |
| --------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| `numericRegex`                    | `RegExp`    | Regular expression matching a string that resembles a number (using Arabic numerals) in its entirety |
| `numericRegexWithTrailingInvalid` | `RegExp`    | Same as `numericRegex`, but allows/ignores trailing invalid characters.                              |
| `VulgarFraction`                  | `type`      | Union type of all unicode vulgar fraction code points                                                |
| `vulgarFractionsRegex`            | `RegExp`    | Regular expression matching the first unicode vulgar fraction code point                             |
| `vulgarFractionToAsciiMap`        | `object`    | Mapping of each vulgar fraction to its traditional ASCII representation (e.g., `'½'` to `'1/2'`)     |
| `parseRomanNumerals`              | `function`  | Same function signature as `numericQuantity`, but only for Roman numerals (used internally)          |
| `romanNumeralRegex`               | `RegExp`    | Regular expression matching valid Roman numeral sequences (uses modern, strict rules)                |
| `romanNumeralUnicodeRegex`        | `RegExp`    | Regular expression matching any unicode Roman numeral code point                                     |
| `romanNumeralUnicodeToAsciiMap`   | `object`    | Mapping of each Roman numeral to its traditional ASCII representation (e.g., `'Ⅻ'` to `'XII'`)       |
| `romanNumeralValues`              | `object`    | Mapping of each valid Roman numeral sequence fragment to its numeric value                           |
| `NumericQuantityOptions`          | `interface` | Shape of the (optional) second argument to `numericQuantity`                                         |
| `RomanNumeralAscii`               | `type`      | Union type of allowable Roman numeral characters (uppercase only)                                    |
| `RomanNumeralUnicode`             | `type`      | Union type of all Unicode Roman numeral characters (representing 1-12, 50, 100, 500, and 1000)       |
| `RomanNumeral`                    | `type`      | Union type of `RomanNumeralAscii` and `RomanNumeralUnicode`                                          |

[badge-npm]: https://img.shields.io/npm/v/numeric-quantity.svg?cacheSeconds=3600&logo=npm

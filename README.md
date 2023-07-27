[![npm][badge-npm]](https://www.npmjs.com/package/numeric-quantity)
![workflow status](https://github.com/jakeboone02/numeric-quantity/actions/workflows/main.yml/badge.svg)
[![codecov.io](https://codecov.io/github/jakeboone02/numeric-quantity/coverage.svg?branch=main)](https://codecov.io/github/jakeboone02/numeric-quantity?branch=main)
[![downloads](https://img.shields.io/npm/dm/numeric-quantity.svg)](http://npm-stat.com/charts.html?package=numeric-quantity&from=2015-08-01)
[![MIT License](https://img.shields.io/npm/l/numeric-quantity.svg)](http://opensource.org/licenses/MIT)

Converts a string to a number, like an enhanced version of `parseFloat`.

**[Full documentation](https://jakeboone02.github.io/numeric-quantity/)**

Features:

- In addition to plain integers and decimals, `numeric-quantity` can parse numbers with comma or underscore separators (`'1,000'` or `'1_000'`), mixed numbers (`'1 2/3'`), vulgar fractions (`'1⅖'`), and the fraction slash character (`'1 2⁄3'`).
- To allow and ignore trailing invalid characters _à la_ `parseFloat`, pass `{ allowTrailingInvalid: true }` as the second argument.
- To parse Roman numerals like `'MCCXIV'` or `'Ⅻ'`, pass `{ romanNumerals: true }` as the second argument or call `parseRomanNumerals` directly.
- Results will be rounded to three decimal places by default. To avoid rounding, pass `{ round: false }` as the second argument. To round to a different number of decimal places, assign that number to the `round` option (`{ round: 5 }` will round to five decimal places).
- Returns `NaN` if the provided string does not resemble a number.

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
  console.log(NumericQuantity.numericQuantity('xii', { romanNumerals: true })); // 12
</script>
```

[badge-npm]: https://img.shields.io/npm/v/numeric-quantity.svg?cacheSeconds=3600&logo=npm

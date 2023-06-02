# numeric-quantity

[![npm][badge-npm]](https://www.npmjs.com/package/numeric-quantity)
![workflow status](https://github.com/jakeboone02/numeric-quantity/actions/workflows/main.yml/badge.svg)
[![codecov.io](https://codecov.io/github/jakeboone02/numeric-quantity/coverage.svg?branch=master)](https://codecov.io/github/jakeboone02/numeric-quantity?branch=main)
[![downloads](https://img.shields.io/npm/dm/numeric-quantity.svg)](http://npm-stat.com/charts.html?package=numeric-quantity&from=2015-08-01)
[![MIT License](https://img.shields.io/npm/l/numeric-quantity.svg)](http://opensource.org/licenses/MIT)

Converts a string to a number, like an enhanced version of `parseFloat`.

In addition to plain integers and decimals, `numeric-quantity` can process mixed numbers (`'1 2/3'`), vulgar fractions (`'1⅖'`), and the fraction slash character (`'1 2⁄3'`). The return value will be `NaN` if the provided string does not resemble a number.

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

```html
<script type="module">
  import { numericQuantity } from 'https://cdn.jsdelivr.net/npm/numeric-quantity/+esm';

  console.log(numericQuantity('10½')); // 10.5
</script>
```

## Other exports

| Export                     | Type     | Description                                                                                          |
| -------------------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `numericRegex`             | `RegExp` | Regular expression matching strings that resemble numbers (also matches strings of pure white space) |
| `VulgarFraction`           | `type`   | Union type of all unicode vulgar fraction code points                                                |
| `vulgarFractionsRegex`     | `RegExp` | Regular expression matching any unicode vulgar fraction code point                                   |
| `vulgarFractionToAsciiMap` | `object` | Mapping of each vulgar fraction to its traditional ASCII representation (e.g, `'½'` to `'1/2'`)      |

[badge-npm]: https://img.shields.io/npm/v/numeric-quantity.svg?cacheSeconds=3600&logo=npm

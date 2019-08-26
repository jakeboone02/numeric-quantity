[![npm version](https://badge.fury.io/js/numeric-quantity.svg)](//npmjs.com/package/numeric-quantity)
[![Travis (.org)](https://img.shields.io/travis/jakeboone02/numeric-quantity)](https://travis-ci.org/jakeboone02/numeric-quantity)
[![codecov.io](https://codecov.io/github/jakeboone02/numeric-quantity/coverage.svg?branch=master)](https://codecov.io/github/jakeboone02/numeric-quantity?branch=master)
[![downloads](https://img.shields.io/npm/dm/numeric-quantity.svg)](http://npm-stat.com/charts.html?package=numeric-quantity&from=2015-08-01)
[![MIT License](https://img.shields.io/npm/l/numeric-quantity.svg)](http://opensource.org/licenses/MIT)

# numeric-quantity

Converts a string to a number. The string can include mixed numbers or vulgar fractions.

For the inverse operation, converting a number to an imperial measurement, check out [format-quantity](https://www.npmjs.com/package/format-quantity).

## Installation

### npm

```
npm i numeric-quantity
```

or

```
yarn add numeric-quantity
```

### Browser

In the browser, available as a global function `numericQuantity`.

```html
<script src="path/to/numeric-quantity.umd.js"></script>
<script>
  console.log(numericQuantity("10 1/2"));  // 10.5
</script>
```

## Usage

```js
import numericQuantity from 'numeric-quantity';

console.log( numericQuantity("1 1/2") );   // 1.5
console.log( numericQuantity("2 2/3") );   // 2.666
```

The return value will be `NaN` if the provided string does not resemble a number.

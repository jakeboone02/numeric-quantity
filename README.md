[![npm version](https://badge.fury.io/js/numeric-quantity.svg)](//npmjs.com/package/numeric-quantity)
[![Travis (.org)](https://img.shields.io/travis/jakeboone02/numeric-quantity)](https://travis-ci.org/jakeboone02/numeric-quantity)

# numeric-quantity

Converts a string to a number. The string can include mixed numbers or vulgar fractions.

For the inverse operation, converting a number to an imperial measurement, check out [format-quantity](https://www.npmjs.com/package/format-quantity).

### Installation

##### npm

```
npm i --save numeric-quantity
```

or

```
yarn add numeric-quantity
```

##### Browser

In the browser, available as a global function `numericQuantity`.

```html
<script src="path/to/numeric-quantity.umd.js"></script>
<script>
  console.log(numericQuantity("10 1/2"));  // 10.5
</script>
```

### Usage

```js
import numericQuantity from 'numeric-quantity';

console.log( numericQuantity("1 1/2") );   // 1.5
console.log( numericQuantity("2 2/3") );   // 2.666
```

# numeric-quantity

Converts a string to a number. The string can include mixed numbers or vulgar fractions.

### Installation

##### npm

[numeric-quantity](https://www.npmjs.com/package/numeric-quantity)

```
npm i --save numeric-quantity
```

##### Browser

In the browser, available as a global function `numericQuantity`.

```
<script src="bower_components/numeric-quantity/index.js"></script>
<script>
  console.log(numericQuantity("10 1/2"));  // 10.5
</script>
```

### Usage

```
var numericQuantity = require("numeric-quantity");  // assuming node environment

console.log( numericQuantity("1 1/2") );   // 1.5
console.log( numericQuantity("2 2/3") );   // 2.666
```

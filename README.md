[![npm][badge-npm]](https://www.npmjs.com/package/numeric-quantity)
![workflow status](https://github.com/jakeboone02/numeric-quantity/actions/workflows/main.yml/badge.svg)
[![codecov.io](https://codecov.io/github/jakeboone02/numeric-quantity/coverage.svg?branch=main)](https://codecov.io/github/jakeboone02/numeric-quantity?branch=main)
[![downloads](https://img.shields.io/npm/dm/numeric-quantity.svg)](https://npm-stat.com/charts.html?package=numeric-quantity&from=2015-08-01)
[![MIT License](https://img.shields.io/npm/l/numeric-quantity.svg)](https://opensource.org/licenses/MIT)

Converts a string to a number, like an enhanced version of `parseFloat`. Returns `NaN` if the provided string does not resemble a number.

**[Full documentation](https://jakeboone02.github.io/numeric-quantity/)**

In addition to plain integers and decimals, `numeric-quantity` handles:

- **Fractions and mixed numbers**: `'1 2/3'` → `1.667`, `'1⅖'` → `1.4`, `'1 2⁄3'` → `1.667`
- **Separators**: `'1,000'` → `1000`, `'1_000_000'` → `1000000`
- **Roman numerals** (see [option](#roman-numerals-romannumerals) below): `'XIV'` → `14`, `'Ⅻ'` → `12`
- **Non-ASCII numerals**: Arabic-Indic (`'٣'`), Devanagari (`'३'`), Bengali, Thai, Fullwidth, and 70+ other Unicode digit scripts

> _For the inverse operation—converting a number to an imperial measurement—check out [format-quantity](https://www.npmjs.com/package/format-quantity)._

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

## Options

All options are passed as the second argument to `numericQuantity` (and `isNumericQuantity`).

### Rounding (`round`)

Results are rounded to three decimal places by default. Use the `round` option to change this behavior.

```js
numericQuantity('1/3'); // 0.333 (default: 3 decimal places)
numericQuantity('1/3', { round: 5 }); // 0.33333
numericQuantity('1/3', { round: false }); // 0.3333333333333333
```

Coercion rules:

- Non-finite values (`NaN`, `Infinity`, `-Infinity`) are treated as `false`, i.e. no rounding.
- Negative values clamp to `0`, i.e. round to a whole number.
- `round` does not apply to `bigint` results (see [`bigIntOnOverflow`](#large-numbers-bigintonoverflow)).
- When the `percentage` option divides by 100, `round` applies to the value _as written_, before the division (see [Percentages](#percentages-percentage)).

### Trailing Invalid Characters (`allowTrailingInvalid`)

By default, strings with trailing non-numeric characters return `NaN`. Set `allowTrailingInvalid: true` to ignore trailing invalid characters, similar to `parseFloat`.

```js
numericQuantity('100abc'); // NaN
numericQuantity('100abc', { allowTrailingInvalid: true }); // 100
```

### Roman Numerals (`romanNumerals`)

Parse Roman numerals (ASCII or Unicode) by setting `romanNumerals: true`. You can also use `parseRomanNumerals` directly.

```js
numericQuantity('MCCXIV', { romanNumerals: true }); // 1214
numericQuantity('Ⅻ', { romanNumerals: true }); // 12
numericQuantity('xiv', { romanNumerals: true }); // 14 (case-insensitive)
```

### Decimal Separator (`decimalSeparator`)

For European-style numbers where comma is the decimal separator, set `decimalSeparator: ','`.

```js
numericQuantity('1,5'); // 15 (comma treated as thousands separator)
numericQuantity('1,5', { decimalSeparator: ',' }); // 1.5
numericQuantity('1.000,50', { decimalSeparator: ',' }); // 1000.5
```

### Large Numbers (`bigIntOnOverflow`)

When the parsed value exceeds `Number.MAX_SAFE_INTEGER` or is less than `Number.MIN_SAFE_INTEGER`, set `bigIntOnOverflow: true` to return a `bigint` instead.

```js
numericQuantity('9007199254740993'); // 9007199254740992 (loses precision)
numericQuantity('9007199254740993', { bigIntOnOverflow: true }); // 9007199254740993n
```

This applies to _any_ overflowing value, not just integers as written—decimals, fractions, mixed numbers, and exponents all participate. The value is evaluated exactly as a rational number and only rounded at the end.

```js
const opts = { bigIntOnOverflow: true };
numericQuantity('9007199254740993.5', opts); // 9007199254740994n (half-up)
numericQuantity('-9007199254740993.5', opts); // -9007199254740994n (half away from zero)
numericQuantity('9007199254740993 1/2', opts); // 9007199254740994n
numericQuantity('9007199254740993e1', opts); // 90071992547409930n (exact, no rounding)
```

Notes:

- **Fractional tails are unrecoverable anyway.** Past `Number.MAX_SAFE_INTEGER` the gap between adjacent `number` values is 2, so no `number` can carry a fraction at that magnitude. Rounding to a `bigint` loses less than falling back to `number` would.
- **`round` is not consulted.** `bigint` has no fractional representation, so `round: false` does not disable the half-up rounding.
- **Rounding can _cause_ overflow.** `numericQuantity('9007199254740991.6', opts)` is `9007199254740992n`, even though the integer part as written is within range.
- **`percentage` division is folded in exactly**, as a factor of `100n` in the denominator, so it is subject to the same single half-up rounding at the end.

  ```js
  const opts = { bigIntOnOverflow: true, percentage: true };
  numericQuantity('900719925474099300%', opts); // 9007199254740993n (exact)
  numericQuantity('900719925474099399%', opts); // 9007199254740994n (rounded)
  ```

### Percentages (`percentage`)

Parse percentage strings by setting the `percentage` option. Use `'decimal'` (or `true`) to divide by 100, or `'number'` to just strip the `%` symbol.

```js
numericQuantity('50%'); // NaN
numericQuantity('50%', { percentage: true }); // 0.5
numericQuantity('50%', { percentage: 'decimal' }); // 0.5
numericQuantity('50%', { percentage: 'number' }); // 50
numericQuantity('1/2%', { percentage: true }); // 0.005
```

`round` applies to the value as written, _before_ the division by 100, so the requested number of decimal places is not silently reduced:

```js
numericQuantity('12.345%', { percentage: true, round: 3 }); // 0.12345, not 0.123
numericQuantity('1%', { percentage: true, round: 0 }); // 0.01
numericQuantity('1.0%', { percentage: true, round: 0 }); // 0.01
numericQuantity('1/1%', { percentage: true, round: 0 }); // 0.01
```

Roman numerals honor `percentage` as well:

```js
numericQuantity('L%', { percentage: true, romanNumerals: true }); // 0.5
```

### Currency Symbols (`allowCurrency`)

Strip currency symbols from the start or end of the string by setting `allowCurrency: true`. Supports all Unicode currency symbols (`$`, `€`, `£`, `¥`, `₹`, `₽`, `₿`, `₩`, etc.).

```js
numericQuantity('$100'); // NaN
numericQuantity('$100', { allowCurrency: true }); // 100
numericQuantity('€1.000,50', { allowCurrency: true, decimalSeparator: ',' }); // 1000.5
numericQuantity('100€', { allowCurrency: true }); // 100
numericQuantity('-$50', { allowCurrency: true }); // -50
```

Currency symbols and the `%` suffix may appear in either order, but at most one `%` is stripped per parse:

```js
const opts = { allowCurrency: true, percentage: true };
numericQuantity('50%€', opts); // 0.5
numericQuantity('100€%', opts); // 1
numericQuantity('100 € %', opts); // 1
numericQuantity('50%%', opts); // NaN
numericQuantity('50%€%', opts); // NaN
```

### Verbose Output (`verbose`)

Set `verbose: true` to return a detailed result object instead of just the numeric value. This is useful for understanding what was parsed and stripped.

```js
numericQuantity('$50%', {
  verbose: true,
  allowCurrency: true,
  percentage: true,
});
// {
//   value: 0.5,
//   input: '$50%',
//   currencyPrefix: '$',
//   percentageSuffix: true
// }

numericQuantity('100abc', {
  verbose: true,
  allowTrailingInvalid: true,
});
// {
//   value: 100,
//   input: '100abc',
//   trailingInvalid: 'abc'
// }
```

For fraction and mixed-number inputs, the result also includes parsed fraction components (always unsigned):

```js
numericQuantity('1 2/3', { verbose: true });
// {
//   value: 1.667,
//   input: '1 2/3',
//   whole: 1,
//   numerator: 2,
//   denominator: 3
// }

numericQuantity('½', { verbose: true });
// {
//   value: 0.5,
//   input: '½',
//   numerator: 1,
//   denominator: 2
// }
```

The verbose result object has the following shape:

```ts
interface NumericQuantityVerboseResult {
  value: number | bigint; // The parsed value (NaN if invalid)
  input: string; // Original input string
  currencyPrefix?: string; // Currency symbol(s) stripped from start
  currencySuffix?: string; // Currency symbol(s) stripped from end
  percentageSuffix?: boolean; // True if "%" was stripped
  trailingInvalid?: string; // Characters ignored (if allowTrailingInvalid)
  sign?: '-' | '+'; // Leading sign character, if present
  whole?: number; // Whole part of a mixed fraction (e.g. 1 from "1 2/3")
  numerator?: number; // Fraction numerator (e.g. 2 from "1 2/3")
  denominator?: number; // Fraction denominator (e.g. 3 from "1 2/3")
}
```

## `Infinity`

`Infinity` is a valid result, not an error. Division by zero and overflowing exponents both produce it, and `isNumericQuantity` returns `true` for them.

```js
numericQuantity('1/0'); // Infinity
numericQuantity('1e400'); // Infinity
isNumericQuantity('1/0'); // true
```

## Additional Exports

### `isNumericQuantity(str, options?): boolean`

Returns `true` if the string can be parsed as a valid number, `false` otherwise. Accepts the same options as `numericQuantity`.

```js
import { isNumericQuantity } from 'numeric-quantity';

isNumericQuantity('1 1/2'); // true
isNumericQuantity('abc'); // false
isNumericQuantity('XII', { romanNumerals: true }); // true
isNumericQuantity('$100', { allowCurrency: true }); // true
isNumericQuantity('50%', { percentage: true }); // true
```

### `parseRomanNumerals(str): number`

Parses a string of Roman numerals directly. Returns `NaN` for invalid input.

```js
import { parseRomanNumerals } from 'numeric-quantity';

parseRomanNumerals('MCMXCIX'); // 1999
parseRomanNumerals('Ⅻ'); // 12
parseRomanNumerals('invalid'); // NaN
```

### Constants and utilities

The internals used by the parser are also part of the public API and are safe to depend on:

| Export                                                       | Description                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `normalizeDigits(str)`                                       | Converts non-ASCII decimal digits (70+ Unicode scripts) to ASCII `0`–`9` |
| `numericRegex`                                               | The core pattern matched against a fully normalized string               |
| `numericRegexWithTrailingInvalid`                            | Same, but with a trailing capture group for `allowTrailingInvalid`       |
| `vulgarFractionToAsciiMap` / `vulgarFractionsRegex`          | Vulgar fraction characters (`½`, `⅔`, …) and their ASCII equivalents     |
| `superSubDigitToAsciiMap` / `superSubDigitsRegex`            | Superscript/subscript digits (`¹`, `₂`, …) and their ASCII equivalents   |
| `romanNumeralValues` / `romanNumeralRegex`                   | Roman numeral values and the validation pattern                          |
| `romanNumeralUnicodeToAsciiMap` / `romanNumeralUnicodeRegex` | Unicode Roman numeral characters (`Ⅻ`, …) and their ASCII equivalents    |
| `defaultOptions`                                             | The fully-resolved default option set                                    |

[badge-npm]: https://img.shields.io/npm/v/numeric-quantity.svg?cacheSeconds=3600&logo=npm

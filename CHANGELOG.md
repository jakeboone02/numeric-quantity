# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

N/A

## [v3.2.1] - 2026-02-13

### Fixed

- Parsing of Unicode superscript/subscript fraction notation (e.g. `¹⁄₂`) now works correctly by normalizing superscript (`⁰`–`⁹`) and subscript (`₀`–`₉`) digits to ASCII before processing.

## [v3.2.0] - 2026-02-12

### Added

- [#39] `isNumericQuantity(str, options?)` function for boolean validation without parsing.
- [#39] `percentage` option to parse percentage strings (`"50%"` → `0.5` with `'decimal'`/`true`, or `50` with `'number'`).
- [#39] `allowCurrency` option to strip Unicode currency symbols (`$`, `€`, `£`, `¥`, `₹`, `₿`, etc.) from prefix or suffix.
- [#39] `verbose` option to return a detailed result object with the following fields:
  - `value` — the parsed numeric value (`NaN` if invalid).
  - `input` — the original input string.
  - `currencyPrefix` / `currencySuffix` — currency symbol(s) stripped from start/end, if any.
  - `percentageSuffix` — `true` if a `%` suffix was stripped.
  - `trailingInvalid` — trailing non-numeric characters detected in the input, if any. Populated regardless of the `allowTrailingInvalid` setting.
  - `sign` — the leading sign character (`'-'` or `'+'`), if present.
  - `whole` — the whole-number part of a mixed fraction (e.g. `1` from `"1 2/3"`).
  - `numerator` / `denominator` — fraction components (e.g. `2` and `3` from `"1 2/3"`). Always unsigned.
- [#39] Leading `+` sign support: `numericQuantity('+42')` now returns `42` instead of `NaN`. Works with all input forms including fractions (`'+1/2'`), mixed numbers (`'+1 1/2'`), decimals (`'+1.5'`), and currency (`'+$100'`).

## [v3.1.0] - 2026-02-11

### Added

- [#38] Support for non-ASCII decimal numeral systems (Arabic-Indic, Devanagari, Bengali, Thai, Fullwidth, and 70+ other Unicode `\p{Nd}` digit blocks). For example, `numericQuantity('٣')` now returns `3`.

## [v3.0.0] - 2026-01-21

### Changed

- [#37] Now requires ES2021+ (uses `String.prototype.replaceAll`).
- [#37] In line with the rules of modern JavaScript syntax, repeated separators (e.g. `"1__0"` or `"1,,0"`) are considered invalid. The `allowTrailingInvalid` option will still permit evaluation of characters before any duplicate separators.

### Added

- [#37] Option `decimalSeparator`, accepting values `"."` (default) and `","`. When set to `","`, numbers will be evaluated with European-style decimal comma (e.g. `1,0` is equivalent to `1`, not `10`).

## [v2.1.0] - 2025-06-09

### Added

- `bigIntOnOverflow` option will produce a `bigint` value if the input represents a valid integer greater than `Number.MAX_SAFE_INTEGER` or less than `Number.MIN_SAFE_INTEGER`.

## [v2.0.1] - 2024-01-15

### Fixed

- Corrected links in `package.json` to distributed type definition files.

## [v2.0.0] - 2023-06-16

### Changed

- [#26] `numericQuantity` is now a named export; there is no default export.
- [#26] UMD build assigns all exports, including `numericQuantity`, to the global object `NumericQuantity`. Previously, it assigned the main function to the global namespace as `numericQuantity`.

### Added

- [#26] Support for comma (`','`) and underscore (`'_'`) separators within Arabic numeral sequences. If a numeric sequence has a leading or trailing separator, that sequence will be considered invalid. This will cause `numericQuantity` to return `NaN` unless `allowTrailingInvalid` is `true` (see next item), in which case the sequence in question and everything after it will be ignored.
- [#26] Options object as optional second parameter. Accepts the following options:
  - `allowTrailingInvalid` (`boolean`, default `false`): Allows `numericQuantity` to more closely resemble the behavior of `parseFloat` by accepting and ignoring everything from the first invalid character to the end of the string.
  - `romanNumerals` (`boolean`, default `false`): Enables support for Roman numerals with modern, strict rules, including the Unicode code points `U+2160` through `U+217F`. Roman numerals will only be parsed if an attempt to parse the string based on Arabic numerals fails. To parse Roman numerals unconditionally, call `parseRomanNumerals` directly.
  - `round` (`number | false`, default `3`): Rounds the result to the specified number of decimal places. Use `round: false` to avoid rounding.
- [#26] Support for Unicode "Fraction Numerator One" code point (`'⅟'`, `U+215F`), which must be followed by a numeric sequence (the denominator) to be considered part of a valid fraction representation.
- [#26] Named exports of internal utilities like regular expressions, character maps, types, etc.
- [#26] Build with [tsup](https://tsup.egoist.dev/).

## [v1.0.4] - 2022-04-16

### Fixed

- Corrected filenames in [package.json](./package.json).

## [v1.0.3] - 2022-04-16

### Added

- Build with [Vite](https://vitejs.dev/).

## [v1.0.2] - 2021-08-23

### Added

- [#21] Support for Unicode fraction slash (`⁄`, `U+2044`).

## [v1.0.1] - 2021-02-15

### Fixed

- Added description to [package.json](./package.json).

## [v1.0.0] - 2021-02-11

### Added

- [#12] Build with [tsdx](https://tsdx.io/).

## [v0.5.2] - 2021-02-08

### Fixed

- Updated CI badges on [README.md](./README.md).

## [v0.5.1] - 2019-08-24

### Fixed

- [README.md](./README.md) note about return values.

## [v0.5.0] - 2019-08-24

### Changed

- Returns `NaN` for invalid inputs instead of `-1`.

### Fixed

- [#3] Handles negative numbers.

## [v0.4.2] - 2019-08-23

### Fixed

- Publish `dist` directory only.

## [v0.4.1] - 2019-08-23

### Changed

- Rewritten in TypeScript.

### Added

- Build with [Rollup](https://rollupjs.org/).

## [v0.4.0] - 2019-08-22

### Added

- ESM and CJS builds.

## [v0.3.3] - 2019-07-21

### Added

- JSDoc comments for tooltips

## [v0.3.2] - 2018-09-21

### Added

- TypeScript types.

## [v0.3.1] - 2015-07-16

### Fixed

- Documentation update.

## [v0.3.0] - 2015-07-16

### Added

- UMD support.

### Fixed

- Minor bug fixes.

## [v0.2.0] - 2015-05-14

### Added

- [#1] Accept decimals without a leading zero.

## [v0.1.2] - 2015-03-20

### Fixed

- Minor performance improvement.

## [v0.1.1] - 2015-03-19

### Changed

- Use `parseInt`/`parseFloat` instead of `str - 0` to parse numbers from strings.

## [v0.1.0] - 2015-03-18

### Added

- Initial release.

<!-- Issue/PR links -->

[#1]: https://github.com/jakeboone02/numeric-quantity/issues/1
[#3]: https://github.com/jakeboone02/numeric-quantity/issues/3
[#21]: https://github.com/jakeboone02/numeric-quantity/pull/21
[#12]: https://github.com/jakeboone02/numeric-quantity/pull/12
[#26]: https://github.com/jakeboone02/numeric-quantity/pull/26
[#37]: https://github.com/jakeboone02/numeric-quantity/pull/37
[#38]: https://github.com/jakeboone02/numeric-quantity/pull/38
[#39]: https://github.com/jakeboone02/numeric-quantity/pull/39

<!-- Release comparison links -->

[unreleased]: https://github.com/jakeboone02/numeric-quantity/compare/v3.2.1...HEAD
[v3.2.1]: https://github.com/jakeboone02/numeric-quantity/compare/v3.2.0...v3.2.1
[v3.2.0]: https://github.com/jakeboone02/numeric-quantity/compare/v3.1.0...v3.2.0
[v3.1.0]: https://github.com/jakeboone02/numeric-quantity/compare/v3.0.0...v3.1.0
[v3.0.0]: https://github.com/jakeboone02/numeric-quantity/compare/v2.1.0...v3.0.0
[v2.1.0]: https://github.com/jakeboone02/numeric-quantity/compare/v2.0.1...v2.1.0
[v2.0.1]: https://github.com/jakeboone02/numeric-quantity/compare/v2.0.0...v2.0.1
[v2.0.0]: https://github.com/jakeboone02/numeric-quantity/compare/v1.0.4...v2.0.0
[v1.0.4]: https://github.com/jakeboone02/numeric-quantity/compare/v1.0.3...v1.0.4
[v1.0.3]: https://github.com/jakeboone02/numeric-quantity/compare/v1.0.2...v1.0.3
[v1.0.2]: https://github.com/jakeboone02/numeric-quantity/compare/v1.0.1...v1.0.2
[v1.0.1]: https://github.com/jakeboone02/numeric-quantity/compare/v1.0.0...v1.0.1
[v1.0.0]: https://github.com/jakeboone02/numeric-quantity/compare/v0.5.2...v1.0.0
[v0.5.2]: https://github.com/jakeboone02/numeric-quantity/compare/v0.5.1...v0.5.2
[v0.5.1]: https://github.com/jakeboone02/numeric-quantity/compare/v0.5.0...v0.5.1
[v0.5.0]: https://github.com/jakeboone02/numeric-quantity/compare/v0.4.2...v0.5.0
[v0.4.2]: https://github.com/jakeboone02/numeric-quantity/compare/v0.4.1...v0.4.2
[v0.4.1]: https://github.com/jakeboone02/numeric-quantity/compare/v0.4.0...v0.4.1
[v0.4.0]: https://github.com/jakeboone02/numeric-quantity/compare/v0.3.3...v0.4.0
[v0.3.3]: https://github.com/jakeboone02/numeric-quantity/compare/v0.3.2...v0.3.3
[v0.3.2]: https://github.com/jakeboone02/numeric-quantity/compare/v0.3.1...v0.3.2
[v0.3.1]: https://github.com/jakeboone02/numeric-quantity/compare/v0.3.0...v0.3.1
[v0.3.0]: https://github.com/jakeboone02/numeric-quantity/compare/v0.2.0...v0.3.0
[v0.2.0]: https://github.com/jakeboone02/numeric-quantity/compare/v0.1.2...v0.2.0
[v0.1.2]: https://github.com/jakeboone02/numeric-quantity/compare/v0.1.1...v0.1.2
[v0.1.1]: https://github.com/jakeboone02/numeric-quantity/compare/v0.1.0...v0.1.1
[v0.1.0]: https://github.com/jakeboone02/numeric-quantity/tree/v0.1.0

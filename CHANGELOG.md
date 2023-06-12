# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- `numericQuantity` is now a named export; there is no default export.
- Parsing logic now accepts/ignores any trailing non-numeric characters, more closely resembling the behavior of `parseFloat`.
- UMD build assigns all exports, including `numericQuantity`, to the global object `NumericQuantity`. Previously, it assigned the main function to the global namespace as `numericQuantity`.

### Added

- Support for comma (`','`) and underscore (`'_'`) separators within Arabic numeral sequences. If a numeric sequence has a leading or trailing separator, that sequence and everything after it will be ignored.
- Support for Roman numerals with modern, strict rules, including the Unicode code points `U+2160` through `U+217F`.
- Support for Unicode "Fraction Numerator One" code point (`'⅟'`, `U+215F`), which must be followed by a valid numeric sequence (the denominator) to be included in the conversion.
- Named exports of regular expressions, character maps, types, and other internal tools.
- Build with ([tsup](https://tsup.egoist.dev/)).

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

- [#12] New build system ([tsdx](https://tsdx.io/)).

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

<!-- Release comparison links -->

[unreleased]: https://github.com/jakeboone02/numeric-quantity/compare/v1.0.4...HEAD
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

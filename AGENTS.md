# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Project Overview

numeric-quantity is a TypeScript library that converts human-readable numeric strings to numbers — an enhanced `parseFloat`. It handles plain numbers, fractions, mixed numbers, vulgar fraction characters, Roman numerals, and non-ASCII decimal digits from 70+ Unicode scripts.

## Commands

- **Build:** `bun run build` (tsdown → ESM, CJS, UMD)
- **Test:** `bun test` (Bun test runner; 100% coverage threshold)
- **Test single file:** `bun test src/index.test.ts`
- **Test watch:** `bun test --watch`
- **Lint:** `bun run lint` (oxlint)
- **Format:** `bun run fmt` (Prettier)
- **Type-check:** `tsc`
- **Docs:** `bun run docs` (TypeDoc)

## Architecture

All source lives in `src/`. The library exports three public APIs from `src/index.ts`:

- `numericQuantity()` — core parser (`src/numericQuantity.ts`). Normalizes Unicode digits, strips formatting, then matches against regex patterns for integers, decimals, fractions, mixed numbers, and scientific notation. Returns `NaN` on invalid input. Accepts an options object for Roman numeral parsing and verbose output.
- `isNumericQuantity()` — boolean wrapper (`src/isNumericQuantity.ts`)
- `parseRomanNumerals()` — standalone Roman numeral parser (`src/parseRomanNumerals.ts`)

Supporting files:

- `src/constants.ts` — regex patterns, Unicode digit range table, default options
- `src/types.ts` — TypeScript types and interfaces

## Testing

Tests use `bun:test` (import from `'bun:test'`). Test data fixtures are in `src/numericQuantityTests.ts` — add new test cases there rather than inline in the test file. Coverage must stay at 100%.

## Code Style

- 2-space indentation, single quotes, semicolons, ES5 trailing commas
- Arrow parens: avoid when possible
- Prettier handles formatting; oxlint handles linting
- Strict TypeScript (`isolatedModules`, `isolatedDeclarations` enabled)

## Build Output

Dual-package ESM + CJS with a UMD bundle. Targets ES2021 (standard) and ES2017 (legacy ESM for Webpack 4). Only `dist/` is published.

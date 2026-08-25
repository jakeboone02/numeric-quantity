// Compile-time type assertions. Not a runtime test file; enforced by `tsc`.
// Nothing here is emitted or imported anywhere — `tsc` failing is the assertion.

import type { isNumericQuantity } from './isNumericQuantity';
import type { numericQuantity } from './numericQuantity';
import type {
  NumericQuantityOptions,
  NumericQuantityReturnType,
  NumericQuantityVerboseResult,
} from './types';

type Expect<T extends true> = T;
type Equal<X, Y> =
  (<A>() => A extends X ? 1 : 2) extends <A>() => A extends Y ? 1 : 2 ? true : false;

declare const nq: typeof numericQuantity;
declare const inq: typeof isNumericQuantity;

// #region numericQuantity call-site inference (mirrors the 2.1 table)

type _noOptions = Expect<Equal<ReturnType<typeof nq<undefined>>, number>>;
type _verboseTrue = Expect<
  Equal<ReturnType<typeof nq<{ verbose: true }>>, NumericQuantityVerboseResult>
>;
type _verboseFalse = Expect<Equal<ReturnType<typeof nq<{ verbose: false }>>, number>>;
type _bigIntTrue = Expect<
  Equal<ReturnType<typeof nq<{ bigIntOnOverflow: true }>>, number | bigint>
>;
type _bigIntFalse = Expect<Equal<ReturnType<typeof nq<{ bigIntOnOverflow: false }>>, number>>;
type _round = Expect<Equal<ReturnType<typeof nq<{ round: 5 }>>, number>>;
type _undefinedOpts = Expect<Equal<ReturnType<typeof nq<undefined>>, number>>;
type _nullOpts = Expect<Equal<ReturnType<typeof nq<null>>, number>>;
type _dynamicVerbose = Expect<
  Equal<ReturnType<typeof nq<{ verbose: boolean }>>, number | bigint | NumericQuantityVerboseResult>
>;
type _widenedOptions = Expect<
  Equal<
    ReturnType<typeof nq<NumericQuantityOptions>>,
    number | bigint | NumericQuantityVerboseResult
  >
>;

// Note: the single-argument overload (`numericQuantity(quantity): number`) is not
// assertable here — `ReturnType<typeof numericQuantity>` resolves against the *last*
// overload, not the first. `_noOptions` above covers the equivalent inference.

// #endregion

// #region NumericQuantityReturnType applied directly

type _rtDefault = Expect<Equal<NumericQuantityReturnType, number>>;
type _rtUndefined = Expect<Equal<NumericQuantityReturnType<undefined>, number>>;
type _rtNull = Expect<Equal<NumericQuantityReturnType<null>, number>>;
type _rtVerbose = Expect<
  Equal<NumericQuantityReturnType<{ verbose: true }>, NumericQuantityVerboseResult>
>;
type _rtVerboseFalse = Expect<Equal<NumericQuantityReturnType<{ verbose: false }>, number>>;
type _rtBigInt = Expect<
  Equal<NumericQuantityReturnType<{ bigIntOnOverflow: true }>, number | bigint>
>;
type _rtBigIntFalse = Expect<Equal<NumericQuantityReturnType<{ bigIntOnOverflow: false }>, number>>;
// `verbose` wins over `bigIntOnOverflow`.
type _rtBoth = Expect<
  Equal<
    NumericQuantityReturnType<{ verbose: true; bigIntOnOverflow: true }>,
    NumericQuantityVerboseResult
  >
>;
type _rtWidened = Expect<
  Equal<
    NumericQuantityReturnType<NumericQuantityOptions>,
    number | bigint | NumericQuantityVerboseResult
  >
>;

// #endregion

// #region isNumericQuantity

type _inqReturn = Expect<Equal<ReturnType<typeof inq>, boolean>>;
type _inqParam0 = Expect<Equal<Parameters<typeof inq>[0], unknown>>;
type _inqParam1 = Expect<Equal<Parameters<typeof inq>[1], NumericQuantityOptions | undefined>>;
// Verbose is force-overridden internally, so it never affects the return type.
declare const inqVerbose: ReturnType<typeof isNumericQuantity>;
type _inqVerbose = Expect<Equal<typeof inqVerbose, boolean>>;

// #endregion

// #region option literal unions are enforced

// @ts-expect-error -- `decimalSeparator` only accepts ',' or '.'
type _badSeparator = ReturnType<typeof nq<{ decimalSeparator: ';' }>>;

// @ts-expect-error -- `percentage` only accepts 'decimal', 'number', or a boolean
type _badPercentage = ReturnType<typeof nq<{ percentage: 'fraction' }>>;

// @ts-expect-error -- unknown options are rejected
type _unknownOption = ReturnType<typeof nq<{ nope: true }>>;

// #endregion

import { numericQuantity } from './numericQuantity';
import type { NumericQuantityOptions } from './types';

/**
 * Checks if a value represents a valid numeric quantity.
 *
 * Returns `true` if the value can be parsed as a number, `false` otherwise.
 * Accepts the same options as `numericQuantity`.
 */
export const isNumericQuantity = (quantity: unknown, options?: NumericQuantityOptions): boolean => {
  const result = numericQuantity(quantity, { ...options, verbose: false });
  return typeof result === 'bigint' || !isNaN(result);
};

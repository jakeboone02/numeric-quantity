import { numericQuantity } from './numericQuantity';
import type { NumericQuantityOptions } from './types';

/**
 * Checks if a string represents a valid numeric quantity.
 *
 * Returns `true` if the string can be parsed as a number, `false` otherwise.
 * Accepts the same options as `numericQuantity`.
 */
export const isNumericQuantity = (
  quantity: string | number,
  options?: NumericQuantityOptions
): boolean => {
  const result = numericQuantity(quantity, options);
  return typeof result === 'bigint' || !isNaN(result);
};

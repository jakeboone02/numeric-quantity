import { numericQuantity } from './numericQuantity';
import { numericQuantityTests } from './numericQuantityTests';

for (const [title, tests] of Object.entries(numericQuantityTests)) {
  it(title, () => {
    for (const [arg, expected, options] of tests) {
      const expectation = expect(numericQuantity(arg, options));
      if (isNaN(expected)) {
        expectation.toBeNaN();
      } else {
        expectation.toBe(expected);
      }
    }
  });
}

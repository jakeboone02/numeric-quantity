import { numericQuantity } from './numericQuantity';
import { numericQuantityTests } from './numericQuantityTests';

for (const [title, tests] of Object.entries(numericQuantityTests)) {
  it(title, () => {
    for (const [arg, expected] of tests) {
      const expectation = expect(numericQuantity(arg));
      if (isNaN(expected)) {
        expectation.toBeNaN();
      } else {
        expectation.toBe(expected);
      }
    }
  });
}

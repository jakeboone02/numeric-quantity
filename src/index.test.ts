import { numericQuantity } from './numericQuantity';
import { numericQuantityTests } from './numericQuantityTests';

for (const { title, tests } of numericQuantityTests) {
  it(title, () => {
    for (const [arg, expected] of tests) {
      if (isNaN(expected)) {
        expect(numericQuantity(arg)).toBeNaN();
      } else {
        expect(numericQuantity(arg)).toBe(expected);
      }
    }
  });
}

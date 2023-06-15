import { numericQuantity } from './numericQuantity';
import { numericQuantityTests } from './numericQuantityTests';

for (const [title, tests] of Object.entries(numericQuantityTests)) {
  describe(title, () => {
    for (const [arg, expected, options] of tests) {
      it(`${
        ['string', 'object'].includes(typeof arg) ? JSON.stringify(arg) : arg
      }${
        typeof options !== 'undefined'
          ? ` with option ${JSON.stringify(options)}`
          : ''
      } should evaluate to ${expected}`, () => {
        const expectation = expect(numericQuantity(arg, options));
        if (isNaN(expected)) {
          expectation.toBeNaN();
        } else {
          expectation.toBe(expected);
        }
      });
    }
  });
}

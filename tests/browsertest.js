/**
 * Crude test suite
 */

const nq = this.numericQuantity || require('..');

let testCount = 0;
let passCount = 0;

class Tester {
  constructor(attempt) {
    this.attempt = attempt;
  }

  is(test) {
    const passes = this.attempt === test;
    if (passes) {
      passCount++;
    }
    console.log(
      passes
        ? `pass - ${this.attempt}`
        : `FAIL: '${this.attempt}' is not '${test}'`
    );
  }

  isNaN() {
    const passes = isNaN(this.attempt);
    if (passes) {
      passCount++;
    }
    console.log(
      passes ? `pass - ${this.attempt}` : `FAIL: '${this.attempt}' is not NaN`
    );
  }
}

function assert(attempt) {
  testCount++;
  return new Tester(attempt);
}

// Text
assert(nq('NaN')).isNaN();
assert(nq('NaN.25')).isNaN();
assert(nq('NaN 1/4')).isNaN();
assert(nq('')).isNaN();
// Invalid numbers
assert(nq('/1')).isNaN();
assert(nq('/0')).isNaN();
assert(nq('/0.5')).isNaN();
assert(nq('0.0.0')).isNaN();
// Whole numbers
assert(nq('1')).is(1);
assert(nq('-1')).is(-1);
// TODO?: don't allow leading zeroes on whole numbers
// assert(nq("010")).isNaN();
assert(nq('100')).is(100);
// Decimals
assert(nq('.9')).is(0.9);
assert(nq('1.1')).is(1.1);
assert(nq('-1.1')).is(-1.1);
// Halves
assert(nq('1.51')).is(1.51);
assert(nq('1 1/2')).is(1.5);
assert(nq('-1 1/2')).is(-1.5);
assert(nq('1.52')).is(1.52);
// Thirds
assert(nq('1.32')).is(1.32);
assert(nq('1 1/3')).is(1.333);
assert(nq('1.34')).is(1.34);
assert(nq('1 2/3')).is(1.667);
assert(nq('1.67')).is(1.67);
// Quarters
assert(nq('1 1/4')).is(1.25);
assert(nq('1 3/4')).is(1.75);
// Fifths
assert(nq('1/5')).is(0.2);
assert(nq('1 1/5')).is(1.2);
assert(nq('2/5')).is(0.4);
assert(nq('1 2/5')).is(1.4);
assert(nq('3/5')).is(0.6);
assert(nq('1 3/5')).is(1.6);
assert(nq('4/5')).is(0.8);
assert(nq('1 4/5')).is(1.8);
// Unicode vulgar fractions
assert(nq('\u00BC')).is(0.25); // 1/4
assert(nq('-\u00BC')).is(-0.25); // -1/4
assert(nq('\u00BD')).is(0.5); // 1/2
assert(nq('\u00BE')).is(0.75); // 3/4
assert(nq('\u2150')).is(0.143); // 1/7
assert(nq('\u2151')).is(0.111); // 1/9
assert(nq('\u2152')).is(0.1); // 1/10
assert(nq('\u2153')).is(0.333); // 1/3
assert(nq('\u2154')).is(0.667); // 2/3
assert(nq('\u2155')).is(0.2); // 1/5
assert(nq('\u2156')).is(0.4); // 2/5
assert(nq('\u2157')).is(0.6); // 3/5
assert(nq('\u2158')).is(0.8); // 4/5
assert(nq('\u2159')).is(0.167); // 1/6
assert(nq('\u215A')).is(0.833); // 5/6
assert(nq('\u215B')).is(0.125); // 1/8
assert(nq('\u215C')).is(0.375); // 3/8
assert(nq('\u215D')).is(0.625); // 5/8
assert(nq('\u215E')).is(0.875); // 7/8
// Mixed unicode vulgar fraction
assert(nq('2 \u2155')).is(2.2); // 2 1/5
// Mixed unicode vulgar fraction - no space
assert(nq('2\u2155')).is(2.2); // 2 1/5

// Report results
console.log(`${passCount} of ${testCount} tests passed.`);

if (typeof process !== 'undefined') {
  process.exit(testCount - passCount ? 1 : 0);
}

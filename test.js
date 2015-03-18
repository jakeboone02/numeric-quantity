/**
 * Crude test suite
 */

var nq = require("./");
var testCount = 0;
var passCount = 0;

function Tester(attempt) {
  this.attempt = attempt;
};

Tester.prototype.is = function(test) {
  var passes = this.attempt === test;

  if (!!passes) {
    passCount++;
  }

  console.log(!!passes ? "pass" : "FAIL: '" + this.attempt + "' is not '" + test + "'");
}

function assert(attempt) {
  testCount++;
  return new Tester(attempt);
}

// Text
assert(nq("NaN")).is(-1);
assert(nq("")).is(-1);
// Invalid numbers
assert(nq("/1")).is(-1);
assert(nq("/0")).is(-1);
assert(nq("/0.5")).is(-1);
assert(nq(".9")).is(-1);
assert(nq("0.0.0")).is(-1);
// Whole numbers
assert(nq("1")).is(1);
// TODO: don't allow leading zeroes on whole numbers
// assert(nq("010")).is(-1);
assert(nq("100")).is(100);
// Decimals
assert(nq("1.1")).is(1.1);
// Halves
assert(nq("1.51")).is(1.51);
assert(nq("1 1/2")).is(1.5);
assert(nq("1.52")).is(1.52);
// Thirds
assert(nq("1.32")).is(1.32);
assert(nq("1 1/3")).is(1.333);
assert(nq("1.34")).is(1.34);
assert(nq("1 2/3")).is(1.667);
assert(nq("1.67")).is(1.67);
// Quarters
assert(nq("1 1/4")).is(1.25);
assert(nq("1 3/4")).is(1.75);
// Fifths
assert(nq("1/5")).is(0.2);
assert(nq("1 1/5")).is(1.2);
assert(nq("2/5")).is(0.4);
assert(nq("1 2/5")).is(1.4);
assert(nq("3/5")).is(0.6);
assert(nq("1 3/5")).is(1.6);
assert(nq("4/5")).is(0.8);
assert(nq("1 4/5")).is(1.8);

// Report results
console.log(passCount + " of " + testCount + " tests passed.");

process.exit(testCount - passCount ? 1 : 0);
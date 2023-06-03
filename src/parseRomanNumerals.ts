import {
  romanNumeralUnicodeRegex,
  romanNumeralUnicodeToAsciiMap,
  romanNumeralRegex,
  romanNumeralValues,
} from './constants';

// Just a shorthand type alias
type RNV = keyof typeof romanNumeralValues;

export const parseRomanNumerals = (romanNumerals: string) => {
  const normalized = `${romanNumerals}`
    .replace(
      romanNumeralUnicodeRegex,
      (_m, rn: keyof typeof romanNumeralUnicodeToAsciiMap) =>
        romanNumeralUnicodeToAsciiMap[rn]
    )
    .toUpperCase();

  const regexResult = romanNumeralRegex.exec(normalized);

  if (!regexResult) {
    return NaN;
  }

  const [, thousands, hundreds, tens, ones] = regexResult;

  return (
    (romanNumeralValues[thousands as RNV] || 0) +
    (romanNumeralValues[hundreds as RNV] || 0) +
    (romanNumeralValues[tens as RNV] || 0) +
    (romanNumeralValues[ones as RNV] || 0)
  );
};

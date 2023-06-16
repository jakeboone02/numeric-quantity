import {
  romanNumeralRegex,
  romanNumeralUnicodeRegex,
  romanNumeralUnicodeToAsciiMap,
  romanNumeralValues,
} from './constants';

// Just a shorthand type alias
type RNV = keyof typeof romanNumeralValues;

/**
 * Converts a string of Roman numerals to a number, like `parseInt`
 * for Roman numerals. Uses modern, strict rules (only 1 to 3999).
 *
 * The string can include ASCII representations of Roman numerals
 * or Unicode Roman numeral code points (`U+2160` through `U+217F`).
 */
export const parseRomanNumerals = (romanNumerals: string) => {
  const normalized = `${romanNumerals}`
    // Convert Unicode Roman numerals to ASCII
    .replace(
      romanNumeralUnicodeRegex,
      (_m, rn: keyof typeof romanNumeralUnicodeToAsciiMap) =>
        romanNumeralUnicodeToAsciiMap[rn]
    )
    // Normalize to uppercase (more common for Roman numerals)
    .toUpperCase();

  const regexResult = romanNumeralRegex.exec(normalized);

  if (!regexResult) {
    return NaN;
  }

  const [, thousands, hundreds, tens, ones] = regexResult;

  return (
    (romanNumeralValues[thousands as RNV] ?? 0) +
    (romanNumeralValues[hundreds as RNV] ?? 0) +
    (romanNumeralValues[tens as RNV] ?? 0) +
    (romanNumeralValues[ones as RNV] ?? 0)
  );
};

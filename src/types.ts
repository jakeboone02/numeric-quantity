export type VulgarFraction =
  | '¼'
  | '½'
  | '¾'
  | '⅐'
  | '⅑'
  | '⅒'
  | '⅓'
  | '⅔'
  | '⅕'
  | '⅖'
  | '⅗'
  | '⅘'
  | '⅙'
  | '⅚'
  | '⅛'
  | '⅜'
  | '⅝'
  | '⅞'
  | '⅟';

export type RomanNumeralAscii = 'I' | 'V' | 'X' | 'L' | 'C' | 'D' | 'M';

export type RomanNumeralUnicode =
  | 'Ⅰ'
  | 'Ⅱ'
  | 'Ⅲ'
  | 'Ⅳ'
  | 'Ⅴ'
  | 'Ⅵ'
  | 'Ⅶ'
  | 'Ⅷ'
  | 'Ⅸ'
  | 'Ⅹ'
  | 'Ⅺ'
  | 'Ⅻ'
  | 'Ⅼ'
  | 'Ⅽ'
  | 'Ⅾ'
  | 'Ⅿ'
  | 'ⅰ'
  | 'ⅱ'
  | 'ⅲ'
  | 'ⅳ'
  | 'ⅴ'
  | 'ⅵ'
  | 'ⅶ'
  | 'ⅷ'
  | 'ⅸ'
  | 'ⅹ'
  | 'ⅺ'
  | 'ⅻ'
  | 'ⅼ'
  | 'ⅽ'
  | 'ⅾ'
  | 'ⅿ';

export type RomanNumeral = RomanNumeralAscii | RomanNumeralUnicode;

import { numericQuantity } from 'numeric-quantity';
import './styles.css';

const strings = [
  'NaN',
  'NaN.25',
  'NaN 1/4',
  '',
  '/1',
  '/0',
  '/0.5',
  '0.0.0',
  '1',
  '-1',
  '100',
  '.9',
  '1.1',
  '-1.1',
  '1.51',
  '1 1/2',
  '-1 1/2',
  '1.52',
  '1.32',
  '1 1/3',
  '1.34',
  '1 2/3',
  '1.67',
  '1 1/4',
  '1 3/4',
  '1/5',
  '1 1/5',
  '2/5',
  '1 2/5',
  '3/5',
  '1 3/5',
  '4/5',
  '1 4/5',
  '\u00BC',
  '-\u00BC',
  '\u00BD',
  '\u00BE',
  '\u2150',
  '\u2151',
  '\u2152',
  '\u2153',
  '\u2154',
  '\u2155',
  '\u2156',
  '\u2157',
  '\u2158',
  '\u2159',
  '\u215A',
  '\u215B',
  '\u215C',
  '\u215D',
  '\u215E',
  '2 \u2155',
  '2\u2155',
  '1⁄2',
  'Ⅰ',
  'Ⅱ',
  'Ⅲ',
  'Ⅳ',
  'Ⅴ',
  'Ⅵ',
  'Ⅶ',
  'Ⅷ',
  'Ⅸ',
  'Ⅹ',
  'Ⅺ',
  'Ⅻ',
  'Ⅼ',
  'Ⅽ',
  'Ⅾ',
  'Ⅿ',
  'ⅰ',
  'ⅱ',
  'ⅲ',
  'ⅳ',
  'ⅴ',
  'ⅵ',
  'ⅶ',
  'ⅷ',
  'ⅸ',
  'ⅹ',
  'ⅺ',
  'ⅻ',
  'ⅼ',
  'ⅽ',
  'ⅾ',
  'ⅿ',
  'MMM',
  'MM',
  'M',
  'CM',
  'DCCC',
  'DCC',
  'DC',
  'D',
  'CD',
  'CCC',
  'CC',
  'C',
  'XC',
  'LXXX',
  'LXX',
  'LX',
  'L',
  'XL',
  'XXX',
  'XX',
  'XII',
  'XI',
  'X',
  'IX',
  'VIII',
  'VII',
  'VI',
  'V',
  'IV',
  'III',
  'II',
  'I',
];

const app = document.getElementById('app')!;

app.innerHTML = `<h1>numeric-quantity CI</h1>
<table>
  <thead><tr><th>Expression</th><th>Result</th></tr></thead>
  <tbody></tbody>
</table>`;

const tbody = document.querySelector('tbody');

for (const s in strings) {
  const tr = document.createElement('tr');
  const result = JSON.stringify(numericQuantity(s));
  tr.innerHTML = `<td>numericQuantity("${s}")</td><td>${result}</td>`;
  tbody?.appendChild(tr);
}

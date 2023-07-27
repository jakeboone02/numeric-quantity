import { numericQuantity } from './index';
import { numericQuantityTests } from './numericQuantityTests';

const app = document.querySelector<HTMLDivElement>('#app')!;

(globalThis as any).numericQuantity = numericQuantity;

const table = document.createElement('table');
table.setAttribute('cellpadding', '7');
table.setAttribute('cellspacing', '0');
const trCaptions = document.createElement('tr');
trCaptions.innerHTML = '<td>Call</td><td>Expected</td><td>Pass</td>';
table.appendChild(trCaptions);

for (const [title, tests] of Object.entries(numericQuantityTests)) {
  const tr = document.createElement('tr');
  const th = document.createElement('th');
  th.setAttribute('colspan', '3');
  th.innerText = title;
  tr.append(th);
  table.appendChild(tr);

  for (const [test, expect, opts] of tests) {
    const result = numericQuantity(test, opts);
    const pass = isNaN(expect) ? isNaN(result) : expect === result;
    const testTR = document.createElement('tr');
    const tdCall = document.createElement('td');
    const tdResult = document.createElement('td');
    const tdPassFail = document.createElement('td');
    tdCall.innerText = `numericQuantity(${JSON.stringify(test)}${
      opts ? `, ${JSON.stringify(opts)}` : ''
    })`;
    tdResult.innerText = `${result}`;
    tdPassFail.innerText = pass ? '✅' : '❌';
    testTR.appendChild(tdCall);
    testTR.appendChild(tdResult);
    testTR.appendChild(tdPassFail);
    table.appendChild(testTR);
  }
}

app.appendChild(table);

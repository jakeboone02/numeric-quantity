import { numericQuantity } from './numericQuantity';
import { numericQuantityTests } from './numericQuantityTests';

const app = document.querySelector<HTMLDivElement>('#app')!;

const table = document.createElement('table');
table.setAttribute('cellpadding', '10');
table.setAttribute('cellspacing', '0');
const trCaptions = document.createElement('tr');
trCaptions.innerHTML = '<td>Call</td><td>Expected</td><td>Pass</td>';
table.appendChild(trCaptions);

for (const testGroup of numericQuantityTests) {
  const tr = document.createElement('tr');
  const th = document.createElement('th');
  th.setAttribute('colspan', '3');
  th.innerText = testGroup.title;
  tr.append(th);
  table.appendChild(tr);

  for (const test of testGroup.tests) {
    const result = numericQuantity(test[0]);
    const pass = isNaN(test[1]) ? isNaN(result) : test[1] === result;
    const testTR = document.createElement('tr');
    const tdCall = document.createElement('td');
    const tdResult = document.createElement('td');
    const tdPassFail = document.createElement('td');
    tdCall.innerText = `numericQuantity(${JSON.stringify(test[0])})`;
    tdResult.innerText = `${numericQuantity(test[0])}`;
    tdPassFail.innerText = pass ? '✅' : '❌';
    testTR.appendChild(tdCall);
    testTR.appendChild(tdResult);
    testTR.appendChild(tdPassFail);
    table.appendChild(testTR);
  }
}

document.body.appendChild(table);

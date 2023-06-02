import { numericQuantity } from '.';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerText = JSON.stringify(numericQuantity('1.5'));

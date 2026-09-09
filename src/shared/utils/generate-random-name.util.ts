const MODELS = ['Audi', 'BMW', 'Chevrolet', 'Chrysler', 'Citroen', 'Dodge', 'Fiat', 'Kia', 'Mersedes', 'Toyota'];
const SUB_MODELS = ['E-tron', 'S7', 'I8', 'X6', 'Bolt', 'Captiva', 'Mustang', 'Prado', 'Camry', 'Porte'];

function getRandomHelper(array: Array<string>) {
  const i: number = Math.floor(Math.random() * array.length);
  return array[i];
}

export function generateRandomName(): string {
  return `${getRandomHelper(MODELS)} ${getRandomHelper(SUB_MODELS)}`;
}

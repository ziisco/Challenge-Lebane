export function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${day}/${month}/${date.getFullYear()}`;
}

export function today() {
  return formatDate(new Date());
}

export function datePlusYears(years = 1) {
  const date = new Date();
  date.setFullYear(date.getFullYear() + years);

  return formatDate(date);
}

export function randomNumericId(maxLength = 7) {
  const min = 10 ** (maxLength - 1);
  const max = 10 ** maxLength - 1;

  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

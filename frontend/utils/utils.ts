export function formatDateFR(iso: string) {
  const date = new Date(iso);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

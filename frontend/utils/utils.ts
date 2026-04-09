import { User } from '@/types/types';

export const getLoggedUser = () => {
  if (typeof window === 'undefined') {
    const user = localStorage.getItem('user');
    return user ? (JSON.parse(user) as User) : null;
  }
};

export function formatDateFR(iso: string) {
  const date = new Date(iso);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

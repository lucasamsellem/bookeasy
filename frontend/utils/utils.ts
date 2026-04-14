import { User } from '@/types/types';

export const getLoggedUser = (): User | null => {
  try {
    const raw = localStorage.getItem('user-storage');
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const user = parsed?.state?.user ?? parsed;

    if (!user || typeof user !== 'object') return null;

    return user as User;
  } catch {
    return null;
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

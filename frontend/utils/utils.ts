import { User } from '@backend/controllers/user.controller';

export const getLoggedUser = () => {
  const user = localStorage.getItem('user');
  return user ? (JSON.parse(user) as User) : null;
};

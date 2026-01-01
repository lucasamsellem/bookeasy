export const isUserLoggedIn = () => {
  try {
    return Boolean(localStorage.getItem('token'));
  } catch {
    return false;
  }
};

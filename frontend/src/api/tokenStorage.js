const ACCESS_TOKEN_KEY = 'accessToken';
const CURRENT_USER_KEY = 'currentUser';

export const getToken = () => sessionStorage.getItem(ACCESS_TOKEN_KEY);

export const setToken = (token) => {
  if (token) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

export const clearToken = () => sessionStorage.removeItem(ACCESS_TOKEN_KEY);

export const getCurrentUser = () => {
  const raw = sessionStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setCurrentUser = (user) => {
  if (user) {
    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    sessionStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const clearCurrentUser = () => sessionStorage.removeItem(CURRENT_USER_KEY);

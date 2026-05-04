import { apiRequest } from './apiClient';

export const login = async ({ username, password }) =>
  apiRequest('/api/auth/login', {
    method: 'POST',
    body: { username, password },
    auth: false,
  });

export const register = async ({ username, email, password }) =>
  apiRequest('/api/auth/register', {
    method: 'POST',
    body: { username, email, password },
    auth: false,
  });

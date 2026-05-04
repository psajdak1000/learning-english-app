import { apiRequest } from './apiClient';

export const login = async ({ username, password }) =>
  apiRequest('/api/auth/login', {
    method: 'POST',
    body: { username, password },
    auth: false,
  });

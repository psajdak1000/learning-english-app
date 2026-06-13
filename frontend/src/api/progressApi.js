import { apiRequest } from './apiClient';

export const getProgress = async (userId) => {
  if (userId) {
    return apiRequest(`/api/progress/${encodeURIComponent(userId)}`, { auth: false });
  }
  return apiRequest('/api/progress', { auth: false });
};

export const updateProgress = async (payload) =>
  apiRequest('/api/progress/update', {
    method: 'POST',
    body: payload,
    auth: false,
  });

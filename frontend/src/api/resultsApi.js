import { apiRequest } from './apiClient';

export const saveResult = async (payload) =>
  apiRequest('/api/results', {
    method: 'POST',
    body: payload,
    auth: false,
  });

export const getResultsHistory = async (userId) =>
  apiRequest(`/api/results/history/${encodeURIComponent(userId)}`, { auth: false });

export const getLatestResult = async (userId) =>
  apiRequest(`/api/results/latest/${encodeURIComponent(userId)}`, { auth: false });

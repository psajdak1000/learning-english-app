import { apiRequest } from './apiClient';

export const askBot = async (question) =>
  apiRequest('/api/bot/ask', {
    method: 'POST',
    body: { question },
    auth: false,
  });

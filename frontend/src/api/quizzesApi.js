import { apiRequest } from './apiClient';

export const startQuiz = async ({ count, direction }) =>
  apiRequest(
    `/api/quizzes/start?count=${encodeURIComponent(count)}&direction=${encodeURIComponent(direction)}`,
    { auth: false },
  );

export const submitQuiz = async (payload) =>
  apiRequest('/api/quizzes/submit', {
    method: 'POST',
    body: payload,
    auth: false,
  });

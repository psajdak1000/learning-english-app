import { apiRequest } from './apiClient';

export const getFlashcards = async ({ category, difficultyLevel } = {}) => {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (difficultyLevel) params.set('difficultyLevel', difficultyLevel);

  const query = params.toString();
  return apiRequest(`/api/flashcards${query ? `?${query}` : ''}`, { auth: false });
};

export const getFlashcardById = async (id) =>
  apiRequest(`/api/flashcards/${id}`, { auth: false });

export const createFlashcard = async (payload) =>
  apiRequest('/api/flashcards', {
    method: 'POST',
    body: payload,
    auth: false,
  });

export const updateFlashcard = async (id, payload) =>
  apiRequest(`/api/flashcards/${id}`, {
    method: 'PUT',
    body: payload,
    auth: false,
  });

export const deleteFlashcard = async (id) =>
  apiRequest(`/api/flashcards/${id}`, {
    method: 'DELETE',
    auth: false,
  });

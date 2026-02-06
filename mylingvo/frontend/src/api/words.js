import api from './axios';
export const getWords = (params) => api.get('/words', { params });
export const getWord = (id) => api.get(`/words/${id}`);

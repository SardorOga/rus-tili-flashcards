import api from './axios';
export const getSentences = (params) => api.get('/sentences', { params });
export const getRandomSentence = (count = 1) => api.get('/sentences/random', { params: { count } });

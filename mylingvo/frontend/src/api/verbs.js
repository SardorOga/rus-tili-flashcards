import api from './axios';
export const getVerbs = (params) => api.get('/verbs', { params });
export const getVerb = (id) => api.get(`/verbs/${id}`);
export const getVerbSentences = (params) => api.get('/verb-sentences', { params });
export const getRandomVerbSentence = (count = 1) => api.get('/verb-sentences/random', { params: { count } });

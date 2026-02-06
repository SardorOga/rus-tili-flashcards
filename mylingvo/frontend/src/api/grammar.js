import api from './axios';
export const getGrammarCases = () => api.get('/grammar');
export const getGrammarCase = (id) => api.get(`/grammar/${id}`);

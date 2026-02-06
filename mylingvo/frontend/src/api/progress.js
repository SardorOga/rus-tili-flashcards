import api from './axios';
export const getDashboard = () => api.get('/progress');
export const getHistory = (days = 30) => api.get('/progress/history', { params: { days } });
export const getWordStats = (params) => api.get('/progress/words', { params });
export const getStreak = () => api.get('/progress/streak');

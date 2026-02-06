import api from './axios';
export const getDeclineExercise = () => api.get('/exercises/decline');
export const getIdentifyExercise = () => api.get('/exercises/identify');
export const getFormExercise = () => api.get('/exercises/form');
export const checkAnswer = (data) => api.post('/exercises/check', data);

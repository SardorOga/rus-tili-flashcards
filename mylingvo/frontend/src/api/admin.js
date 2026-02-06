import api from './axios';

export const getAdminStats = () => api.get('/admin/stats');
export const getAdminUsers = (params) => api.get('/admin/users', { params });
export const getAdminUser = (id) => api.get(`/admin/users/${id}`);
export const updateAdminUser = (id, data) => api.put(`/admin/users/${id}`, data);
export const deleteAdminUser = (id) => api.delete(`/admin/users/${id}`);

export const getAdminWords = (params) => api.get('/admin/words', { params });
export const createAdminWord = (data) => api.post('/admin/words', data);
export const updateAdminWord = (id, data) => api.put(`/admin/words/${id}`, data);
export const deleteAdminWord = (id) => api.delete(`/admin/words/${id}`);

import { create } from 'zustand';
import { login as loginApi, register as registerApi, logout as logoutApi, getMe } from '../api/auth';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: true,

  login: async (credentials) => {
    const { data } = await loginApi(credentials);
    const { user, token } = data.data;
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
    return data;
  },

  register: async (userData) => {
    const { data } = await registerApi(userData);
    const { user, token } = data.data;
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
    return data;
  },

  logout: async () => {
    try { await logoutApi(); } catch {}
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    try {
      const { data } = await getMe();
      set({ user: data.data, isAuthenticated: true, loading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },

  setUser: (user) => set({ user }),
}));

export default useAuthStore;

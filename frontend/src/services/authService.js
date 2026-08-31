// Auth service — login, register, refresh, and logout API calls.
import axiosInstance from '../api/axiosInstance';

const authService = {
  register: async (name, email, password) => {
    const { data } = await axiosInstance.post('/auth/register', { name, email, password });
    return data;
  },

  login: async (email, password) => {
    const { data } = await axiosInstance.post('/auth/login', { email, password });
    return data;
  },

  refresh: async () => {
    const { data } = await axiosInstance.post('/auth/refresh');
    return data;
  },

  logout: async () => {
    const { data } = await axiosInstance.post('/auth/logout');
    return data;
  },
};

export default authService;

// Task service — CRUD API calls for tasks.
import axiosInstance from '../api/axiosInstance';

const taskService = {
  getAll: async () => {
    const { data } = await axiosInstance.get('/tasks');
    return data;
  },

  getById: async (id) => {
    const { data } = await axiosInstance.get(`/tasks/${id}`);
    return data;
  },

  create: async (taskData) => {
    const { data } = await axiosInstance.post('/tasks', taskData);
    return data;
  },

  update: async (id, taskData) => {
    const { data } = await axiosInstance.put(`/tasks/${id}`, taskData);
    return data;
  },

  remove: async (id) => {
    const { data } = await axiosInstance.delete(`/tasks/${id}`);
    return data;
  },
};

export default taskService;

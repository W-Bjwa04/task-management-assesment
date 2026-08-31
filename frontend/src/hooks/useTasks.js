// useTasks hook — encapsulates task CRUD API calls and local state management.
import { useState, useCallback } from 'react';
import taskService from '../services/taskService';

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAll();
      setTasks(data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (taskData) => {
    setError(null);
    try {
      const data = await taskService.create(taskData);
      setTasks((prev) => [data.task, ...prev]);
      return data.task;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create task';
      setError(message);
      throw new Error(message);
    }
  };

  const updateTask = async (id, taskData) => {
    setError(null);
    try {
      const data = await taskService.update(id, taskData);
      setTasks((prev) => prev.map((t) => (t._id === id ? data.task : t)));
      return data.task;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update task';
      setError(message);
      throw new Error(message);
    }
  };

  const deleteTask = async (id) => {
    setError(null);
    try {
      await taskService.remove(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete task';
      setError(message);
      throw new Error(message);
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};

export default useTasks;

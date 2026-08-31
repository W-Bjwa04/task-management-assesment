// Dashboard — main task manager view with create/edit modal and task list.
import { useState, useEffect, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import useTasks from '../hooks/useTasks';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/common/Modal';
import ConfirmModal from '../components/common/ConfirmModal';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask } = useTasks();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const openCreateModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = async (taskData) => {
    setFormLoading(true);
    try {
      if (editingTask) {
        await updateTask(editingTask._id, taskData);
      } else {
        await createTask(taskData);
      }
      closeModal();
    } catch {
      // error is handled in useTasks hook
    } finally {
      setFormLoading(false);
    }
  };

  const openDeleteConfirm = (id) => {
    setTaskToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setTaskToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteTask(taskToDelete);
      closeDeleteConfirm();
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatusChange = useCallback(
    async (id, newStatus) => {
      await updateTask(id, { status: newStatus });
    },
    [updateTask]
  );

  const filteredTasks = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
            {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="dashboard__subtitle">
            You have <strong>{counts.pending}</strong> pending and{' '}
            <strong>{counts['in-progress']}</strong> in-progress tasks
          </p>
        </div>
        <Button onClick={openCreateModal} id="create-task-btn">
          + New Task
        </Button>
      </div>

      <div className="dashboard__filters">
        {['all', 'pending', 'in-progress', 'completed'].map((f) => (
          <button
            key={f}
            className={`dashboard__filter ${filter === f ? 'dashboard__filter--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="dashboard__filter-count">{counts[f]}</span>
          </button>
        ))}
      </div>

      {error && <div className="dashboard__error">{error}</div>}

      {loading ? (
        <Loader size="lg" />
      ) : (
        <TaskList
          tasks={filteredTasks}
          onEdit={openEditModal}
          onDelete={openDeleteConfirm}
          onStatusChange={handleStatusChange}
        />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingTask ? 'Edit Task' : 'Create Task'}
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={formLoading}
        />
      </Modal>

      <ConfirmModal
        isOpen={deleteConfirmOpen}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteConfirm}
        loading={deleteLoading}
        isDangerous={true}
      />
    </div>
  );
};

export default Dashboard;

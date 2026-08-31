// TaskForm — form for creating or editing a task (used inside a Modal).
import { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import {
  validateTaskTitle,
  validateTaskDescription,
  validateTaskStatus,
  validTaskStatuses,
} from '../../utils/validators';
import './TaskForm.css';

const TaskForm = ({ task, onSubmit, onCancel, loading }) => {
  const isEdit = !!task;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'pending');
    } else {
      setTitle('');
      setDescription('');
      setStatus('pending');
    }
  }, [task]);

  const handleTitleChange = (value) => {
    setTitle(value);
    if (value && !validateTaskTitle(value).valid) {
      setTitleError(validateTaskTitle(value).error);
    } else {
      setTitleError('');
    }
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
    if (value && !validateTaskDescription(value).valid) {
      setDescriptionError(validateTaskDescription(value).error);
    } else {
      setDescriptionError('');
    }
  };

  const handleStatusChange = (value) => {
    const statusValidation = validateTaskStatus(value);
    if (statusValidation.valid) {
      setStatus(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Final validation
    const titleValidation = validateTaskTitle(title);
    const descriptionValidation = validateTaskDescription(description);
    const statusValidation = validateTaskStatus(status);

    if (!titleValidation.valid) {
      setTitleError(titleValidation.error);
      return;
    }
    if (!descriptionValidation.valid) {
      setDescriptionError(descriptionValidation.error);
      return;
    }
    if (!statusValidation.valid) {
      setError(statusValidation.error);
      return;
    }

    onSubmit({
      title: titleValidation.value,
      description: descriptionValidation.value,
      status,
    });
  };

  const isTitleValid = title.trim() && !titleError;
  const isDescriptionValid = !descriptionError;
  const isStatusValid = validTaskStatuses.includes(status);
  const isFormValid = isTitleValid && isDescriptionValid && isStatusValid;

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div>
        <Input
          id="task-title"
          label="Title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="What needs to be done?"
          error={titleError && title.trim() ? titleError : ''}
          autoFocus
        />
        <div className="task-form__meta">
          <span className="task-form__char-count">{title.length}/100 characters</span>
          {titleError && <span className="task-form__error-text">{titleError}</span>}
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="task-desc" className="input-group__label">
          Description (optional)
        </label>
        <textarea
          id="task-desc"
          className="input-group__input task-form__textarea"
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder="Add some details..."
          rows={3}
          maxLength={1000}
        />
        <div className="task-form__meta">
          <span className="task-form__char-count">{description.length}/1000 characters</span>
          {descriptionError && (
            <span className="task-form__error-text">{descriptionError}</span>
          )}
        </div>
      </div>

      {isEdit && (
        <div className="input-group">
          <label htmlFor="task-status" className="input-group__label">
            Status
          </label>
          <select
            id="task-status"
            className="input-group__input"
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}

      {error && <p className="task-form__error">{error}</p>}

      <div className="task-form__actions">
        <Button variant="secondary" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading || !isFormValid}>
          {loading ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;

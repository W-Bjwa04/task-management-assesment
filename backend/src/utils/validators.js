// Backend validators — centralized validation rules for all form inputs.
// Rules must match frontend/src/utils/validators.js to ensure consistency.

// Name validation: letters, spaces, hyphens, apostrophes only, 2-50 chars
const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;

const validateName = (name) => {
  if (!name || !name.trim()) {
    return { valid: false, error: 'Name is required' };
  }
  if (!nameRegex.test(name.trim())) {
    return {
      valid: false,
      error: 'Name must contain only letters, spaces, hyphens, and apostrophes (2-50 characters)',
    };
  }
  return { valid: true };
};

// Email validation: basic RFC-5322 lite pattern and format check
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return { valid: false, error: 'Email is required' };
  }
  const trimmedEmail = email.trim().toLowerCase();
  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  return { valid: true, value: trimmedEmail };
};

// Password validation: min 8 chars, at least one uppercase, one lowercase, one digit
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const validatePassword = (password) => {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/\d/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }
  return { valid: true };
};

// Task title validation: required, non-empty after trim, max 100 chars
const validateTaskTitle = (title) => {
  if (!title || !title.trim()) {
    return { valid: false, error: 'Task title is required' };
  }
  if (title.trim().length > 100) {
    return { valid: false, error: 'Task title must not exceed 100 characters' };
  }
  return { valid: true, value: title.trim() };
};

// Task description validation: optional but max 1000 chars
const validateTaskDescription = (description) => {
  if (!description || description === '') {
    return { valid: true, value: '' };
  }
  if (description.length > 1000) {
    return { valid: false, error: 'Task description must not exceed 1000 characters' };
  }
  return { valid: true, value: description.trim() };
};

// Task status validation: must be one of the enum values
const validTaskStatuses = ['pending', 'in-progress', 'completed'];

const validateTaskStatus = (status) => {
  if (!status) {
    return { valid: false, error: 'Task status is required' };
  }
  if (!validTaskStatuses.includes(status)) {
    return {
      valid: false,
      error: `Task status must be one of: ${validTaskStatuses.join(', ')}`,
    };
  }
  return { valid: true };
};

module.exports = {
  validateName,
  validateEmail,
  validatePassword,
  validateTaskTitle,
  validateTaskDescription,
  validateTaskStatus,
  nameRegex,
  emailRegex,
  passwordRegex,
  validTaskStatuses,
};

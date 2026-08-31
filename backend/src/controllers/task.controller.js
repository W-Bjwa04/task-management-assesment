// Task controller — CRUD logic for tasks scoped to the authenticated user.
const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');
const {
  validateTaskTitle,
  validateTaskDescription,
  validateTaskStatus,
} = require('../utils/validators');

// GET /api/tasks — list all tasks for the authenticated user.
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks/:id — get a single task by ID (owner-scoped).
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }
    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// POST /api/tasks — create a new task.
const createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    // Validate title
    const titleValidation = validateTaskTitle(title);
    if (!titleValidation.valid) {
      throw new ApiError(400, titleValidation.error);
    }

    // Validate description
    const descriptionValidation = validateTaskDescription(description);
    if (!descriptionValidation.valid) {
      throw new ApiError(400, descriptionValidation.error);
    }

    // Validate status
    const statusValidation = validateTaskStatus(status);
    if (!statusValidation.valid) {
      throw new ApiError(400, statusValidation.error);
    }

    const task = await Task.create({
      title: titleValidation.value,
      description: descriptionValidation.value,
      status,
      owner: req.user.id,
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// PUT /api/tasks/:id — update an existing task.
const updateTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    // Validate title if provided
    if (title !== undefined) {
      const titleValidation = validateTaskTitle(title);
      if (!titleValidation.valid) {
        throw new ApiError(400, titleValidation.error);
      }
    }

    // Validate description if provided
    if (description !== undefined) {
      const descriptionValidation = validateTaskDescription(description);
      if (!descriptionValidation.valid) {
        throw new ApiError(400, descriptionValidation.error);
      }
    }

    // Validate status if provided
    if (status !== undefined) {
      const statusValidation = validateTaskStatus(status);
      if (!statusValidation.valid) {
        throw new ApiError(400, statusValidation.error);
      }
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (status !== undefined) updateData.status = status;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id — delete a task.
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };

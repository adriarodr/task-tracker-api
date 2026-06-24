const express = require('express');
const router = express.Router();

const Task = require('../models/Task');

const authMiddleware = require('../middleware/authMiddleware');

// GET /tasks - Returns all tasks for the logged-in user
router.get('/tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).exec();

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /tasks/:id - Return one task by ID for the logged-in user
router.get('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).exec();

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/tasks - Creates a new task for the logged-in user
router.post('/tasks', authMiddleware, async (req, res) => {
  const { title, description, isCompleted, dueDate } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      isCompleted,
      dueDate,
      user: req.user.id,
    });
    const savedTask = await newTask.save();

    res.status(201).json({
      message: 'Task created successfully',
      task: savedTask,
    });
  } catch (error) {
    if (!title) {
      return res.status(400).json({
        message: 'Title is required',
      });
    } else if (error.code === 11000) {
      return res.status(400).json({
        message: 'Task with this title is already saved',
      });
    }

    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/tasks/:id - Updates an existing task for the logged-in user
router.put('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const query = { _id: req.params.id, user: req.user.id };

    const updatedTask = await Task.findOneAndUpdate(query, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Unable to update book' });
  }
});

// DELETE /api/tasks/:id - Deletes a task for the logged-in user
router.delete('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({
      message: 'Task deleted successfully',
      deletedTask: deletedTask,
    });
  } catch (error) {
    res.status(400).json({ message: 'Unable to detele task' });
  }
});

module.exports = router;

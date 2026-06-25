const express = require('express');
const router = express.Router();

const Task = require('../models/Task');

// import middleware so all task routes are protected
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/tasks
// @desc    Returns all tasks for the logged-in user
// @access  Private
router.get('/tasks', authMiddleware, async (req, res) => {
  try {
    // Get all the tasks by user id
    const tasks = await Task.find({ user: req.user.id }).exec();

    // Return all the tasks by the user
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   GET /api/tasks/:id
// @desc    Return one task by Id for the logged-in user
// @access  Private
router.get('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    // Get a task by its id created by the user
    const tasks = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).exec();

    // If the task does not exist, return an error
    if (!tasks) {
      return res.status(400).json({
        message: 'Task not found',
      });
    }

    // Return the task
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   POST /api/tasks
// @desc    Creates a new task for the logged-in user
// @access  Private
router.post('/tasks', authMiddleware, async (req, res) => {
  try {
    const { title, description, isCompleted, dueDate } = req.body;

    // Check if all required fields are included
    if (!title) {
      return res.status(400).json({
        message: 'Please provide a title',
      });
    }

    // Create a new user user the Task Schema
    const newTask = new Task({
      title,
      description,
      isCompleted,
      dueDate,
      user: req.user.id,
    });

    // Save the task to the database
    const savedTask = await newTask.save();

    // Return success message and saved task
    res.status(201).json({
      message: 'Task created successfully',
      task: savedTask,
    });
  } catch (error) {
    // Return error message if task with this title already exists
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'A task with this title is already exists',
      });
    }

    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Updates an existing task for the logged-in user
// @access   Private
router.put('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    // Updates the task
    const query = { _id: req.params.id, user: req.user.id };

    const updatedTask = await Task.findOneAndUpdate(query, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });

    // If the task does not exist, return an error
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Return success message and update task
    res.status(200).json({
      message: 'Task successfully updated',
      updatedTask: updatedTask,
    });
  } catch (error) {
    // Return error message if task with this title already exists
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'A task with this title is already exists',
      });
    }

    res.status(500).json({
      message: 'Unable to update book',
      error: error.message,
    });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Deletes a task for the logged-in user
// @access   Private
router.delete('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    // Deletes the task
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    // If the task does not exist, return an error
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Return success message and deleted task
    res.status(200).json({
      message: 'Task successfully deleted',
      deletedTask: deletedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Unable to delete task',
      error: error.message,
    });
  }
});

module.exports = router;

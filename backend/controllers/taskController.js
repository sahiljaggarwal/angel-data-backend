const User = require("../models/user");

// Create a new task for a user
const createTask = async (req, res) => {
  try {
    const { userId, id, email, image, status, action } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newTask = {
      id,
      email,
      image,
      status,
      action,
    };

    user.tasks.push(newTask);
    await user.save();

    res.status(201).json(user.tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tasks for a user
const getTasks = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a task for a user
const updateTask = async (req, res) => {
  try {
    const { userId, taskId } = req.params;
    const { id, email, image, status, action } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const task = user.tasks.id(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.id = id;
    task.email = email;
    task.image = image;
    task.status = status;
    task.action = action;

    await user.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a task for a user
const deleteTask = async (req, res) => {
  try {
    const { userId, taskId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const task = user.tasks.id(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.remove();
    await user.save();

    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};

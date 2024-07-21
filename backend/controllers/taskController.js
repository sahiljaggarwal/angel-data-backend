const User = require("../models/user");

// Create a new task for a user
const createTask = async (req, res) => {
  try {
    console.log("running");
    const { id, email, image, status, action } = req.body;
    const { userId } = req.params;
    console.log(userId, email);
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

    user.task.push(newTask);
    await user.save();

    res.status(201).json(user.tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tasks for a user
// const getTasks = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json(user.tasks);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getTasks = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { page = 1, limit = 10 } = req.query;
//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Pagination logic
//     const tasks = user.tasks.slice((page - 1) * limit, page * limit);
//     const totalTasks = user.tasks.length;
//     const totalPages = Math.ceil(totalTasks / limit);

//     res.status(200).json({
//       tasks,
//       page: parseInt(page, 10),
//       totalPages,
//       totalTasks,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const getTasks = async (req, res) => {
  try {
    console.log("runnong");
    const { userId } = req.params;
    console.log("userId ", userId);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return all tasks
    const tasks = user.task;

    res.status(200).json({
      tasks,
      totalTasks: tasks.length,
    });
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

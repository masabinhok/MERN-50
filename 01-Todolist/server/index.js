const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const todoModel = require("./models/todo");
const taskModel = require("./models/task");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mtodo")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

// Create a new todo
app.post("/todo", async (req, res) => {
  try {
    const { todo } = req.body;
    if (!todo) {
      return res.status(400).json({ message: "Todo content is required" });
    }

    const newTodo = await todoModel.create({ todo });
    res.status(201).json(newTodo);
  } catch (err) {
    console.error("Error creating todo:", err);
    res.status(500).json({ message: "Error creating todo" });
  }
});

// Get all todos and tasks
app.get("/", async (req, res) => {
  try {
    const todos = await todoModel.find();
    const tasks = await taskModel.find();
    res.status(200).json({ todos, tasks });
  } catch (err) {
    console.error("Error fetching todos and tasks:", err);
    res.status(500).json({ message: "Error fetching data" });
  }
});

// Delete a todo by ID
app.delete("/todo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await todoModel.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const todos = await todoModel.find();
    res.status(200).json(todos);
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).json({ message: "Error deleting todo" });
  }
});

// Toggle todo completion by ID
app.put("/todo/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await todoModel.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // Toggle completed field
    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      { completed: !todo.completed },
      { new: true }
    );

    const todos = await todoModel.find();
    res.status(200).json(todos);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ message: "Error updating todo" });
  }
});

// Save tasks with todos for a specific date
app.post("/save", async (req, res) => {
  try {
    const { date, todos } = req.body;
    if (!date || !todos || !Array.isArray(todos)) {
      return res
        .status(400)
        .json({ message: "Date and valid todos array are required" });
    }

    const task = await taskModel.findOne({ date });

    if (task) {
      const updatedTask = await taskModel.findOneAndUpdate(
        { date },
        { $push: { todos } },
        { new: true }
      );
      res.status(200).json(updatedTask);
    } else {
      const newTask = await taskModel.create({ date, todos });
      res.status(201).json(newTask);
    }
  } catch (err) {
    console.error("Error saving tasks:", err);
    res.status(500).json({ message: "Error saving tasks" });
  }
});

// Delete all tasks
app.delete("/task", async (req, res) => {
  try {
    const tasks = await taskModel.deleteMany();
    res.status(200).json({ message: "All tasks deleted", tasks });
  } catch (err) {
    console.error("Error deleting tasks:", err);
    res.status(500).json({ message: "Error deleting tasks" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

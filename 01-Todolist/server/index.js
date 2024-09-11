const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const todoModel = require("./models/todo");
const taskModel = require("./models/task");

const app = express();
const port = 3001;

mongoose
  .connect("mongodb://localhost:27017/mtodo")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes

app.post("/todo", async (req, res) => {
  try {
    const todo = req.body.todo;
    const newTodo = await todoModel.create({
      todo,
    });
    res.send(newTodo);
  } catch (err) {
    console.log(err);
  }
});

app.get("/", async (req, res) => {
  const todos = await todoModel.find();
  const tasks = await taskModel.find();
  res.send({
    todos,
    tasks,
  });
});

app.delete("/todo/:id", async (req, res) => {
  const id = req.params.id;
  const todo = await todoModel.findOneAndDelete({ _id: id });
  const todos = await todoModel.find();
  res.send(todos);
});

app.put("/todo/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Find the current state of the `completed` field
    const todo = await todoModel.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // Toggle the `completed` field to its opposite value
    const updatedTodo = await todoModel.findOneAndUpdate(
      { _id: id },
      { $set: { completed: !todo.completed } }, // Toggle completed
      { new: true } // Return the updated document
    );

    const todos = await todoModel.find(); // Get all todos to return
    res.send(todos); // Send the updated todos list
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/save", async (req, res) => {
  await todoModel.deleteMany();
  const { date, todos } = req.body;
  const task = await taskModel.find({
    date,
  });

  if (task.length > 0) {
    const updatedTask = await taskModel.findOneAndUpdate(
      {
        date,
      },
      {
        $push: {
          todos: todos,
        },
      }
    );
    const tasks = await taskModel.find();
    res.send(tasks);
  } else {
    const newTask = await taskModel.create({
      date,
      todos,
    });

    const tasks = await taskModel.find();
    res.send(tasks);
  }
});

app.delete("/task", async (req, res) => {
  const tasks = await taskModel.deleteMany();
  res.send(tasks);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

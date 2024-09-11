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
  const todo = await todoModel.findOneAndUpdate({ completed: true });
  const todos = await todoModel.find();
  res.send(todos);
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

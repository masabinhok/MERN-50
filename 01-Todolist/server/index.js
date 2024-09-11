const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const todoModel = require("./models/todo");

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
  res.send(todos);
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

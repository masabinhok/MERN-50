const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    date: {
      type: Date,
    },
    todos: [
      {
        todo: {
          type: String,
        },
        completed: {
          type: Boolean,
        },
      },
    ],
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("task", taskSchema);

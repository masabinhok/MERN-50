import React from "react";
import { MdDelete } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import axios from "axios";
import { useState } from "react";

const Todo = ({ todos, setTodos }) => {
  const [title, setTitle] = useState("Productive Day");
  const [date, setDate] = useState("2024-09-11");
  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/todo/${id}`).then((res) => {
      setTodos(res.data);
    });
  };

  return (
    <div className="container flex flex-col justify-center w-full max-w-[400px] gap-4 ">
      {todos.length === 0 ? (
        <div className="bg-zinc-700 justify-center rounded-xl p-3 w-full flex ">
          You are a free bird ! Enjoyyy 🎉
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          <div className="container flex gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-zinc-700 justify-center rounded-xl p-3 w-full flex "
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-zinc-700 justify-center rounded-xl p-3 w-full flex "
            />
          </div>

          {todos.map((todo) => {
            return (
              <>
                <li
                  className="bg-zinc-700 rounded-xl p-3 w-full flex items-center justify-between"
                  key={todo._id}
                >
                  {todo.todo}
                  <div className="flex gap-2">
                    {" "}
                    <button
                      className=" p-2 rounded-xl bg-red-500 shadow-inner shadow-red-600"
                      onClick={() => handleDelete(todo._id)}
                    >
                      <MdDelete />
                    </button>
                    <button
                      className="shadow-green-500 shadow-inner p-2 rounded-xl bg-green-500 text-sm"
                      onClick={() => handleDone(todo._id)}
                    >
                      <FaCheck />
                    </button>
                  </div>
                </li>
              </>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Todo;

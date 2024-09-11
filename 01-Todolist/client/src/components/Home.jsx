import React from "react";
import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import axios from "axios";

const Home = () => {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [date, setDate] = useState("2024-09-11");

  useEffect(() => {
    axios.get("http://localhost:3001").then((res) => {
      setTodos(res.data.todos);
      setTasks(res.data.tasks);
    });
  }, []);

  const handleAdd = () => {
    axios
      .post("http://localhost:3001/todo", {
        todo: newTodo,
      })
      .then((res) => {
        setTodos([...todos, res.data]);
        setNewTodo("");
      });
  };

  const handleClear = () => {
    axios.delete("http://localhost:3001/task").then((res) => {
      setTasks([]);
    });
  };

  const handleDone = (id) => {
    axios.put(`http://localhost:3001/todo/${id}`).then((res) => {
      setTodos(res.data);
    });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/todo/${id}`).then((res) => {
      setTodos(res.data);
    });
  };

  const handleSave = () => {
    axios
      .post("http://localhost:3001/save", {
        date: date,
        todos: todos,
      })
      .then((res) => {
        setTodos([]);
        setTasks(res.data);
      });
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Create a Date object

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is zero-based
    const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed

    return `${year}-${month}-${day}`; // Format it to YYYY-MM-DD
  };

  return (
    <div className="container bg-zinc-900  text-slate-100 min-h-screen max-w-full flex items-center p-10 flex-col">
      <div className="container flex justify-center w-full max-w-full h-[100px]">
        <h1 className="text-green-400 font-bold font-mono text-2xl">
          MERN-zincslate
        </h1>
      </div>
      <div className="container flex flex-col items-center w-full max-w-[400px]">
        {" "}
        <h1 className="text-5xl font-bold ">Todo List</h1>
        <div className="pt-10 pb-4 flex gap-4 w-full max-w-[400px]">
          <input
            className="p-2 rounded-xl text-black focus:outline-none shadow-zinc-500 shadow-inner w-full flex-1"
            type="text"
            value={newTodo}
            name="todo"
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button
            className="px-5 py-2 bg-green-200 font-bold text-green-700 rounded-xl pointer-cursor "
            onClick={() => handleAdd()}
          >
            Add
          </button>
        </div>
      </div>
      <div className="container flex flex-col justify-center w-full max-w-[400px] gap-4 ">
        {todos.length === 0 ? (
          <div className="bg-zinc-700 justify-center rounded-xl p-3 w-full flex ">
            You are a free bird ! Enjoyyy 🎉
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            <div className="container flex gap-3">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-zinc-600 justify-center rounded-xl p-3 w-full flex "
              />
              <button
                className="px-5 py-2 bg-blue-200 font-bold text-blue-700 rounded-xl pointer-cursor "
                onClick={() => handleSave()}
              >
                Save
              </button>
            </div>

            {todos.map((todo) => {
              return (
                <li
                  className={`font-semibold rounded-xl p-3 w-full flex items-center justify-between
                    ${
                      todo.completed
                        ? "bg-green-200 text-green-700"
                        : "bg-red-200 text-red-700"
                    }
                    `}
                  key={todo._id}
                  id={`todo-${todo._id}`} // Adding a unique id to the li
                >
                  {todo.todo}
                  <div
                    id={`div-${todo._id}`} // Unique id for the div
                    className="flex gap-2"
                  >
                    <button
                      className=" p-2 rounded-xl bg-red-200  text-red-700 shadow-inner shadow-red-600"
                      onClick={() => handleDelete(todo._id)}
                    >
                      <MdDelete />
                    </button>

                    {todo.completed ? (
                      <button
                        className="shadow-red-500 shadow-inner p-2 rounded-xl bg-red-200 text-[12px] text-red-700"
                        onClick={() => handleDone(todo._id)}
                      >
                        <ImCross />
                      </button>
                    ) : (
                      <button
                        className="shadow-green-500 shadow-inner p-2 rounded-xl bg-green-200 text-green-700 text-[12px]"
                        onClick={() => handleDone(todo._id)}
                      >
                        <FaCheck />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="container text-slate-100 min-h-screen  max-w-[400px] w-full flex items-center py-10 flex-col ">
        <div className="flex items-end justify-center gap-4">
          {" "}
          <h1 className="text-5xl font-bold w-full ">Saved Todos</h1>
          <button
            className="px-5  py-2 bg-yellow-200 font-bold text-yellow-700 rounded-xl pointer-cursor "
            onClick={() => handleClear()}
          >
            Clear
          </button>
        </div>
        {tasks.length === 0 ? (
          <div className="bg-zinc-700 justify-center rounded-xl mt-10 p-3 w-full flex ">
            No saved tasks yet !
          </div>
        ) : (
          tasks.map((task) => {
            return (
              <div key={task._id} className="flex flex-col w-full pt-10">
                <div className="flex gap-3 mb-3 ">
                  {" "}
                  <h1 className="bg-zinc-100 text-zinc-800 rounded-xl p-3 w-full flex items-center justify-between">
                    {formatDate(task.date)}
                  </h1>
                </div>

                {task.todos.map((todo) => {
                  return (
                    <div className="mb-3" key={todo._id}>
                      <h1
                        className={` rounded-xl p-3 w-full flex items-center justify-between
                          ${
                            todo.completed
                              ? "bg-green-200 text-green-700"
                              : "bg-red-200 text-red-700"
                          }
                          `}
                      >
                        {todo.todo}
                      </h1>
                    </div>
                  );
                })}
              </div>
            );
          })
        )}{" "}
      </div>
    </div>
  );
};

export default Home;

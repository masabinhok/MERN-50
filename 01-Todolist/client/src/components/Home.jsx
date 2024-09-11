import React from "react";
import { useState, useEffect } from "react";

import axios from "axios";
import Todo from "./Todo";

const Home = () => {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001").then((res) => {
      setTodos(res.data);
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

  const handleDone = (id) => {
    axios.put(`http://localhost:3001/todo/${id}`);
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
        <form className="p-10 flex gap-4 w-full max-w-[400px]">
          <input
            className="p-2 rounded-xl text-black focus:outline-none shadow-zinc-500 shadow-inner w-full flex-1"
            type="text"
            value={newTodo}
            name="todo"
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button
            className="px-5 py-2 bg-green-200 font-bold text-green-700 rounded-xl pointer-cursor "
            onClick={handleAdd}
          >
            Add
          </button>
        </form>
      </div>
      <Todo todos={todos} setTodos={setTodos} />
    </div>
  );
};

export default Home;

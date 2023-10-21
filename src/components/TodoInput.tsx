import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import DoneTodos from "./DoneTodos";

import { Todos } from "./Todos";

export type TodoProps = {
  id: string;
  todo: string;
  timeCreated: string;
  isDone: boolean;
};

function TodoInput() {
  const [text, setText] = useState<string>("");
  const [todos, setTodos] = useState<TodoProps[]>([]);
  const [loading, setloading] = useState<boolean>(false);
  const [doneTodos, setDoneTodos] = useState<TodoProps[]>([]);

  // Load todos from localStorage when the component mounts
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("todos") || "[]");
    const storedDoneTodos = JSON.parse(
      localStorage.getItem("doneTodos") || "[]"
    );
    setTodos(storedTodos);
    setDoneTodos(storedDoneTodos);
  }, []);

  // Save todos to localStorage whenever todos or doneTodos change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("doneTodos", JSON.stringify(doneTodos));
  }, [todos, doneTodos]);

  const onSubmitTodo = (event: React.FormEvent) => {
    event.preventDefault();
    setloading(true);

    setTimeout(() => {
      const uuid = uuidv4();
      const currentTime = new Date().toISOString();
      const newTodo: TodoProps = {
        id: uuid,
        todo: text,
        timeCreated: currentTime,
        isDone: false
      };
      setTodos([...todos, newTodo]);
      setText("");
      setloading(false); // Set loading state to false after the todo is added
    }, 950);
  };

  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const doneTodo = (id: string) => {
    const todoToMarkDone = todos.find((todo) => todo.id === id);
    if (todoToMarkDone) {
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      todoToMarkDone.isDone = true;
      setDoneTodos([...doneTodos, todoToMarkDone]);
      setTodos(updatedTodos);
    }
  };

  return (
    <div className="todos-input">
      <div>
        <form className="form" onSubmit={onSubmitTodo}>
          <input
            className="Input"
            type="text"
            value={text}
            placeholder="What do you want to do?"
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
          <button type="submit" className="button" disabled={loading}>
            {loading ? "Adding..." : "Add todo"}
          </button>
        </form>
      </div>

      {todos.length === 0 ? (
        <p className="notodo">No todos, add a todo</p>
      ) : (
        todos.map((item) => (
          <div>
            <Todos
              key={item.id}
              item={item}
              deleteTodo={deleteTodo}
              doneTodo={doneTodo}
            />
          </div>
        ))
      )}

      <div className="done-section">
        <h2 className="doneTitle">Done Todos</h2>
        {doneTodos.length === 0 ? (
          <p className="notodo">No todos marked as done</p>
        ) : (
          doneTodos.map((item) => <DoneTodos key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}

export default TodoInput;

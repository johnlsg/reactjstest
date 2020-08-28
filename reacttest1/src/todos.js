import React from "react";

const Todos = ({ deleteTodos, todos }) => {
  const todoItems = [];
  todos.forEach((todo) => {
    todoItems.push(
      <div key={todo.id}>
        <li>
          {todo.name}{" "}
          <button
            className="btn btn-delete"
            onClick={() => {
              deleteTodos(todo.id);
            }}
          >
            X
          </button>
        </li>
      </div>
    );
  });

  return (
    <div className="list-container">
      <ul className="list">{todoItems}</ul>
    </div>
  );
};

export default Todos;

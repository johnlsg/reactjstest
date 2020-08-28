import React, { Component } from "react";
import "./App.css";
import Todos from "./todos";
import AddTodos from "./AddTodos";

class App extends Component {
  state = {
    todos: [
      { name: "Walk the dog", id: 0 },
      { name: "Bake a cake", id: 1 },
      { name: "Study for the test", id: 2 },
    ],
  };

  deleteTodos = (id) => {
    let todos = this.state.todos.filter((todo) => {
      return todo.id !== id;
    });

    this.setState({
      todos: todos,
    });
  };
  addTodos = (childState) => {
    let todos = [
      ...this.state.todos,
      {
        name: childState.name,
        id: this.state.todos[this.state.todos.length - 1].id + 1,
      },
    ];

    this.setState({
      todos: todos,
    });
  };

  render() {
    return (
      <div className="App">
        <h1>To-do list app using React</h1>
        <AddTodos addTodos={this.addTodos}></AddTodos>
        <Todos deleteTodos={this.deleteTodos} todos={this.state.todos}></Todos>
      </div>
    );
  }
}

export default App;

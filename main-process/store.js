'use strict';
const Store = require('electron-store');

class DataStore extends Store {
  constructor(settings) {
    super(settings);

    // Initialize with todos or empty array
    this.todos = this.get('todos') || [];
  }

  saveTodos() {
    // Save todos to JSON file
    this.set('todos', this.todos);

    // Returning 'this' allows method chaining
    return this;
  }

  getTodos() {
    // Set object's todos to todos in JSON file
    this.todos = this.get('todos') || [];

    return this;
  }

  addTodo(todo) {
    // Merge the existing todos with the new todo
    this.todos = [...this.todos, todo];

    return this.saveTodos();
  }

  deleteTodo(todo) {
    // Filter out the target todo
    this.todos = this.todos.filter(t => t !== todo);

    return this.saveTodos();
  }
}

module.exports = DataStore;

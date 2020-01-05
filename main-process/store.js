'use strict';
const Store = require('electron-store');

class DataStore extends Store {
  constructor(settings) {
    super(settings);

    // Initialize with todos or empty array
    this.todos = this.get('todos') || [];
    this.accounts = this.get('accounts') || {};
  }

  getAccounts() {
    // Set object's accounts to accounts in JSON file
    this.accounts = this.get('accounts') || {};

    return this;
  }

  saveAccounts() {
    // Save accounts to JSON file
    this.set('accounts', this.accounts);

    // Returning 'this' allows method chaining
    return this;
  }

  addAccount(account) {
    // Merge the existing todos with the new todo
    this.accounts[account.user_id] = account;

    return this.saveAccounts();
  }

  deleteAccount(account) {
    // Filter out the target todo
    delete this.accounts[account.user_id];

    return this.saveAccounts();
  }

  getTodos() {
    // Set object's todos to todos in JSON file
    this.todos = this.get('todos') || [];

    return this;
  }

  saveTodos() {
    // Save todos to JSON file
    this.set('todos', this.todos);

    // Returning 'this' allows method chaining
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

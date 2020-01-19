'use strict';
const Store = require('electron-store');

/* eslint-disable camelcase */
class DataStore extends Store {
  constructor(settings) {
    super(settings);

    // Initialize with objects or empty array / object
    this.todos = this.get('todos') || [];
    this.accounts = this.get('accounts') || {};
    this.preferences = this.get('preferences') || {theme: 'dark'};
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

  deleteAccount(user_id) {
    // Filter out the target todo
    delete this.accounts[user_id];

    return this.saveAccounts();
  }

  getPreferences() {
    // Set object's preferences to preferences in JSON file
    this.preferences = this.get('preferences') || {};

    return this;
  }

  savePreferences() {
    // Save preferences to JSON file
    this.set('preferences', this.preferences);

    // Returning 'this' allows method chaining
    return this;
  }

  addPreferences(preference) {
    // Merge the existing preferences with the new preferences
    this.preferences[preference.title] = preference;

    return this.saveAccounts();
  }

  deletePreferences(title) {
    // Filter out the target preferences
    delete this.preferences[title];

    return this.savePreferences();
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
/* eslint-enable camelcase */

module.exports = DataStore;

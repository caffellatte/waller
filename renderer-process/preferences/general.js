'use strict';
const {ipcRenderer} = require('electron');

// On receive accounts
ipcRenderer.on('show-preferences', (event, preferences) => {
  console.log('ipcRenderer.preferences', preferences);
});

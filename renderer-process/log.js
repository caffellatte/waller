'use strict';
const {ipcRenderer} = require('electron');

const logVkListUl = document.querySelector('#log-vk-list');

ipcRenderer.on('log-stdout-vk', (event, data) => {
  const paragraph = document.createElement('p');
  const row = document.createElement('div');
  row.classList.add('media-body');
  const li = document.createElement('li');
  li.classList.add('list-group-item');
  paragraph.textContent = data;
  row.append(paragraph);
  li.append(row);
  logVkListUl.append(li);
  if (data === 'Success!') {
    console.log('log-stdout-vk:', data);
  }
});

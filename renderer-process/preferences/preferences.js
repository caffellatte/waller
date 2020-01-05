'use strict';
const {ipcRenderer} = require('electron');
const links = document.querySelectorAll('link[rel="import"]');

// Preferences navigation buttons in head of window
const preferencesGeneralButton = document.querySelector('#icon-switch');
const preferencesAccountsListButton = document.querySelector('#icon-users');
const windowContent = document.querySelector('.window-content');
const toolbarActions = document.querySelector('.toolbar-actions');
const container = document.querySelector('.window');

// On receive accounts
ipcRenderer.on('accounts', (event, accounts) => {
  console.log('ipcRenderer.accounts', accounts);
  // Comment: ses.localStorage.get(filter, callback)
  localStorage.setItem('accounts', JSON.stringify(accounts));
  // Comment:  ses.localStorage.remove(url, name, callback)
  // const accountsList = document.querySelector('#accounts-list');

  // // get the todoList ul
  // const accountList = document.getElementById('accounts-list')
  //
  // // create html string
  // const accountItems = accounts.reduce((html, account) => {
  //   html += `<li class="account-item">${account}</li>`
  //
  //   return html
  // }, '')
  //
  // // set list html to the todo items
  // accountList.innerHTML = accountItems
  //
  // // add click handlers to delete the clicked todo
  // accountList.querySelectorAll('.account-item').forEach(item => {
  //   item.addEventListener('click', deleteTodo)
  // })
});

// Comment:  ipcRenderer.on('asynchronous-reply', (event, arg) => {
//   const message = `Asynchronous message reply: ${arg}`;
//   console.log(message);
//   ipcRenderer.send('add-account', message);
//   // Changing view document.getElementById('async-reply').innerHTML = message
// });

// Delete account by its text value (used below in event listener)
// const deleteAccount = e => {
//   ipcRenderer.send('delete-account', e.target.textContent);
// };

const loadSection = (fileName, footer, add) => {
  Array.prototype.forEach.call(links, link => {
    const template = link.import.querySelector('.section');
    const clone = document.importNode(template.content, true);
    if (link.href.match(fileName)) {
      windowContent.append(clone);
      if (footer) {
        addFooter(link);
      }

      if (add) {
        addAddAccountButton(link);
      }
    }
  });
};

const removeFooter = () => {
  const toolbarFooter = document.querySelector('.toolbar-footer');
  if (toolbarFooter) {
    container.removeChild(toolbarFooter);
  }
};

const addFooter = link => {
  const template = link.import.querySelector('.footer');
  const clone = document.importNode(template.content, true);
  container.append(clone);
};

const addAccountButtonHandler = event => {
  event.preventDefault();
  removeFooter();
  removeAddAccountButton();
  windowContent.removeChild(windowContent.lastElementChild);
  loadSection('add.html', false, false);
  const addNewAccountButtonVk = document.querySelector('#add-new-account-button-vk');
  // Create add account window button
  addNewAccountButtonVk.addEventListener('click', () => {
    ipcRenderer.send('create-new-authorize-window', 'vk');
  });
};

const addAddAccountButton = link => {
  const template = link.import.querySelector('.add-account-button-template');
  const clone = document.importNode(template.content, true);
  toolbarActions.append(clone);
  const addAccountButton = document.querySelector('#add-account-button');
  addAccountButton.addEventListener('click', addAccountButtonHandler);
};

const removeAddAccountButton = () => {
  const addAccountButton = document.querySelector('#add-account-button');
  if (addAccountButton) {
    addAccountButton.removeEventListener('click', addAccountButtonHandler, true);
    toolbarActions.removeChild(addAccountButton);
  }
};

const deleteTodo = (event, userId) => {
  event.preventDefault();
  console.log(event);
  console.log(userId);
  ipcRenderer.send('delete-account', userId);
};

// Comment:  loadSection('list.html', false, true);
loadSection('general.html');

// Events
preferencesGeneralButton.addEventListener('click', event => {
  event.preventDefault();
  removeFooter();
  removeAddAccountButton();
  windowContent.removeChild(windowContent.lastElementChild);
  loadSection('general.html');
});

// Accounts List
preferencesAccountsListButton.addEventListener('click', event => {
  event.preventDefault();
  removeFooter();
  removeAddAccountButton();
  windowContent.removeChild(windowContent.lastElementChild);
  loadSection('list.html', false, true);
  const accounts = JSON.parse(localStorage.getItem('accounts'));
  console.log(accounts);
  Array.prototype.forEach.call(links, link => {
    if (link.href.match('list.html')) {
      for (const [key, value] of Object.entries(accounts)) {
        console.log(key, value);
        const template = link.import.querySelector('.list-group-item-template');
        const clone = document.importNode(template.content, true);
        console.log(value);
        clone.querySelector('div.media-body').setAttribute('id', value.user_id);
        clone.querySelector('img.img-circle').setAttribute('src', value.photo_50);
        clone.querySelector('li.list-group-item > div > strong').textContent = `${value.first_name} ${value.last_name}`;
        clone.querySelector('li.list-group-item > div > p').textContent = `${value.screen_name}`;
        console.log(clone);
        // Comment: document
        const accountsList = document.querySelector('#accounts-list');
        if (document.querySelector('#accounts-list')) {
          document.querySelector('#accounts-list').append(clone);
        }

        accountsList.querySelectorAll('.btn btn-default pull-right').forEach(item => {
          item.addEventListener('click', deleteTodo(value.user_id));
        });
      }
    }
  });
});

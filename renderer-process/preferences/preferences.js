'use strict';
const {ipcRenderer, remote} = require('electron');
const {Menu, MenuItem} = remote;
const links = document.querySelectorAll('link[rel="import"]');
const menu = new Menu();

menu.append(new MenuItem({
  label: 'VK',
  type: 'normal',
  click: () => {
    // Trigger an alert when menu item is clicked
    ipcRenderer.send('accounts-auth', 'vk');
  }
}));

// Preferences navigation buttons in head of window
const preferencesGeneralButton = document.querySelector('#icon-switch');
const preferencesAccountsListButton = document.querySelector('#icon-users');
const windowContent = document.querySelector('.window-content');
// Toolbar actions
// const toolbarActions = document.querySelector('.toolbar-actions');
// const container = document.querySelector('.window');

// On receive accounts
ipcRenderer.on('accounts', (event, accounts) => {
  console.log('ipcRenderer.accounts', accounts);
  updateAccountsList(accounts);
});

// On receive accounts
ipcRenderer.on('show-preferences', preferences => {
  console.log('show-preferences', preferences);
  accountsList.classList.remove('is-shown');
  appearanceForm.classList.add('is-shown');
  preferencesGeneral.classList.add('is-shown');
  accountsAddButton.classList.remove('is-shown');
});

// Old with  footer, add buttons
// const importTemplates = (fileName, footer, add) => {
const importTemplates = fileName => {
  Array.prototype.forEach.call(links, link => {
    const template = link.import.querySelector('.section');
    const clone = document.importNode(template.content, true);
    if (link.href.match(fileName)) {
      windowContent.append(clone);
    }
  });
};

const updateAccountsList = accounts => {
  console.log('accounts', Object.entries(accounts).length === 0 && accounts.constructor === Object);
  if (Object.entries(accounts).length === 0 && accounts.constructor === Object) {
    document.querySelector('#accounts-list').textContent = '';
  }

  Array.prototype.forEach.call(links, link => {
    if (link.href.match('account.html') && Object.keys(accounts).length > 0) {
      document.querySelector('#accounts-list').textContent = '';
      for (const [key, value] of Object.entries(accounts)) {
        console.log(key, value);
        const template = link.import.querySelector('.section');
        const clone = document.importNode(template.content, true);
        clone.querySelector('div.media-body').setAttribute('id', value.user_id);
        clone.querySelector('img.img-circle').setAttribute('src', value.photo_50);
        clone.querySelector('li.list-group-item > div > strong').textContent = `${value.first_name} ${value.last_name}`;
        clone.querySelector('li.list-group-item > div > p').textContent = `${value.screen_name}`;
        clone.querySelector('li.list-group-item > div > button').addEventListener('click', event => {
          event.preventDefault();
          deleteAccount(value.user_id);
        });
        if (document.querySelector('#accounts-list')) {
          document.querySelector('#accounts-list').append(clone);
        }
      }
    }
  });
};

// Method: removeFooter
// const removeFooter = () => {
//   if (toolbarFooter) {
//     container.removeChild(toolbarFooter);
//   }
// };

// Method: addFooter
// const addFooter = link => {
//   const template = link.import.querySelector('.footer');
//   const clone = document.importNode(template.content, true);
//   container.append(clone);
// };

const deleteAccount = userId => {
  console.log('deleteAccount:', userId);
  ipcRenderer.send('delete-account', userId);
};

// Import templates
importTemplates('list.html');
importTemplates('general.html');
const accountsList = document.querySelector('#accounts-list');
const appearanceForm = document.querySelector('#appearance-form');
const preferencesGeneral = document.querySelector('#general-preferences');
const accountsAddButton = document.querySelector('#accounts-add');

// Item: toolbarFooter
// const toolbarFooter = document.querySelector('.toolbar-footer');
accountsAddButton.classList.remove('is-shown');
accountsAddButton.addEventListener('click', event => {
  event.preventDefault();
  menu.popup(remote.getCurrentWindow());
});
preferencesGeneral.classList.add('is-shown');
appearanceForm.classList.add('is-shown');

// Events
preferencesGeneralButton.addEventListener('click', event => {
  event.preventDefault();
  accountsList.classList.remove('is-shown');
  appearanceForm.classList.add('is-shown');
  preferencesGeneral.classList.add('is-shown');
  accountsAddButton.classList.remove('is-shown');
});

// Accounts List
preferencesAccountsListButton.addEventListener('click', event => {
  event.preventDefault();
  preferencesGeneral.classList.remove('is-shown');
  appearanceForm.classList.remove('is-shown');
  accountsList.classList.add('is-shown');
  accountsAddButton.classList.add('is-shown');
  // Run
  // createAccountsList();
});

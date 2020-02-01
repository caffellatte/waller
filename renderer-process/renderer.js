'use strict';
const {ipcRenderer, remote} = require('electron');
const {Menu, MenuItem} = remote;
const _lodash = require('lodash');
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
const vkUserLikesButton = document.querySelector('#icon-heart-empty');
const windowContent = document.querySelector('.window-content');
const vkAccountOption = document.querySelector('#account-option');

// On receive accounts
ipcRenderer.on('vk-selected', (event, _account) => {
  if (_account) {
    console.log('ipcRenderer.vk-selected', _account);
    document.querySelector(`#id${_account.user_id}`).setAttribute('selected', 'selected');
    updateGroupList(_account);
  }
});
// On receive accounts
ipcRenderer.on('accounts', (event, accounts) => {
  console.log('ipcRenderer.accounts', accounts);
  updateAccountsList(accounts);
});

ipcRenderer.on('groups', (event, _account) => {
  console.log('ipcRenderer.groups', _account);
  updateGroupList(_account);
});

ipcRenderer.on('subscriptions', (event, _account) => {
  console.log('ipcRenderer.subscriptions', _account);
  updateGroupList(_account);
});

// On receive accounts
ipcRenderer.on('show-communities', preferences => {
  console.log('show-communities', preferences);
  accountsList.classList.remove('is-shown');
  appearanceForm.classList.remove('is-shown');
  preferencesGeneral.classList.remove('is-shown');
  accountsAddButton.classList.remove('is-shown');
  vkUserLikesForm.classList.add('is-shown');
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
    document.querySelector('#account-option').textContent = '';
  }

  const searchVkUserButton = document.querySelector('#search-vk-user');

  searchVkUserButton.addEventListener('click', event => {
    event.preventDefault();
    console.log('searchVkUserButton');
  });

  Array.prototype.forEach.call(links, link => {
    if (link.href.match('account.html') && Object.keys(accounts).length > 0) {
      document.querySelector('#accounts-list').textContent = '';
      document.querySelector('#account-option').textContent = '';
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
        const option = document.createElement('option');
        option.textContent = `${value.first_name} ${value.last_name}`;
        option.setAttribute('id', `id${value.user_id}`);

        if (document.querySelector('#account-option')) {
          document.querySelector('#account-option').append(option);
        }

        if (document.querySelector('#accounts-list')) {
          document.querySelector('#accounts-list').append(clone);
        }
      }
    }
  });
};

const updateGroupList = _account => {
  console.log('updateGroupList:', _account);
  if (_account !== null) {
    console.log('updateGroupList', _account);
    _account.groups = _account.groups ? _account.groups : [];
    _account.subscriptions = _account.subscriptions ? _account.subscriptions : [];
    const groups = _lodash.uniqBy(_account.groups.concat(_account.subscriptions), 'id');
    console.log(groups);
    console.log('groups', Object.entries(groups).length === 0 && groups.constructor === Object);
    if (Object.entries(groups).length === 0 && groups.constructor === Object) {
      document.querySelectorAll('.list-group-item-communities').forEach(node => {
        node.remove();
      });
    }

    Array.prototype.forEach.call(links, link => {
      if (link.href.match('public.html') && Object.keys(groups).length > 0) {
        document.querySelectorAll('.list-group-item-communities').forEach(node => {
          node.remove();
        });
        for (const [key, value] of Object.entries(groups)) {
          console.log(key, value);
          const template = link.import.querySelector('.section');
          const clone = document.importNode(template.content, true);
          clone.querySelector('div.media-body').setAttribute('id', value.screen_name);
          clone.querySelector('img.img-circle').setAttribute('src', value.photo_50);
          clone.querySelector('li.list-group-item-communities > div > strong').textContent = `${value.name}`;
          clone.querySelector('li.list-group-item-communities > div > p').textContent = `vk.com/${value.screen_name} (${value.members_count})`;
          clone.querySelector('li.list-group-item-communities > div > button').addEventListener('click', event => {
            event.preventDefault();
            console.log(value);
            ipcRenderer.send('vk-coffee', {
              id: value.id,
              /* eslint-disable camelcase */
              access_token: _account.access_token
              /* eslint-enable camelcase */
            });
          });
          if (document.querySelector('#vk-user-likes-form')) {
            document.querySelector('#vk-user-likes-form').append(clone);
          }
        }
      }
    });
  }
};

importTemplates('list.html');
importTemplates('vk-user-likes.html');
importTemplates('general.html');
// Import templates
// importTemplates('group.html');
// importTemplates('public.html');
// importTemplates('account.html');

const accountsList = document.querySelector('#accounts-list');
const appearanceForm = document.querySelector('#appearance-form');
const preferencesGeneral = document.querySelector('#general-preferences');
const vkUserLikesForm = document.querySelector('#vk-user-likes-form');
const accountsAddButton = document.querySelector('#accounts-add');

const deleteAccount = userId => {
  console.log('deleteAccount:', userId);
  ipcRenderer.send('delete-account', userId);
};

accountsAddButton.classList.remove('is-shown');
accountsAddButton.addEventListener('click', event => {
  event.preventDefault();
  menu.popup(remote.getCurrentWindow());
});
preferencesGeneral.classList.add('is-shown');
appearanceForm.classList.add('is-shown');

// Events
vkAccountOption.addEventListener('change', event => {
  event.preventDefault();
  for (const option of document.querySelectorAll('option')) {
    if (option.textContent === event.target.value) {
      document.querySelector(`#${option.id}`).setAttribute('selected', 'selected');
      console.log(option.id, event.target.value);
      ipcRenderer.send('vk-account-option', option.id);
    }
  }
});

preferencesGeneralButton.addEventListener('click', event => {
  event.preventDefault();
  accountsList.classList.remove('is-shown');
  appearanceForm.classList.add('is-shown');
  preferencesGeneral.classList.add('is-shown');
  accountsAddButton.classList.remove('is-shown');
  vkUserLikesForm.classList.remove('is-shown');
});

// Accounts List
preferencesAccountsListButton.addEventListener('click', event => {
  event.preventDefault();
  preferencesGeneral.classList.remove('is-shown');
  appearanceForm.classList.remove('is-shown');
  accountsList.classList.add('is-shown');
  accountsAddButton.classList.add('is-shown');
  vkUserLikesForm.classList.remove('is-shown');
});

// Vk User Likes
vkUserLikesButton.addEventListener('click', event => {
  event.preventDefault();
  preferencesGeneral.classList.remove('is-shown');
  appearanceForm.classList.remove('is-shown');
  accountsList.classList.remove('is-shown');
  accountsAddButton.classList.remove('is-shown');
  vkUserLikesForm.classList.add('is-shown');
});

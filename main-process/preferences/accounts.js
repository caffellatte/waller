'use strict';
const {ipcMain, session, BrowserWindow} = require('electron');
const querystring = require('querystring');
const {VK} = require('vk-io');
const config = require('../../config');
const DataStore = require('../store');

const accountsData = new DataStore({name: 'Accounts'});

ipcMain.on('add-account', (event, account) => {
  const updatedAccounts = accountsData.addAccount(account).accounts;
  event.sender.send('accounts', updatedAccounts);
});

// Delete-accounts from accounts list window
ipcMain.on('delete-account', (event, account) => {
  const updatedAccounts = accountsData.deleteAccount(account).accounts;
  event.sender.send('accounts', updatedAccounts);
});

ipcMain.on('create-new-authorize-window', (event, arg) => {
  const filter = {
    urls: [config.get('vk.redirectUri') + '*']
  };
  const authorizeVkLink = `https://oauth.vk.com/authorize?client_id=${config.get('vk.clientId')}&display=${config.get('vk.display')}&redirect_uri=${config.get('vk.redirectUri')}&scope=${config.get('vk.scope')}&response_type=${config.get('vk.responseType')}&v=${config.get('vk.v')}`;
  console.log(arg);
  let window = new BrowserWindow({
    title: 'Login VK',
    show: false,
    webPreferences: {
      nodeIntegration: false
    }
  });
  window.loadURL(authorizeVkLink);
  window.show();

  // Intercept all the requests for that includes my redirect uri
  session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
    const responseUrl = details.url;
    const {hash} = new URL(responseUrl);
    const account = querystring.parse(hash.slice(1));
    const vk = new VK({
      token: account.access_token
    });
    /* eslint-disable camelcase */
    async function getAccountInfo() {
      const response = await vk.api.users.get({
        user_ids: account.user_id,
        fields: 'screen_name, photo_50'
      });
      console.log(response);
      account.first_name = response[0].first_name;
      account.last_name = response[0].last_name;
      account.is_closed = response[0].is_closed;
      account.can_access_closed = response[0].can_access_closed;
      account.screen_name = response[0].screen_name;
      account.photo_50 = response[0].photo_50;
      console.log(account);
      const updatedAccounts = await accountsData.addAccount(account).accounts;
      console.log(updatedAccounts);
      // Comment: event.sender.send('accounts', updatedAccounts);
    }
    /* eslint-enable camelcase */

    getAccountInfo().catch(console.log);
    // Comment: event.sender.send('asynchronous-reply', JSON.stringify(account));

    // Process the callback url and get any param you need
    // don't forget to let the request proceed
    callback({
      cancel: false
      // I event.sender.send('asynchronous-reply', url)
    });
    window.close();
  });

  window.on('closed', () => {
    window = null;
  });
});

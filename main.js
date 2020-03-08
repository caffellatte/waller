'use strict';
const path = require('path');
const {spawn} = require('child_process');
const querystring = require('querystring');
const {ipcMain, app, BrowserWindow, Menu, nativeTheme, shell, session} = require('electron');
const {is, appMenu, aboutMenuItem, openUrlMenuItem, openNewGitHubIssue, debugInfo} = require('electron-util');
const {VK} = require('vk-io');
console.log('nativeTheme:', nativeTheme);
// Import autoupdater module const {autoUpdater} = require('electron-updater');
const unhandled = require('electron-unhandled');
const debug = require('electron-debug');
const contextMenu = require('electron-context-menu');
const config = require('./config');
const DataStore = require('./main-process/store');
const accountsData = new DataStore({name: 'accounts'});
const preferencesData = new DataStore({name: 'preferences'});
const Vk = require('./vk/vk.js');
console.log(app.getPath('userData'));

unhandled();
debug();
contextMenu();

app.setAppUserModelId('com.flex.waller');

// Uncomment this before publishing your first version.
// It's commented out as it throws an error if there are no published versions.
// if (!is.development) {
//   const FOUR_HOURS = 1000 * 60 * 60 * 4;
//   setInterval(() => {
//     autoUpdater.checkForUpdates();
//   }, FOUR_HOURS);
//
//   autoUpdater.checkForUpdates();
// }

const showPreferences = () => {
  const window = BrowserWindow.getAllWindows().filter(win => {
    return win.isVisible();
  });
  window[0].webContents.send('show-preferences-from-menu', preferencesData.preferences);
};

const helpSubmenu = [
  openUrlMenuItem({
    label: 'Website',
    url: 'https://github.com/caffellatte/waller'
  }),
  openUrlMenuItem({
    label: 'Source Code',
    url: 'https://github.com/caffellatte/waller'
  }),
  {
    label: 'Report an Issue…',
    click() {
      const body = `
<!-- Please succinctly describe your issue and steps to reproduce it. -->


---

${debugInfo()}`;

      openNewGitHubIssue({
        user: 'sindresorhus',
        repo: 'electron-boilerplate',
        body
      });
    }
  }
];

if (!is.macos) {
  helpSubmenu.push(
    {
      type: 'separator'
    },
    aboutMenuItem({
      icon: path.join(__dirname, 'static', 'icon.png'),
      text: 'Created by Mikhail Lutsenko'
    })
  );
}

const debugSubmenu = [
  {
    label: 'Show Settings',
    click() {
      config.openInEditor();
    }
  },
  {
    label: 'Show App Data',
    click() {
      shell.openItem(app.getPath('userData'));
    }
  },
  {
    type: 'separator'
  },
  {
    label: 'Delete Settings',
    click() {
      config.clear();
      app.relaunch();
      app.quit();
    }
  },
  {
    label: 'Delete App Data',
    click() {
      shell.moveItemToTrash(app.getPath('userData'));
      app.relaunch();
      app.quit();
    }
  }
];

const macosTemplate = [
  appMenu([
    {
      label: 'Preferences…',
      accelerator: 'Command+,',
      click() {
        showPreferences();
      }
    }
  ]),
  {
    role: 'fileMenu',
    submenu: [
      {
        label: 'Custom'
      },
      {
        type: 'separator'
      },
      {
        role: 'close'
      }
    ]
  },
  {
    role: 'editMenu'
  },
  {
    role: 'viewMenu'
  },
  {
    role: 'windowMenu'
  },
  {
    role: 'help',
    submenu: helpSubmenu
  }
];

// Linux and Windows
const otherTemplate = [
  {
    role: 'fileMenu',
    submenu: [
      {
        label: 'Custom'
      },
      {
        type: 'separator'
      },
      {
        label: 'Settings',
        accelerator: 'Control+,',
        click() {
          showPreferences();
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  },
  {
    role: 'editMenu'
  },
  {
    role: 'viewMenu'
  },
  {
    role: 'help',
    submenu: helpSubmenu
  }
];

const template = process.platform === 'darwin' ? macosTemplate : otherTemplate;

if (is.development) {
  template.push({
    label: 'Debug',
    submenu: debugSubmenu
  });
}

ipcMain.on('vk-account-option', (event, userId) => {
  event.preventDefault();
  const selectedAccount = accountsData.getAccounts(userId).accounts;
  preferencesData.addPreferences({title: 'vkSelected', value: selectedAccount[userId.slice(2)]});
  preferencesData.savePreferences();
  event.sender.send('vk-selected', selectedAccount[userId.slice(2)]);
});

ipcMain.on('vk-coffee', (event, params) => {
  event.preventDefault();
  // /* eslint-disable camelcase */
  const {id, access_token, sample_size} = params;
  let vk = new Vk(event, id, access_token, sample_size, app.getPath('userData'));
  vk.getSubscriptionsById(result => {
    console.log('vk-coffee');
    console.log(result);
    event.sender.send('hide-spinner', id);
    shell.showItemInFolder(result.filenamePublicsTop);
  });
  // const child = spawn('coffee', ['vk/vk.coffee', id, access_token]);
  /* eslint-enable camelcase */
  // let logWindow = new BrowserWindow({
  //   title: 'Log',
  //   show: false,
  //   width: 600,
  //   height: 768,
  //   frame: false,
  //   acceptFirstMouse: true,
  //   titleBarStyle: 'hidden',
  //   webPreferences: {
  //     nodeIntegration: true,
  //     blinkFeatures: 'OverlayScrollbars'
  //   }
  // });
  //
  // logWindow.on('ready-to-show', () => {
  //   logWindow.show();
  // });
  //
  // logWindow.on('closed', () => {
  //   // Dereference the window
  //   // For multiple windows store them in an array
  //   logWindow = undefined;
  // });
  //
  // logWindow.loadFile(path.join(__dirname, 'sections', 'log.html'));
  // logWindow.once('show', () => {
  //   process.stdin.pipe(child.stdin);
  //   child.stdout.on('data', data => {
  //     logWindow.webContents.send('log-stdout-vk', data);
  //     console.log(`child stdout:\n${data}`);
  //   });
  //   child.stdout.on('end', data => {
  //     console.log('EEEENNNDDD');
  //     console.log(data);
  //     // Comments
  //     // logWindow.webContents.send('log-stdout-vk', data);
  //     // console.log(`child stdout:\n${data}`);
  //   });
  // });
  // // Comments
  // // const selectedAccount = accountsData.getAccounts(userId).accounts;
  // // preferencesData.addPreferences({title: "vkSelected", value: selectedAccount[userId.slice(2)]});
  // // preferencesData.savePreferences();
  // // console.log(preferencesData);
  // // console.log('Trying to delete account:', userId);
  // // console.log('accounts.js => delete-account', updatedAccounts);
  // // event.sender.send('accounts', updatedAccounts);
});

// Delete-accounts from accounts list window
ipcMain.on('delete-account', (event, userId) => {
  const updatedAccounts = accountsData.deleteAccount(userId).accounts;
  console.log('Trying to delete account:', userId);
  console.log('accounts.js => delete-account', updatedAccounts);
  event.sender.send('accounts', updatedAccounts);
});

ipcMain.on('accounts-auth', (event, arg) => {
  deleteAllCookies();
  const filter = {
    urls: [config.get('vk.redirectUri') + '*']
  };
  const authorizeVkLink = `https://oauth.vk.com/authorize?client_id=${config.get('vk.clientId')}&display=${config.get('vk.display')}&redirect_uri=${config.get('vk.redirectUri')}&scope=${config.get('vk.scope')}&response_type=${config.get('vk.responseType')}&v=${config.get('vk.v')}`;
  console.log(authorizeVkLink);
  console.log(arg);
  let window = new BrowserWindow({
    title: 'Login VK',
    width: 655,
    height: 365,
    // Frame frame: false,
    acceptFirstMouse: true,
    // Title titleBarStyle: 'hidden',
    show: false,
    webPreferences: {
      nodeIntegration: false
    }
  });
  window.loadURL(authorizeVkLink);
  window.show();

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
        fields: 'screen_name,photo_50'
      });
      console.log(response);
      account.social_network = arg;
      account.first_name = response[0].first_name;
      account.last_name = response[0].last_name;
      account.is_closed = response[0].is_closed;
      account.can_access_closed = response[0].can_access_closed;
      account.screen_name = response[0].screen_name;
      account.photo_50 = response[0].photo_50;
      account.groups = [];
      account.publics = [];
      console.log(account);
      preferencesData.addAccount({vkSelected: account.user_id});
      const updatedAccounts = await accountsData.addAccount(account).accounts;
      console.log(updatedAccounts);
      event.sender.send('accounts', updatedAccounts);
    }
    /* eslint-enable camelcase */

    getAccountInfo().catch(console.log);

    /* eslint-disable camelcase */
    async function getAccountGroups() {
      const response = await vk.api.groups.get({
        user_id: account.user_id,
        offset: 0,
        count: 1000,
        extended: 1,
        fields: 'photo_50,members_count',
        filter: 'groups,publics,events',
        access_token: account.access_token
      });
      console.log(response.items);
      account.groups = response.items;
      const updatedAccounts = await accountsData.addAccount(account).accounts;
      console.log(updatedAccounts);
      await event.sender.send('groups', account.groups);
    }
    /* eslint-enable camelcase */

    getAccountGroups().catch(console.log);

    /* eslint-disable camelcase */
    async function getAccountSubscriptions() {
      const response = await vk.api.users.getSubscriptions({
        user_id: account.user_id,
        extended: 1,
        offset: 0,
        count: 200,
        fields: 'members_count,photo_50',
        access_token: account.access_token
      });
      console.log(response);
      account.subscriptions = response.items;
      const updatedAccounts = await accountsData.addAccount(account).accounts;
      console.log(updatedAccounts);
      await event.sender.send('subscriptions', account.subscriptions);
    }
    /* eslint-enable camelcase */

    getAccountSubscriptions().catch(console.log);

    // Process the callback url and get any param you need
    // don't forget to let the request proceed
    callback({
      cancel: false
    });
    window.close();
  });

  window.on('closed', () => {
    window = null;
  });
});

// Prevent window from being garbage collected
let mainWindow = null;

const createMainWindow = async () => {
  let preferencesWindow = new BrowserWindow({
    title: app.name,
    show: false,
    width: 1024,
    height: 768,
    frame: process.platform === 'darwin' ? false : true,
    acceptFirstMouse: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true
    }
  });

  preferencesWindow.on('ready-to-show', () => {
    preferencesWindow.show();
  });

  preferencesWindow.once('show', () => {
    preferencesWindow.webContents.send('accounts', accountsData.accounts);
    if(preferencesData.preferences.vkSelected) {
      console.log('preferencesData.vkSelected:', preferencesData.preferences.vkSelected);
      // !!!!
      const _account = accountsData.getAccounts().accounts[preferencesData.preferences.vkSelected.user_id];
      preferencesWindow.webContents.send('vk-selected', _account);
      console.log('preferencesWindow (_account)', _account);
      preferencesWindow.webContents.send('groups', _account);
      preferencesWindow.webContents.send('subscriptions', _account);
      preferencesWindow.webContents.send('show-communities', preferencesData.preferences);
    }
  });

  preferencesWindow.on('closed', () => {
    // Dereference the window
    // For multiple windows store them in an array
    preferencesWindow = undefined;
  });

  await preferencesWindow.loadFile(path.join(__dirname, 'index.html'));

  return preferencesWindow;
};

const deleteAllCookies = () => {
  console.log('deleteAllCookies');
  session.defaultSession.cookies.get({})
    .then(cookies => {
      Array.prototype.forEach.call(cookies, cookie => {
        console.log(cookie);
        let url = '';
        // Get prefix, like https://www.
        url += cookie.secure ? 'https://' : 'http://';
        url += cookie.domain.charAt(0) === '.' ? 'www' : '';
        // Append domain and path
        url += cookie.domain;
        url += cookie.path;

        session.defaultSession.cookies.remove(url, cookie.name, error => {
          if (error) {
            console.log(`error removing cookie ${cookie.name}`, error);
          }
        });
      });
    }).catch(error => {
      console.log(error);
    });
};

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }

    mainWindow.show();
  }
});

app.on('window-all-closed', () => {
  if (!is.macos) {
    app.quit();
  }
});

app.on('activate', async () => {
  if (!mainWindow) {
    mainWindow = await createMainWindow();
  }
});

(async () => {
  await app.whenReady();
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  mainWindow = await createMainWindow();
  // Favorite Animal
  // const favoriteAnimal = config.get('favoriteAnimal');
  // mainWindow.webContents.executeJavaScript(`document.querySelector('header p').textContent = 'Your favorite animal is ${favoriteAnimal}'`);
  // devToolsLog(nativeTheme.themeSource);
})();

'use strict';
const path = require('path');
const {app, BrowserWindow, Menu, nativeTheme} = require('electron');
console.log('nativeTheme:', nativeTheme);
// Import autoupdater module const {autoUpdater} = require('electron-updater');
const {is} = require('electron-util');
const unhandled = require('electron-unhandled');
const debug = require('electron-debug');
const contextMenu = require('electron-context-menu');
// Config
// const config = require('./config');
const menu = require('./main-process/menu');
// Accounts
const accounts = require('./main-process/preferences/accounts');
const DataStore = require('./main-process/store');
const accountsData = new DataStore({name: 'accounts'});
const preferencesData = new DataStore({name: 'preferences'});
console.log('accounts:', accounts);
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

// Prevent window from being garbage collected
let mainWindow = null;

const createMainWindow = async () => {
  let preferencesWindow = new BrowserWindow({
    title: app.name,
    show: false,
    width: 1024,
    height: 768,
    frame: false,
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
    preferencesWindow.webContents.send('show-preferences', preferencesData.preferences);
  });

  preferencesWindow.on('closed', () => {
    // Dereference the window
    // For multiple windows store them in an array
    preferencesWindow = undefined;
  });

  await preferencesWindow.loadFile(path.join(__dirname, 'index.html'));

  return preferencesWindow;
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
  Menu.setApplicationMenu(menu);
  mainWindow = await createMainWindow();
  // Favorite Animal
  // const favoriteAnimal = config.get('favoriteAnimal');
  // mainWindow.webContents.executeJavaScript(`document.querySelector('header p').textContent = 'Your favorite animal is ${favoriteAnimal}'`);
  // devToolsLog(nativeTheme.themeSource);
})();

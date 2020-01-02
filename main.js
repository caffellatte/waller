'use strict';
const path = require('path');
const {app, BrowserWindow, Menu, ipcMain, nativeTheme} = require('electron');
// const {autoUpdater} = require('electron-updater');
const {is} = require('electron-util');
const unhandled = require('electron-unhandled');
const debug = require('electron-debug');
const contextMenu = require('electron-context-menu');
const config = require('./config');
const menu = require('./main-process/menu');
// const packageJson = require('./package.json');

// Prints given message both in the terminal console and in the DevTools
function devToolsLog(s) {
  console.log(s)
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.executeJavaScript(`console.log("${s}")`)
  }
}

unhandled();
debug();
contextMenu();

ipcMain.on('asynchronous-message', (event, arg) => {
  event.sender.send('asynchronous-reply', 'pong')
	devToolsLog('asynchronous-reply pong')
})
// Unhandled Promise Rejection - TypeError : Cannot read property "appId" of undefined
// https://github.com/sindresorhus/electron-boilerplate/issues/31
//
// app.setAppUserModelId(packageJson.build.appId);

app.setAppUserModelId('com.flex.waller');

// Uncomment this before publishing your first version.
// It's commented out as it throws an error if there are no published versions.
// if (!is.development) {
// 	const FOUR_HOURS = 1000 * 60 * 60 * 4;
// 	setInterval(() => {
// 		autoUpdater.checkForUpdates();
// 	}, FOUR_HOURS);
//
// 	autoUpdater.checkForUpdates();
// }

// Prevent window from being garbage collected
let mainWindow;
let accountsListWindow;
let addAccountWindow;

const createMainWindow = async () => {
	const win = new BrowserWindow({
		title: app.name,
		show: false,
		width: 600,
		height: 400
	});

	win.on('ready-to-show', () => {
		win.show();
	});

	win.on('closed', () => {
		// Dereference the window
		// For multiple windows store them in an array
		mainWindow = undefined;
	});

	await win.loadFile(path.join(__dirname, 'index.html'));

	return win;
};

const createAccountsListWindow = async () => {
	const win = new BrowserWindow({
		title: 'Accounts List',
		show: false,
		width: 600,
		height: 400
	});

	win.on('ready-to-show', () => {
		win.show();
	});

	win.on('closed', () => {
		// Dereference the window
		// For multiple windows store them in an array
		mainWindow = undefined;
	});

	await win.loadFile(path.join(__dirname, 'sections', 'preferences', 'accounts', 'list.html'));

	return win;
};

const createAddAccountWindow = async () => {
	const win = new BrowserWindow({
		title: 'Accounts List',
		show: false,
		width: 600,
		height: 400
	});

	win.on('ready-to-show', () => {
		win.show();
	});

	win.on('closed', () => {
		// Dereference the window
		// For multiple windows store them in an array
		mainWindow = undefined;
	});

	await win.loadFile(path.join(__dirname, 'sections', 'preferences', 'accounts', 'add.html'));

	return win;
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

	const favoriteAnimal = config.get('favoriteAnimal');
	mainWindow.webContents.executeJavaScript(`document.querySelector('header p').textContent = 'Your favorite animal is ${favoriteAnimal}'`);
  devToolsLog(nativeTheme.themeSource);
})();

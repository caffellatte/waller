const normalize = require('electron-shortcut-normalizer');
const shortcuts = document.querySelectorAll('kbd.normalize-to-platform');

Array.prototype.forEach.call(shortcuts, shortcut => {
  shortcut.textContent = normalize(shortcut.textContent, process.platform);
});

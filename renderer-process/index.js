const {remote} = require('electron');
const {Menu, MenuItem} = remote;

// Build our new menu
const menu = new Menu();

menu.append(new MenuItem({
  label: 'VK',
  click: () => {
    // Trigger an alert when menu item is clicked
    alert('Deleted');
  }
}));

menu.append(new MenuItem({
  label: 'More Info...',
  click: () => {
    // Trigger an alert when menu item is clicked
    alert('Here is more information');
  }
}));

// Add the listener
document.addEventListener('DOMContentLoaded', () => {

  let filesContext = document.querySelectorAll('.file_arq');

  filesContext.forEach(function(el){
    el.addEventListener('click', event => {
      event.preventDefault();
      menu.popup(remote.getCurrentWindow());
    });
  });
});

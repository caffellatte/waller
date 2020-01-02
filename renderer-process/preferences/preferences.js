const links = document.querySelectorAll('link[rel="import"]');

// Preferences navigation buttons in head of window
const preferencesGeneralButton = document.querySelector('#icon-switch');
const preferencesAccountsListButton = document.querySelector('#icon-users');
const windowContent = document.querySelector('.window-content');
const toolbarActions = document.querySelector('.toolbar-actions');
const container = document.querySelector('.window');

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
});

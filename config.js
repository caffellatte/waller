'use strict';
const Store = require('electron-store');

module.exports = new Store({
  defaults: {
    favoriteAnimal: '🦄',
    vk: {
      clientId: '7229483',
      secureKey: 'gpu1g7tM0JESFyF3cP0v',
      serviceToken: '4c4023c44c4023c44c4023c4c84c2e73ef44c404c4023c411a37b1a140e49049741e171',
      v: '5.103',
      display: 'page',
      redirectUri: 'http://localhost/oauth/redirect',
      scope: 'friends',
      responseType: 'token'
    }
  }
});

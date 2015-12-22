'use strict';
const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

let mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  app.quit();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  const protocol = electron.protocol;
  protocol.registerFileProtocol('app', function(request, callback) {
    let url = request.url.substr(12);
    callback({path: require('path').normalize(__dirname + '/birdex.asar/' + url)});
  }, function (error) {
    if (error)
      console.error('Failed to register protocol')
  });

  // bugfix for <img ng-src> requesting unsafe:app://birdex/path
  protocol.registerFileProtocol('unsafe', function(request, callback) {
    let url = request.url.substr(19);
    callback({path: require('path').normalize(__dirname + '/birdex.asar/' + url)});
  }, function (error) {
    if (error)
      console.error('Failed to register protocol')
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280
    , height: 720
    , minHeight: 720
    , minWidth: 1024
    , 'web-preferences': {
      'web-security': false
    }
  });

  // and load the index.html of the app.

  // ASAR VERSION
  // mainWindow.loadURL('app://birdex/index-dev.html');

  // WEB VERSION
  mainWindow.loadURL('http://oleg.dev:8000/index-dev.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

'use strict';
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const localShortcut = require('electron-localshortcut');

const APP_URL = 'app://birdex/index.html'; // birdex.asar
// const APP_URL = 'http://new.001.birdex.org/';
// const APP_URL = 'http://oleg.dev:8000/index-dev.html';
// const APP_URL = 'http://oleg.dev:8000/index.html';

const handleSetupEvent = function() {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      //
      // - Install desktop and start menu shortcuts
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit();
      return true;
  }
};
if (handleSetupEvent()) {
  return;
}

function devTools() {
  const win = BrowserWindow.getFocusedWindow();

  if (win) {
    win.toggleDevTools();
  }
}

function refresh() {
  const win = BrowserWindow.getFocusedWindow();

  // return console.log(APP_URL.substr(3));
  if (win) {
    if (APP_URL.substr(0, 3) === 'app') {
      win.loadURL(APP_URL);
    } else {
      win.webContents.reloadIgnoringCache();
    }
  }
}

app.on('ready', () => {
  localShortcut.register('Ctrl+Shift+I', devTools);
  localShortcut.register('F12', devTools);

  localShortcut.register('CmdOrCtrl+R', refresh);
  localShortcut.register('F5', refresh);
});

let downloadedUpdate = false;

const GhReleases = require('electron-gh-releases')
let options = {
  repo: 'AlgorithmLLC/chat-client-electron',
  currentVersion: app.getVersion()
};
const updater = new GhReleases(options);
// Check for updates
// `status` returns true if there is a new update available
updater.check((err, status) => {
  if (!err && status) {
    // Download the update
    updater.download();
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  app.quit();
});


let mainWindow;
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
  mainWindow = new electron.BrowserWindow({
    width: 1280
    , height: 720
    , minHeight: 720
    , minWidth: 1024
    , 'web-preferences': {
      'web-security': false
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(APP_URL);

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

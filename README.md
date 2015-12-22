# chat-client-electron

### Get it
```bash
git clone https://github.com/AlgorithmLLC/chat-client-electron.git
cd chat-client-electron
npm install
npm start
```

### Point to right birdex frontend
Edit `main.js:47-51`
```js
  // ASAR VERSION
  // mainWindow.loadURL('app://birdex/index-dev.html');

  // WEB VERSION
  mainWindow.loadURL('http://oleg.dev:8000/index-dev.html');
```

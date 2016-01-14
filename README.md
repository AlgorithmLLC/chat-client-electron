# chat-client-electron

### Get it
```sh
git clone https://github.com/AlgorithmLLC/chat-client-electron.git
cd chat-client-electron
npm install
```

### Use it
Build and launch test version: `grunt build`

Generated version is in `build` folder.

App endpoint can be changed in `main.js` (`APP_URL`).

### Make new release
1. Edit `app` folder and/or place new `birdex.asar`
2. Edit `version` in top-level `package.json`
3. Commit your changes and make new tag equal to step 2
3. `git add . && git commit -m "1.1.1" && git tag 1.1.1 && git push && git push --tags`
4. Run `grunt release`
5. Go to [Github releases](https://github.com/AlgorithmLLC/chat-client-electron/releases) and upload contents of `release` folder to latest tag

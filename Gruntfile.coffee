path = require 'path'
grunt = require 'grunt'

grunt.loadNpmTasks 'grunt-contrib-clean'
grunt.loadNpmTasks 'grunt-contrib-copy'
grunt.loadNpmTasks 'grunt-rcedit'
grunt.loadNpmTasks 'grunt-electron-installer'
grunt.loadNpmTasks 'grunt-shell'
grunt.loadNpmTasks 'grunt-download-electron'

version = require('./package.json').version

certificateFile = 'algorithm.pfx'
certificatePassword = ''

grunt.initConfig
  clean:
    build: 'build'

  shell:
    options:
      failOnError: false
    kill:
      command: 'taskkill /f /im birdex.exe /t'
    run:
      command: path.resolve(__dirname, 'build', 'birdex.exe')

  'download-electron':
    version: '0.36.8'
    outputDir: 'electron'

  copy:
    electron:
      expand: true
      cwd: 'electron/'
      src: ['**', '!electron.exe']
      dest: 'build/'
    'electron-exe':
      src: 'electron/electron.exe'
      dest: 'build/Birdex.exe'
    app:
      expand: true
      cwd: 'app/'
      src: ['*', 'node_modules/**']
      dest: 'build/resources/app/'
    releases:
      expand: true
      cwd: 'release/'
      src: ['*']
      dest: 'release~/'

  rcedit:
    exes:
      files: [
        src: 'build/Birdex.exe'
      ]
      options:
        'icon': 'app/birdex.ico'
        'file-version': version
        'product-version': version
        'version-string':
          'ProductName': 'Birdex'
          'FileDescription': 'Secure messenger'
          'CompanyName': 'Algorithm Corporation L.P.'
          'LegalCopyright': 'Copyright © 2016 Algorithm Corporation L.P. All rights reserved.'

  'create-windows-installer':
    ia32:
      appDirectory: 'build'
      outputDirectory: 'release'
      loadingGif: 'app/birdex.png'
      version: version
      exe: 'Birdex.exe'
      noMsi: true
      setupIcon: 'app/birdex.ico'
      iconUrl: 'https://cdn.rawgit.com/AlgorithmLLC/chat-client-electron/master/app/birdex.ico'
      owners: 'Algorithm Corporation L.P.'
      authors: 'Algorithm Corporation L.P.'
      remoteReleases: 'https://github.com/AlgorithmLLC/chat-client-electron'

      signWithParams: "/a /f \"#{path.resolve(certificateFile)}\" /p \"#{certificatePassword}\" /fd sha256 /tr http://timestamp.comodoca.com/?td=sha256 /td sha256"

grunt.registerTask 'build', ['shell:kill', 'clean', 'download-electron', 'copy', 'rcedit', 'shell:run', 'shell:kill']
grunt.registerTask 'release', ['shell:kill', 'clean', 'download-electron', 'copy', 'rcedit', 'create-windows-installer', 'clean:build']
# grunt.registerTask 'default', []

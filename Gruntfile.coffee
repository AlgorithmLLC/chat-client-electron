path = require 'path'
grunt = require 'grunt'

grunt.loadNpmTasks 'grunt-contrib-clean'
grunt.loadNpmTasks 'grunt-contrib-copy'
grunt.loadNpmTasks 'grunt-rcedit'
grunt.loadNpmTasks 'grunt-electron-installer'
grunt.loadNpmTasks 'grunt-shell'

version = require('./package.json').version

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
      src: 'app/**'
      dest: 'build/resources/'

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
          'CompanyName': 'Algorithm LLC'
          'LegalCopyright': 'Copyright © 2016 Algorithm LLC. All rights reserved.'

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
      remoteReleases: 'https://github.com/AlgorithmLLC/chat-client-electron'

grunt.registerTask 'build', ['shell:kill', 'clean', 'copy', 'rcedit', 'shell:run', 'shell:kill']
grunt.registerTask 'default', ['shell:kill', 'clean', 'copy', 'rcedit', 'create-windows-installer', 'clean:build']

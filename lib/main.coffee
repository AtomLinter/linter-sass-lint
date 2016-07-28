{CompositeDisposable} = require 'atom'
path = require 'path'
prefixPath = null

module.exports =
  config:
    noConfigDisable:
      title: 'Disable when no sass-lint config file is found in your project root'
      type: 'boolean'
      description: 'and a .sass-lint.yml file is not specified in the .sass-lint.yml Path option'
      default: false
    resolvePathsRelativeToConfig:
      title: 'Resolve paths in configuration relative to config file'
      type: 'boolean'
      description: 'Instead of the default where paths are resolved relative to the project root'
      default: 'false'
    configFile:
      title: '.sass-lint.yml Config File'
      description: 'A .sass-lint.yml file to use/fallback to if no config file is found in the current project root'
      type: 'string'
      default: ''
    globalNodePath:
      title: 'Global Node Installation Path'
      description: 'Run `npm get prefix` and paste the result here'
      type: 'string'
      default: ''
    globalSassLint:
      title: 'Use global sass-lint installation'
      description: """The latest sass-lint is included in this package but if you\'d like to use a globally installed one enable it here.\n
      Make sure sass-lint is installed globally and is in your $PATH"""
      type: 'boolean'
      default: false

  activate: ->
    require('atom-package-deps').install('linter-sass-lint')
    @subs = new CompositeDisposable
    @subs.add atom.config.observe 'linter-sass-lint.noConfigDisable',
      (noConfigDisable) =>
        @noConfigDisable = noConfigDisable
    @subs.add atom.config.observe 'linter-sass-lint.configFile',
      (configFile) =>
        @configFile = configFile
    @subs.add atom.config.observe 'linter-sass-lint.globalSassLint',
      (globalSassLint) =>
        @globalSassLint = globalSassLint
    @subs.add atom.config.observe 'linter-sass-lint.globalNodePath',
      (globalNodePath) =>
        @globalPath = globalNodePath
    @subs.add atom.config.observe 'linter-sass-lint.resolvePathsRelativeToConfig',
      (resolvePathsRelativeToConfig) =>
        @resolvePathsRelativeToConfig = resolvePathsRelativeToConfig

  deactivate: ->
    @subs.dispose()

  # return a relative path for a file within our project
  # we use this to match it to our include/exclude glob string within sass-lint's
  # user specified config
  getFilePath: (absolutePath, configFilePath) ->
    path = require('path')
    if @resolvePathsRelativeToConfig
      return path.relative(path.dirname(configFilePath), absolutePath)
    else
      return atom.project.relativizePath(absolutePath)[1]

  # Determines whether to use the sass-lint package included with linter-sass-lint
  # or the users globally installed sass-lint version
  findExecutable: ->
    {spawnSync} = require 'child_process'
    consistentEnv = require 'consistent-env'
    if not @globalSassLint
      return require path.join(__dirname, '..', 'node_modules', 'sass-lint')
    if @globalPath is '' and prefixPath is null
      npmCommand = if process.platform is 'win32' then 'npm.cmd' else 'npm'
      env = Object.assign({}, consistentEnv())
      try
        prefixPath = spawnSync(npmCommand, [
          'get'
          'prefix'
        ], {env}).output[1].toString().trim()
      catch e
        throw new Error('prefix')
    if process.platform is 'win32'
    then return require path.join(@globalPath or prefixPath, 'node_modules', 'sass-lint')
    return require path.join(@globalPath or prefixPath, 'lib', 'node_modules', 'sass-lint')

  provideLinter: ->
    provider =
      name: 'sass-lint'
      grammarScopes: ['source.css.scss', 'source.scss', 'source.css.sass', 'source.sass']
      scope: 'file'
      lintOnFly: true
      lint: (editor) =>
        {find} = require 'atom-linter'
        helpers = require './helpers'
        globule = require 'globule'
        configExt = '.sass-lint.yml'
        filePath = editor.getPath()
        projectConfig = find filePath, configExt
        globalConfig = if @configFile is '' then null else @configFile
        config = if projectConfig isnt null then projectConfig else globalConfig

        try
          linter = @findExecutable()
        catch error
          if error.message is 'prefix' then atom.notifications.addError """
            **Error getting $PATH - linter-sass-lint**\n

            You've enabled using global sass-lint without specifying a prefix so we tried to.
            Unfortunately we were unable to execute `npm get prefix` for you..\n
            Please make sure Atom is getting $PATH correctly or set it directly in the `linter-sass-lint` settings.
          """, {dismissable: true}
          return []

          atom.notifications.addWarning """
            **Sass-lint package missing**

            The sass-lint package cannot be found, please check sass-lint is installed globally. \n
            You can always use the sass-lint pacakage included with linter-sass-lint by disabling the
            `Use global sass-lint installation` option
          """, {dismissable: true}
          return []

        if config isnt null and path.extname(config) isnt '.yml'
          atom.notifications.addWarning """
            **Config File Error**

            The config file you specified doesn't seem to be a .yml file.\n
            Please see the sass-lint [documentation](https://github.com/sasstools/sass-lint/tree/master/docs) on how to create a config file.
          """

        if config is null and @noConfigDisable is false
          return [
            type: 'Info'
            text: 'No .sass-lint.yml config file detected or specified. Please check your settings'
            filePath: filePath
            range: [[0, 0], [0, 0]]
          ]

        else if config is null and @noConfigDisable is true
          return []

        try
          compiledConfig = linter.getConfig({}, config)
          relativePath = this.getFilePath(filePath, config)

          if globule.isMatch(compiledConfig.files.include, relativePath) and not globule.isMatch(compiledConfig.files.ignore, relativePath)
            result = linter.lintText({
              text: editor.getText(),
              format: helpers.getFileSyntax(filePath),
              filename: filePath
            }, {}, config)
        catch error
          messages = []
          match = error.message.match /Parsing error at [^:]+: (.*) starting from line #(\d+)/
          if match
            text = "Parsing error: #{match[1]}."
            lineIdx = Number(match[2]) - 1
            line = editor.lineTextForBufferRow(lineIdx)
            colEndIdx = if line then line.length else 1

            return [
              type: 'Error'
              text: text
              filePath: filePath
              range: [[lineIdx, 0], [lineIdx, colEndIdx]]
            ]
          else
            # Leaving this here to allow people to report the errors
            console.log('linter-sass-lint', error)
            return [
              type: 'Error'
              text: 'Unexpected parse error in file'
              filePath: filePath
              range: [[lineIdx, 0], [lineIdx, colEndIdx]]
            ]
          return []

        if result then return result.messages.map (msg) ->
          line = if msg.line then msg.line - 1 else 0
          col = if msg.column then msg.column - 1 else 0
          text = if msg.message then ' ' + msg.message else 'Unknown Error'
          ruleHref = helpers.getRuleURI(msg.ruleId)
          html = '<a href="'+ ruleHref + '" class="badge badge-flexible sass-lint">' + msg.ruleId + '</a>' + text

          result = {
            type: if msg.severity is 1 then 'Warning' else if msg.severity is 2 then 'Error' else 'Info',
            html,
            filePath: filePath,
            range: [[line, col], [line, col + 1]]
          }

          return result

        return []

{CompositeDisposable} = require 'atom'
{findFile, exec} = helpers = require 'atom-linter'
path = require 'path'

module.exports =
  config:
    executablePath:
      title: 'sass-lint package Path'
      type: 'string'
      default: path.join(__dirname, '..', 'node_modules', 'sass-lint')
    configPath:
      title: '.sass-lint.yml Config Path'
      type: 'string'
      default: ''

  activate: ->

    console.log 'activate linter-sass-lint'
    @subs = new CompositeDisposable
    @subs.add atom.config.observe 'linter-sass-lint.executablePath',
      (executablePath) =>
        @executablePath = executablePath
    @subs.add atom.config.observe 'linter-sass-lint.configPath',
      (configPath) =>
        @configPath = configPath

  deactivate: ->
    @subs.dispose()

  provideLinter: ->
    provider =
      grammarScopes: ['source.css.scss', 'source.scss', 'source.css.sass', 'source.sass']
      scope: 'file'
      lintOnFly: false
      lint: (editor) =>
        configExt = '.sass-lint.yml'
        filePath = editor.getPath()
        config = if @configPath is '' then findFile filePath, configExt else path.join @configPath, configExt
        linter = require(@executablePath)

        if config is null then throw new Error 'No .sass-lint.yml config file found'

        results = linter.lintFiles(filePath, {}, config)

        return results[0].messages.map (msg) ->
          line = if msg.line then msg.line - 1 else 0
          col = if msg.column then msg.column - 1 else 0

          type: if msg.severity is 1 then 'Warning' else if msg.severity is 2 then 'Error' else 'Info'
          text: if msg.message then msg.message else 'Unknown Error'
          filePath: filePath
          range: [[line, col], [line, col + 1]]

path = require 'path'

module.exports =

  # Constructs the rule URI from the rule ID provided
  getRuleURI: (ruleId) ->
    sassLintDocs = 'https://github.com/sasstools/sass-lint/tree/master/docs/rules'
    return sassLintDocs + '/' + ruleId + '.md'

  # return a relative path for a file within our project
  # we use this to match it to our include/exclude glob string within sass-lint's
  # user specified config
  getFilePath: (path) ->
    relative = atom.project.relativizePath(path)

  # Determines whether to use the sass-lint package included with linter-sass-lint
  # or the users globally installed sass-lint version
  findExecutable: (globalSassLint, globalPath) ->
    {spawnSync} = require 'child_process'
    consistentEnv = require 'consistent-env'
    if not globalSassLint
      return require path.join(__dirname, '..', 'node_modules', 'sass-lint')
    if globalPath is '' and prefixPath is null
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
    then return require path.join(globalPath or prefixPath, 'node_modules', 'sass-lint')
    return require path.join(globalPath or prefixPath, 'lib', 'node_modules', 'sass-lint')

path = require 'path'
{SASSLINT_DOC_URL, VALID_SYNTAXES} = require './constants.coffee'

module.exports =

  ###*
   * Function to construct the rule URI from the rule ID provided
   * @param {string} ruleId - The rule name / id
   * @return {string} The rule URL
   ###
  getRuleURI: (ruleId) ->
    return SASSLINT_DOC_URL + '/' + ruleId + '.md'

  ###*
   * Function to check a file base / extension for valid extensions to use with sass-lint
   * @param {string} syntax - The syntax to check
   * @return {boolean} Whether or not the syntax is valid for sass-lint
   ###
  isValidSyntax: (syntax) ->
    return VALID_SYNTAXES.indexOf(syntax) isnt -1

  ###*
   * Function to check a file base / extension for valid extensions to use with sass-lint
   * @param {string} filePath - The filepath to check
   * @return {string} The syntax we wish to pass to sass-lint
   ###
  getFileSyntax: (filePath) ->
    existingSyntax = path.extname(filePath).slice(1)
    if @isValidSyntax(existingSyntax) is false
      base = path.parse(filePath).base.split('.')
      syntax = (item for item in base when @isValidSyntax(item))
      if syntax.length
        return syntax[0]

    return existingSyntax

  ###*
   * Attempts to resolve the root directory/project directory of the currently open file/editor instance
   * @param {string} filePath - The currently active editor file path
   * @return {Object|null} The project directory instance or null if no project root is found
   ###
  getRootDir: (filePath) ->
    return atom.project.relativizePath(filePath)[0]

  ###*
   * Checks to see if a config file exists in the project's root directory if a root directory exists
   * @param {string|null} dir - The current project root or null if a project doesn't exist
   * @param {string} configExt - The Sass-lint config extension
   * @return {string|null} The path to the config file if located in the project root, null if it doesn't exist
   ###
  getRootDirConfig: (dir, configExt) ->
    fs = require 'fs'
    rootDir = dir

    if rootDir
      confLoc = path.join(rootDir, configExt)
      try
        fs.accessSync(confLoc, fs.R_OK)
        return confLoc
      catch
        return null

    return rootDir

  ###*
   * Looks for and returns the path to a projects config file or null if it can't be found or doesn't exist
   * @param {Object} editor - An editor instance
   * @param {string} filePath - The currently active editor file path
   * @param {string} configExt - The Sass-lint config extension
   * @param {boolean} noRootConfDisable - The user specified option to disable linter-sass-lint if no config
   *                 is found in the root of the project
   * @return {string|null} The path to the config file or null if not found
   ###
  getConfig: (editor, filePath, configExt, noRootConfDisable) ->
    {find} = require 'atom-linter'
    rootDir = @getRootDir(filePath)
    rootDirConfig = @getRootDirConfig(rootDir, configExt)

    if noRootConfDisable is true and rootDirConfig is null then return null

    return find filePath, configExt

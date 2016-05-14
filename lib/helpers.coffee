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

module.exports =

  # Constructs the rule URI from the rule ID provided
  getRuleURI: (ruleId) ->
    sassLintDocs = 'https://github.com/sasstools/sass-lint/tree/master/docs/rules'
    return sassLintDocs + '/' + ruleId + '.md'

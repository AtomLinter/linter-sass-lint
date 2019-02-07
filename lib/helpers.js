'use babel';

import path from 'path';
import fs from 'fs';
import { find } from 'atom-linter';
// NOTE: This rule appears to currently be broken
// eslint-disable-next-line import/named
import { SASSLINT_DOC_URL, VALID_SYNTAXES } from './constants';

const severityMap = new Map([[1, 'warning'], [2, 'error']]);

export default {
  /**
   * Function to construct the rule URI from the rule ID provided
   * @param {string} ruleId - The rule name / id
   * @return {string} The rule URL
   */
  getRuleURI(ruleId) {
    return `${SASSLINT_DOC_URL}/${ruleId}.md`;
  },

  /**
   * Function to check a file base / extension for valid extensions to use with
   * sass-lint
   * @param {string} syntax - The syntax to check
   * @return {boolean} Whether or not the syntax is valid for sass-lint
   */
  isValidSyntax(syntax) {
    return VALID_SYNTAXES.includes(syntax);
  },

  /**
   * Function to check a file base / extension for valid extensions to use with
   * sass-lint
   * @param {string} filePath - The filepath to check
   * @return {string} The syntax we wish to pass to sass-lint
   */
  getFileSyntax(filePath) {
    const existingSyntax = path.extname(filePath).slice(1);
    if (!this.isValidSyntax(existingSyntax)) {
      const base = path.parse(filePath).base.split('.');
      const syntax = base.reduce((acc, item) => {
        if (this.isValidSyntax(item)) {
          return acc.concat(item);
        }
        return acc;
      }, []);
      if (syntax.length) {
        return syntax[0];
      }
    }

    return existingSyntax;
  },

  /**
   * Attempts to resolve the root directory/project directory of the currently
   * open file/editor instance
   * @param {string} filePath - The currently active editor file path
   * @return {Object|null} - The project directory instance or null if no
   *                         project root is found
   */
  getRootDir(filePath) {
    return atom.project.relativizePath(filePath)[0];
  },

  /**
   * Checks to see if a config file exists in the project's root directory if a
   * root directory exists
   * @param {string|null} dir - The current project root or null if a project
   *                            doesn't exist
   * @param {string} configExt - The Sass-lint config extension
   * @return {string|null} - The path to the config file if located in the
   *                         project root, null if it doesn't exist
   */
  getRootDirConfig(dir, configExt) {
    const rootDir = dir;

    if (rootDir) {
      const confLoc = path.join(rootDir, configExt);
      try {
        fs.accessSync(confLoc, fs.R_OK);
        return confLoc;
      } catch (error) {
        return null;
      }
    }

    return rootDir;
  },

  /**
   * Looks for and returns the path to a projects config file or null if it
   * can't be found or doesn't exist
   * @param {string} filePath - The currently active editor file path
   * @param {string} configExt - The Sass-lint config extension
   * @param {boolean} noRootConfDisable - The user specified option to disable
   *                                      linter-sass-lint if no config is found
   *                                      in the root of the project
   * @return {string|null} The path to the config file or null if not found
   */
  getConfig(filePath, configExt, noRootConfDisable) {
    const rootDir = this.getRootDir(filePath);
    const rootDirConfig = this.getRootDirConfig(rootDir, configExt);

    if (noRootConfDisable === true && rootDirConfig === null) {
      return null;
    }

    return find(filePath, configExt);
  },

  /**
   * Return the string severity for a numerical one, defalting to info
   * @param  {number} severity severity from the sass-lint linter
   * @return {string}          severity for the Linter API
   */
  getSeverity: severity => (severityMap.has(severity)
    ? severityMap.get(severity)
    : 'info'
  ),

  warningConfigFile: () => {
    atom.notifications.addWarning(`\
**Config File Error**

The config file you specified doesn't seem to be a .yml file.\n
Please see the sass-lint [documentation](https://github.com/sasstools/sass-lint/tree/master/docs) on how to create a config file.\
`);
  },

  errorGettingPath: () => {
    atom.notifications.addError(`\
**Error getting $PATH - linter-sass-lint**

You've enabled using global sass-lint without specifying a prefix so we tried to.
Unfortunately we were unable to execute \`npm get prefix\` for you..
Please make sure Atom is getting $PATH correctly or set it directly in the \`linter-sass-lint\` settings.\
`, { dismissable: true });
  },

  warningSassLintMissing: () => {
    atom.notifications.addWarning(`\
**Sass-lint package missing**

The sass-lint package cannot be found, please check sass-lint is installed globally.
You can always use the sass-lint pacakage included with linter-sass-lint by disabling the
\`Use global sass-lint installation\` option\
`, { dismissable: true });
  },
};

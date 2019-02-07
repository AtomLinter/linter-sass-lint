'use babel';

import { CompositeDisposable } from 'atom';

// Dependencies
let path;
let globule;
let spawnSync;
let consistentEnv;
let generateRange;
let helpers;

function loadDeps() {
  if (!path) {
    path = require('path');
  }
  if (!globule) {
    globule = require('globule');
  }
  if (!consistentEnv) {
    consistentEnv = require('consistent-env');
  }
  if (!spawnSync) {
    ({ spawnSync } = require('child_process'));
  }
  if (!generateRange) {
    ({ generateRange } = require('atom-linter'));
  }
  if (!helpers) {
    helpers = require('./helpers');
  }
}

const idleCallbacks = new Set();
const makeIdleCallback = (work) => {
  let callbackId;
  const callBack = () => {
    idleCallbacks.delete(callbackId);
    work();
  };
  callbackId = window.requestIdleCallback(callBack);
  idleCallbacks.add(callbackId);
};

let prefixPath = null;

export default {
  activate() {
    this.subs = new CompositeDisposable();
    this.subs.add(
      atom.config.observe('linter-sass-lint.noConfigDisable',
        (value) => { this.noConfigDisable = value; }),
      atom.config.observe('linter-sass-lint.configFile',
        (value) => { this.configFile = value; }),
      atom.config.observe('linter-sass-lint.globalSassLint',
        (value) => { this.globalSassLint = value; }),
      atom.config.observe('linter-sass-lint.globalNodePath',
        (value) => { this.globalPath = value; }),
      atom.config.observe('linter-sass-lint.resolvePathsRelativeToConfig',
        (value) => { this.resolvePathsRelativeToConfig = value; }),
    );

    if (!atom.inSpecMode()) {
      const loadLinterSassLintDependencies = () => { loadDeps(); };
      const linterSassLintInstallPeerPackages = () => {
        require('atom-package-deps').install('linter-sass-lint');
      };
      makeIdleCallback(loadLinterSassLintDependencies);
      makeIdleCallback(linterSassLintInstallPeerPackages);
    }
  },

  deactivate() {
    idleCallbacks.forEach(callbackID => window.cancelIdleCallback(callbackID));
    idleCallbacks.clear();
    return this.subs.dispose();
  },

  // return a relative path for a file within our project
  // we use this to match it to our include/exclude glob string within sass-lint's
  // user specified config
  getFilePath(absolutePath, configFilePath) {
    if (this.resolvePathsRelativeToConfig) {
      return path.relative(path.dirname(configFilePath), absolutePath);
    }
    return atom.project.relativizePath(absolutePath)[1];
  },

  // Determines whether to use the sass-lint package included with linter-sass-lint
  // or the users globally installed sass-lint version
  findExecutable() {
    // FIXME: use resolve here
    if (!this.globalSassLint) {
      // eslint-disable-next-line import/no-dynamic-require
      return require(path.join(__dirname, '..', 'node_modules', 'sass-lint'));
    }
    if ((this.globalPath === '') && (prefixPath === null)) {
      const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
      const env = Object.assign({}, consistentEnv());
      try {
        prefixPath = spawnSync(npmCommand, [
          'get',
          'prefix',
        ], { env }).output[1].toString().trim();
      } catch (e) {
        throw new Error('prefix');
      }
    }
    if (process.platform === 'win32') {
      // eslint-disable-next-line import/no-dynamic-require
      return require(path.join(this.globalPath || prefixPath, 'node_modules', 'sass-lint'));
    }
    // eslint-disable-next-line import/no-dynamic-require
    return require(path.join(this.globalPath || prefixPath, 'lib', 'node_modules', 'sass-lint'));
  },

  provideLinter() {
    return {
      name: 'sass-lint',
      grammarScopes: ['source.css.scss', 'source.scss', 'source.css.sass', 'source.sass'],
      scope: 'file',
      lintsOnChange: true,
      lint: (editor) => {
        // Force the dependencies to load if they haven't already
        loadDeps();

        const filePath = editor.getPath();
        const projectConfig = helpers.getConfig(
          filePath, '.sass-lint.yml', this.noConfigDisable,
        );
        const globalConfig = this.configFile === '' ? null : this.configFile;
        const config = projectConfig !== null ? projectConfig : globalConfig;

        let linter;
        try {
          linter = this.findExecutable();
        } catch (error) {
          if (error.message === 'prefix') {
            helpers.errorGettingPath();
            return null;
          }

          helpers.warningSassLintMissing();
          return null;
        }

        if ((config !== null) && (path.extname(config) !== '.yml')) {
          helpers.warningConfigFile();
        }

        if ((config === null) && (this.noConfigDisable === false)) {
          return [{
            severity: 'info',
            excerpt: 'No .sass-lint.yml config file detected or specified. '
              + 'Please check your settings',
            location: {
              file: filePath,
              position: generateRange(editor, 0),
            },
          }];
        }

        if (config === null && this.noConfigDisable === true) {
          return null;
        }

        let result;
        try {
          const compiledConfig = linter.getConfig({}, config);
          const relativePath = this.getFilePath(filePath, config);

          if (
            globule.isMatch(compiledConfig.files.include, relativePath)
            && !globule.isMatch(compiledConfig.files.ignore, relativePath)
          ) {
            result = linter.lintText({
              text: editor.getText(),
              format: helpers.getFileSyntax(filePath),
              filename: filePath,
            }, {}, config);
          }
        } catch (error) {
          const match = error.message.match(/Parsing error at [^:]+: (.*) starting from line #(\d+)/);
          if (match) {
            const lineIdx = (Number.parseInt(match[2], 10) || 1) - 1;

            return [{
              severity: 'error',
              excerpt: `Parsing error: ${match[1]}.`,
              location: {
                file: filePath,
                position: generateRange(editor, lineIdx),
              },
            }];
          }

          // Leaving this here to allow people to report the errors
          // eslint-disable-next-line no-console
          console.log('linter-sass-lint', error);
          return [{
            severity: 'error',
            excerpt: 'Unexpected parse error in file',
            location: {
              file: filePath,
              position: generateRange(editor, 0),
            },
          }];
        }

        if (result) {
          return result.messages.map((msg) => {
            const line = msg.line ? msg.line - 1 : 0;
            const col = msg.column ? msg.column - 1 : 0;
            const excerpt = msg.message
              ? `${msg.message} (${msg.ruleId})`
              : 'Unknown Error';

            result = {
              severity: helpers.getSeverity(msg.severity),
              excerpt,
              url: helpers.getRuleURI(msg.ruleId),
              location: {
                file: filePath,
                position: generateRange(editor, line, col),
              },
            };

            return result;
          });
        }

        return [];
      },
    };
  },
};

'use babel';

import { join } from 'path';

const lint = require('../lib/main.coffee').provideLinter().lint;

const failurePath = join(__dirname, 'fixtures', 'files', 'failure.scss');
const configFile = join(__dirname, 'fixtures', 'config', '.sass-lint.yml');

describe('The sass-lint provider for Linter - path options', () => {
  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() => {
      atom.packages.activatePackage('linter-sass-lint');
      return atom.packages.activatePackage('language-sass');
    });
  });

  describe('checks failure.scss, expects a message and', () => {
    let editor = null;

    beforeEach(() => {
      waitsForPromise(() => {
        atom.config.set('linter-sass-lint.configFile', configFile);
        atom.config.set('linter-sass-lint.globalSassLint', true);
        return atom.workspace.open(failurePath).then((openEditor) => {
          editor = openEditor;
        });
      });
    });

    it('lints the file with the globally installed sass-lint', () => {
      const messages = lint(editor);
      expect(messages.length).toBeGreaterThan(0);
    });

    it('verifies the first message', () => {
      const messages = lint(editor);
      const slDocUrl = 'https://github.com/sasstools/sass-lint/tree/master/docs/rules/no-ids.md';
      const attributes = `href="${slDocUrl}" class="badge badge-flexible sass-lint"`;
      const warningMarkup = `<a ${attributes}>no-ids</a>`;
      const warnId = ' ID selectors not allowed';

      expect(messages[0].type).toBe('Error');
      expect(messages[0].text).not.toBeDefined();
      expect(messages[0].html).toBe(`${warningMarkup}${warnId}`);
      expect(messages[0].filePath).toBe(failurePath);
      expect(messages[0].range).toEqual([[0, 0], [0, 1]]);
    });

    it('verifies the second message', () => {
      const messages = lint(editor);
      const slDocUrl = 'https://github.com/sasstools/sass-lint/tree/master/docs/rules/no-color-literals.md';
      const attributes = `href="${slDocUrl}" class="badge badge-flexible sass-lint"`;
      const warningMarkup = `<a ${attributes}>no-color-literals</a>`;
      const warnId = ' Color literals such as \'red\' should only be used in variable declarations';

      expect(messages[1].type).toBe('Warning');
      expect(messages[1].text).not.toBeDefined();
      expect(messages[1].html).toBe(`${warningMarkup}${warnId}`);
      expect(messages[1].filePath).toBe(failurePath);
      expect(messages[1].range).toEqual([[1, 9], [1, 10]]);
    });
  });
});

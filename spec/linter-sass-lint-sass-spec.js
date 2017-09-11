'use babel';

// eslint-disable-next-line no-unused-vars
import { it, fit, wait, beforeEach, afterEach } from 'jasmine-fix';
import { join } from 'path';

const { lint } = require('../lib/main.coffee').provideLinter();

const failurePath = join(__dirname, 'fixtures', 'files', 'failure.scss');
const ignoredPath = join(__dirname, 'fixtures', 'files', 'ignored.scss');
const passPath = join(__dirname, 'fixtures', 'files', 'pass.scss');
const configFile = join(__dirname, 'fixtures', 'config', '.sass-lint.yml');

describe('The sass-lint provider for Linter - sass', () => {
  beforeEach(async () => {
    atom.workspace.destroyActivePaneItem();
    await atom.packages.activatePackage('language-sass');
    await atom.packages.activatePackage('linter-sass-lint');
  });

  describe('checks failure.sass and', () => {
    let messages = null;

    beforeEach(async () => {
      atom.config.set('linter-sass-lint.configFile', configFile);
      const editor = await atom.workspace.open(failurePath);
      messages = await lint(editor);
    });

    it('finds at least one message', () => {
      expect(messages.length).toBeGreaterThan(0);
    });

    it('verifies the first message', () => {
      const slDocUrl = 'https://github.com/sasstools/sass-lint/tree/master/docs/rules/no-ids.md';
      const attributes = `href="${slDocUrl}" class="badge badge-flexible sass-lint"`;
      const warningMarkup = `<a ${attributes}>no-ids</a>`;
      const warnId = ' ID selectors not allowed';

      expect(messages[0].type).toEqual('Error');
      expect(messages[0].text).not.toBeDefined();
      expect(messages[0].html).toBe(`${warningMarkup}${warnId}`);
      expect(messages[0].filePath).toBe(failurePath);
      expect(messages[0].range).toEqual([[0, 0], [0, 1]]);
    });

    it('verifies the second message', () => {
      const slDocUrl = 'https://github.com/sasstools/sass-lint/tree/master/docs/rules/no-color-literals.md';
      const attributes = `href="${slDocUrl}" class="badge badge-flexible sass-lint"`;
      const warningMarkup = `<a ${attributes}>no-color-literals</a>`;
      const warnId = ' Color literals such as \'red\' should only be used in variable declarations';

      expect(messages[1].type).toEqual('Warning');
      expect(messages[1].text).not.toBeDefined();
      expect(messages[1].html).toBe(`${warningMarkup}${warnId}`);
      expect(messages[1].filePath).toBe(failurePath);
      expect(messages[1].range).toEqual([[1, 9], [1, 10]]);
    });
  });

  describe('checks pass.sass and', () => {
    it('finds nothing wrong with the valid file', async () => {
      atom.config.set('linter-sass-lint.configFile', configFile);
      const editor = await atom.workspace.open(passPath);
      const messages = await lint(editor);

      expect(messages.length).toBe(0);
    });
  });

  describe('opens ignored.sass and', () => {
    it('ignores the file and reports no warnings', async () => {
      atom.config.set('linter-sass-lint.configFile', configFile);
      const editor = await atom.workspace.open(ignoredPath);
      const messages = await lint(editor);

      expect(messages.length).toBe(0);
    });
  });

  describe('opens failure.sass and sets pacakage to not lint if no config file present', () => {
    it("doesn't lint the file as there's no config file present", async () => {
      atom.config.set('linter-sass-lint.noConfigDisable', true);
      atom.config.set('linter-sass-lint.configFile', '');
      const editor = await atom.workspace.open(failurePath);
      const messages = await lint(editor);

      expect(messages.length).toBe(0);
    });
  });
});

'use babel';

describe('The sass-lint provider for Linter - scss', () => {
  const lint = require('../lib/main').provideLinter().lint;
  const configFile = `${__dirname}/fixtures/config/.sass-lint.yml`;

  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() => {
      atom.packages.activatePackage('linter-sass-lint');
      return atom.packages.activatePackage('language-sass');
    });
  });

  describe('checks failure.scss and', () => {
    let editor = null;
    beforeEach(() => {
      waitsForPromise(() => {
        atom.config.set('linter-sass-lint.configFile', configFile);
        return atom.workspace.open(`${__dirname}/fixtures/files/failure.scss`).then(openEditor => {
          editor = openEditor;
        });
      });
    });

    it('finds at least one message', () => {
      const messages = lint(editor);
      expect(messages.length).toBeGreaterThan(0);
    });

    it('verifies the first message', () => {
      const messages = lint(editor);
      const warningMarkup = '<span class=\"badge badge-flexible\">no-ids</span>';
      const warnId = ' ID selectors not allowed';
      expect(messages[0].type).toBeDefined();
      expect(messages[0].type).toEqual('Error');
      expect(messages[0].html).toBeDefined();
      expect(messages[0].html).toEqual(`${warningMarkup}${warnId}`);
      expect(messages[0].filePath).toBeDefined();
      expect(messages[0].filePath).toMatch(/.+failure\.scss$/);
      expect(messages[0].range).toBeDefined();
      expect(messages[0].range.length).toEqual(2);
      expect(messages[0].range).toEqual([[0, 0], [0, 1]]);
    });

    it('verifies the second message', () => {
      const messages = lint(editor);
      const warningMarkup = '<span class=\"badge badge-flexible\">no-color-literals</span>';
      const warnId = ' Color literals such as \'red\' should only be used in variable declarations';
      expect(messages[1].type).toBeDefined();
      expect(messages[1].type).toEqual('Warning');
      expect(messages[1].html).toBeDefined();
      expect(messages[1].html).toEqual(`${warningMarkup}${warnId}`);
      expect(messages[1].filePath).toBeDefined();
      expect(messages[1].filePath).toMatch(/.+failure\.scss$/);
      expect(messages[1].range).toBeDefined();
      expect(messages[1].range.length).toEqual(2);
      expect(messages[1].range).toEqual([[1, 9], [1, 10]]);
    });
  });

  describe('checks pass.scss and', () => {
    let editor = null;
    beforeEach(() => {
      waitsForPromise(() => {
        atom.config.set('linter-sass-lint.configFile', configFile);
        return atom.workspace.open(`${__dirname}/fixtures/files/pass.scss`).then(openEditor => {
          editor = openEditor;
        });
      });
    });

    it('finds nothing wrong with the valid file', () => {
      const messages = lint(editor);
      expect(messages.length).toEqual(0);
    });
  });

  describe('opens ignored.scss and', () => {
    let editor = null;
    beforeEach(() => {
      waitsForPromise(() => {
        atom.config.set('linter-sass-lint.configFile', configFile);
        return atom.workspace.open(`${__dirname}/fixtures/files/ignored.scss`).then(openEditor => {
          editor = openEditor;
        });
      });
    });

    it('ignores the file and reports no warnings', () => {
      const messages = lint(editor);
      expect(messages.length).toEqual(0);
    });
  });

  describe('opens failure.scss and sets pacakage to not lint if no config file present', () => {
    let editor = null;
    beforeEach(() => {
      waitsForPromise(() => {
        atom.config.set('linter-sass-lint.noConfigDisable', true);
        atom.config.set('linter-sass-lint.configFile', '');
        return atom.workspace.open(`${__dirname}/fixtures/files/failure.scss`).then(openEditor => {
          editor = openEditor;
        });
      });
    });

    it('doesn\'t lint the file as there\s no config file present', () => {
      const messages = lint(editor);
      expect(messages.length).toEqual(0);
    });
  });
});

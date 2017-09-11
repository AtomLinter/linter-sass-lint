'use babel';

// eslint-disable-next-line no-unused-vars
import { it, fit, wait, beforeEach, afterEach } from 'jasmine-fix';
import { SASSLINT_DOC_URL } from '../lib/constants.coffee';

const helpers = require('../lib/helpers.coffee');
const fs = require('fs');

describe('helpers', () => {
  describe('getRuleURI', () => {
    it('should return the correct rule URL', () => {
      const ruleId = 'no-ids';
      const result = helpers.getRuleURI(ruleId);

      expect(result).toEqual(`${SASSLINT_DOC_URL}/${ruleId}.md`);
    });
  });

  describe('isValidSyntax', () => {
    it('should return true if a supported syntax is passed', () => {
      expect(helpers.isValidSyntax('scss')).toBe(true);
    });

    it('should return false if a supported syntax is not passed', () => {
      expect(helpers.isValidSyntax('html')).toBe(false);
    });
  });

  describe('getFileSyntax', () => {
    it('it should return scss if a scss filename is provided', () => {
      expect(helpers.getFileSyntax('test/file.scss')).toBe('scss');
    });

    it('it should return sass if a sass filename is provided', () => {
      expect(helpers.getFileSyntax('test/file.sass')).toBe('sass');
    });

    it('it should return scss if a scss.liquid filename is provided', () => {
      expect(helpers.getFileSyntax('test/file.scss.liquid')).toBe('scss');
    });

    it('it should return sass if a sass.liquid filename is provided', () => {
      expect(helpers.getFileSyntax('test/file.sass.liquid')).toBe('sass');
    });

    it('it should return html if a html filename is provided', () => {
      expect(helpers.getFileSyntax('test/file.html')).toBe('html');
    });
  });

  describe('getRootDir', () => {
    let editor = null;

    beforeEach(async () => {
      editor = await atom.workspace.open(`${__dirname}/fixtures/files/failure.scss`);
    });

    it('should return null if the file isn\'t within the currently open project', () => {
      expect(helpers.getRootDir('/test.scss')).toEqual(null);
    });

    it(
      'should return the root dir object if the file is part of the currently open project',
      () => {
        expect(helpers.getRootDir(editor.getPath())).not.toEqual(null);
        expect(helpers.getRootDir(editor.getPath())).toBeDefined();
      },
    );
  });

  describe('getRootDirConfig', () => {
    let editor = null;

    beforeEach(async () => {
      editor = await atom.workspace.open(`${__dirname}/fixtures/files/failure.scss`);
    });

    it('should return null if no root directory is specified', () => {
      expect(helpers.getRootDirConfig(null, '.sass-lint.yml')).toBe(null);
    });

    it('should return null if no config exists in the root of the project', () => {
      const rootDir = helpers.getRootDir(editor.getPath());
      expect(helpers.getRootDirConfig(rootDir, '.sass-lint.yml')).toBe(null);
    });


    it('should return the config file path if a config is found in the project root', () => {
      spyOn(fs, 'accessSync').andReturn(true);
      const rootDir = helpers.getRootDir(editor.getPath());
      expect(helpers.getRootDirConfig(rootDir, '.sass-lint.yml')).not.toBe(null);
      expect(fs.accessSync).toHaveBeenCalled();
    });
  });
});

'use babel';

import { SASSLINT_DOC_URL } from '../lib/constants.coffee';

const helpers = require('../lib/helpers.coffee');

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
});

### 1.0.1
- Updated the README.md to reflect the latest option changes in 1.0.0

### 1.0.0
- Added 'Lint On Fly' support [#11](https://github.com/AtomLinter/linter-sass-lint/issues/11) thanks to [Casey Foster](https://github.com/caseywebdev)
- Removed the `executablePath` option
- Removed the ability to specify a path to a config you must now explicitly define a config file if you use this option
  - project configs remain untouched
  - this has been deprecated since 0.4.0
- Added a `globalSassLint` option to use your globally installed `sass-lint` package rather than the version included with `linter-sass-lint` [#3](https://github.com/AtomLinter/linter-sass-lint/issues/3)
- Automatically look to your global modules in the event the above option is enabled but you've not set your path prefix.
- Fixed an issue with ignored and included files options of your config being ignored, ignored files will now not be linted. See the `sass-lint` config file [documentation](https://github.com/sasstools/sass-lint/tree/master/docs) for more information on how to use this.
- Fixed a few inconsistencies in the package tests
- Added tests for the new options included in 1.0.0

### 0.6.3
- Update to latest airbnb eslint dependency
- Slight refactor of tests to meet new standards

### 0.6.2
- Renamed incorrectly named syntax tests

### 0.6.1
- fix protected branch issue with apm publish

### 0.6.0
- Tests! Specs for sass and scss.
- Added Travis, CircleCi & Appveyor builds
- Added and modified a few dotfiles for project consistency

### 0.5.1
- Added contribution guidelines
- Added .editorconfig for consistent contributions [http://editorconfig.org/](http://editorconfig.org/)
- Updated executablePath option description
- Updated project description
- Added missing documentation for noConfigDisable option

### 0.5.0
- Improved error messages
- Added option to disable linting if no config file is found
- Config files in the project root are now preferred over the config path option
- Updated dependencies and added development lint step
- Improved formatting of lint results

### 0.4.4
- Moved over to the AtomLinter organisation

### 0.4.3
- oops, wrong branch

### 0.4.2
- Small update to bump minimum sass-lint version to v1.4.0

### 0.4.1
- Fixed a possible error that would cause sass-lint to break if you tried to lint in an ignored file

### 0.4.0
- Updated sass-lint dependency to 1.3.1
- Modify the config path option to accept files as well as paths.
- Update config path description
- Add deprecation warning messages

**Deprecations**

- The config path will soon only accept paths with filenames specified for the user config. A deprecation warning message is displayed to urge users to switch

### 0.3.0
- Updated README.md with correct branches and updated spelling
- Added nicer block parsing error messages [#6](https://github.com/DanPurdy/linter-sass-lint/pull/6) (thanks to [josa42](https://github.com/josa42))
- Updated missing config warning message to provide more useful information [#5](https://github.com/DanPurdy/linter-sass-lint/pull/5) (thanks to [josa42](https://github.com/josa42))

### 0.2.1
- Added name to linter warnings [#4](https://github.com/DanPurdy/linter-sass-lint/pull/4) (thanks to [steelbrain](https://github.com/steelbrain))

### 0.2.0

- Bump `sass-lint` version
- Update package description
- Update output format to show rule names

### 0.1.5

- Bump `sass-lint` version
- Introduce changelog

### 0.1.4

- Update package keywords

### 0.1.3

- Update to readme instructions

### 0.1.2

- Corrected documentation

### 0.1.1

- Added MIT license

### 0.1.0

- Initial release

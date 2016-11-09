## 1.7.4
- Update sass-lint version to 1.10.2

## 1.7.3
- Update sass-lint version to 1.10.1

## 1.7.2
- Update sass-lint version to 1.10.0 - adds support for disabling linters via comments
- Updated other third party packages

## 1.7.1
- Update sass-lint version to 1.9.1 to force fix AST issues included with sass-lint
- Updated other third party packages

## 1.7.0
- Package start up time improvements thanks to [@ypresto](https://github.com/ypresto)
- Update third party packages
- Updated CI configurations thanks [@Arcanemagus](https://github.com/Arcanemagus)

## 1.6.1
- Force update to sass-lint 1.8.0 due to the high number of fixes and also AST fixes

## 1.6.0
- Adds `resolvePathsRelativeToConfig` to the config options to allow paths to be resolved relative to your config file rather than project root. Thanks to [@DirtyHairy](https://github.com/DirtyHairy)
- The usual third party package updates

## 1.5.0
- Allows the inclusion of files with extra extensions such as 'file.scss.liquid'
- Updated to Atom linter ^5.0.1
- Includes eslint updates for development

## 1.4.3
- Force latest version of sass-lint 1.7.0
- Update a few dependencies

## 1.4.2
- Include latest version of sass-lint
- Fix dependency issue with eslint-config-airbnb-base

## 1.4.1
- Update included version of sass-lint to 1.6.0 :tada:

## 1.4.0
- Updated eslint and globule dependencies
- Added links to the sass-lint rule documentation on all rule id badges/lint messages
- Updated tests for new lint message format

## 1.3.1
- Updated multiple dependencies
- Removed unnecessary test characters

## 1.3.0
- Updated to use consistent-env rather than the consistent-path package
- Updated to use the latest eslint (2.5.1) and eslint-config-airbnb (6.2.0) packages
- Added multiple node versions to our travis test file

### 1.2.0
- Updated eslint to use v2.4.0 [#54](https://github.com/AtomLinter/linter-sass-lint/pull/54)
- Improved package startup time. [#55](https://github.com/AtomLinter/linter-sass-lint/pull/55)

Thanks to
- [ypresto](https://github.com/ypresto)
- [Arcanemagus](https://github.com/Arcanemagus)

### 1.1.2
- Lock down eslint to 2.2.x due to [eslint #5476](https://github.com/eslint/eslint/issues/5476)

### 1.1.1
- Updated eslint to ^2.2.0
- Updated eslint-config-airbnb to ^6.0.1

### 1.1.0
- Updated no config error messages to return info type lint warnings instead (popups are annoying)
- Updated a few package dependencies (eslint-config-airbnb, atom-package-deps)

### 1.0.5
- Temporarily locked down our dependency on `atom-package-deps` to v3.0.6

### 1.0.4
- Temporarily locked down our dependency on consistent-path to v1.0.3
- Updated to the airbnb's eslint config v5

### 1.0.3
- Unexpected parse errors and sass-lint issues are just reported as lint errors rather than the annoying red box of doom
- this will be updated in 1.1.0 to improve the way these are reported and handled, for now the errors will be logged to the console.

### 1.0.2
- Update eslint-config-airbnb to version 4.0.0

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

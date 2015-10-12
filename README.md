# linter-sass-lint

This linter plugin for [Linter](https://github.com/AtomLinter/Linter) provides an interface to [sass-lint](https://github.com/sasstools/sass-lint). It will be used with files that have the “Sass” or “SCSS” syntax.

[sass-lint](https://github.com/sasstools/sass-lint) is a node only sass linter and isn't related to [scss-lint](https://github.com/brigade/scss-lint).

### Installation

You'll need to have [Linter](https://atom.io/packages/linter) installed to use this plugin

A version of [sass-lint](https://github.com/sasstools/sass-lint) comes bundled with this plugin but if you'd like to install it manually you can follow the instructions [here](https://github.com/sasstools/sass-lint).

#### Plugin installation

```
apm install linter-sass-lint
```

#### .sass-lint.yml

A `.sass-lint.yml` config file is required for this linter. You can find an example of one [here](https://github.com/sasstools/sass-lint/blob/master/lib/config/sass-lint.yml) and documentation on how to configure this and each of the rules [here](https://github.com/sasstools/sass-lint/tree/master/docs).

By default this plugin will search up the directory tree for this file, you can also specify a path to this config file in the plugin settings or in `~/.atom/config.cson` file. Usually you would place this config file in your projects root and keep it under version control too.

### Settings

There are two options you can configure either within the plugin or by editing your `~/.atom/config.cson` file.

* `executablePath` - this is the path to a locally installed `sass-lint` package (by default a version will be included with and used by this plugin).

* `configPath` - this is path to a `.sass-lint.yml` config file.

### Contributing

Contributions, suggestions and fixes are more than welcome.

This plugin follows a simple style guide.

1. Indentation is 2 spaces.
1. All code should pass the coffeelinter linter, the config of which is included in this repository.

General contribution guidelines apply

1. Fork the plugin repository
1. Create a feature/hotfix branch off of master
1. Commit and push the branch
1. Make a pull request

If you're unsure on whether your contribution will be required then please file an issue first and we can discuss it.

If you find any problems with the `sass-lint` itself with regards to bugs in rules then please visit the [sass-lint Github Page](https://github.com/sasstools/sass-lint) please note that `sass-lint` is young and still under heavy development.

Laravel Elixir Browserify
=========================

[![Version](https://img.shields.io/npm/v/laravel-elixir-browserify.svg)](https://www.npmjs.com/package/laravel-elixir-browserify)
[![Dependencies](https://img.shields.io/david/skrajewski/laravel-elixir-browserify.svg)](https://david-dm.org/skrajewski/laravel-elixir-browserify)

Highly customizable __browserify__ extension for _laravel elixir_. Includes support for transforms, __watchify__ and __multiple bundles__.

- [Install](#install)
- [Usage](#usage)
	- [Example *Gulpfile.js*:](#example-gulpfilejs)
	- [Advanced example](#advanced-example)
	- [Watchify](#watchify)
	- [Multiple bundles](#multiple-bundles)
	- [Custom task name](#custom-task-name)
- [Changelog](#changelog)
- [License](#license)

## Install

```
npm install --save-dev laravel-elixir-browserify
```

## Usage

### Example *Gulpfile.js*:

```javascript
var elixir = require('laravel-elixir');
var browserify = require('laravel-elixir-browserify');

elixir(function(mix) {
    // make sure this line is inside of elixir callback function
    // to replace default browserify task
    browserify.init();

    mix.browserify("bootstrap.js");
});
```

First argument is the entry point of your application _(default directory is resources/assets/js)_. In second argument you could pass plugin options and browserify options.

### Advanced example
```javascript
var elixir = require('laravel-elixir');
var browserify = require('laravel-elixir-browserify');

elixir(function(mix) {
    browserify.init();

    mix.browserify("bootstrap.js", {
    	debug: true,
    	insertGlobals: true,
    	transform: ["debowerify"],
    	output: "public/js",
    	rename: "bundle.js"
    });
});
```

### Watchify
If you want to use _watchify_ for _browserify_ just run `gulp watchify` instead of standard `gulp watch` command. Elixir's watch task is a dependency of watchify and will also be run.

```javascript
var elixir = require('laravel-elixir');
var browserify = require('laravel-elixir-browserify');

elixir(function(mix) {
    browserify.init();

    mix.browserify("bootstrap.js");
});
```

### Multiple bundles
```javascript
var elixir = require('laravel-elixir');
var browserify = require('laravel-elixir-browserify');

elixir(function(mix) {
    browserify.init();

    mix.browserify("admin.js")
        .browserify("app.js", { transform: ["reactify"] })
});
```

### Custom task name
Laravel Elixir has own _browserify_ task, but this plugin replaced him. If you want to use both tasks or maybe you want to rename it you can pass _name_ argument to the `init(name)` method.

```javascript
var elixir = require('laravel-elixir');
require('laravel-elixir-browserify').init("bundler");

elixir(function(mix) {
    mix.bundler("bootstrap.js");
});
```

## Changelog
__0.8.0__
- Resolved conflicts with _browserify_ elixir task
- Better watchify integration

__0.7.0__
- Added multiple bundles support (thanks for @Daveawb)
- Added watchify support (thanks for @Daveawb)

__0.6.0__
- Removed second argument (*destination directory*) and add *output* option.
- Fixed browserify transforms (*vinyl-transform* replaced by *vinyl-source-stream* and *vinyl-buffer*)

__0.5.0__
- Default bundle file has the same name as input file. Use *rename* option to change it.

__0.4.1__
- Renamed the helpers *folder* to *commands*

__0.4.0__
- Replace blacklisted *gulp-browserify* with *browserify* and *vinyl-transform* packages (thanks for @JoeCianflone).
- Removed default *debowerify* transform.

## License
The MIT License. Copyright (c) 2015 by Szymon Krajewski and many contributors.

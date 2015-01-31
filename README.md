## Laravel Elixir Browserify

![Version](https://img.shields.io/npm/v/laravel-elixir-browserify.svg?style=flat-square)
![Dependencies](https://img.shields.io/david/skrajewski/laravel-elixir-browserify.svg?style=flat-square)

Simple extension to *laravel elixir* to build javascript bundle with *browserify*.

## Install

```
npm install --save-dev laravel-elixir-browserify
```

## Usage

### Example *Gulpfile.js*:

```javascript
var elixir = require('laravel-elixir');

require('laravel-elixir-browserify');

elixir(function(mix) {
    mix.browserify("bootstrap.js");
});
```

First argument is the entry point of your application _(default directory is resources/assets/js)_. In second argument you could pass plugin options and browserify options.

#### Advanced example
```javascript
var elixir = require('laravel-elixir');
require('laravel-elixir-browserify');

elixir(function(mix) {
    mix.browserify("bootstrap.js", {
    	debug: true, 
    	insertGlobals: true, 
    	transform: ["debowerify"],
    	output: "public/js",
    	rename: "bundle.js"
    });
});
```

## Changelog
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

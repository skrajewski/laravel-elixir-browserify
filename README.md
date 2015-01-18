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

First argument is the entry point of your application _(default directory is resources/assets/js)_. Second argument is destination directory. In third argument you could pass browserify options. Two latest parameters are optional. In production bundle will be compressed.

#### Advanced example

```javascript
var elixir = require('laravel-elixir'),
	debowerify = require('debowerify');

require('laravel-elixir-browserify');

elixir(function(mix) {
    mix.browserify("bootstrap.js", "public/js", {debug: true, insertGlobals: true, transform: [debowerify]});
});
```

## Changelog
__0.5.0__
- Default bundle file has the same name as input file. Use _rename_ option to change it.

__0.4.1__
- Renamed the helpers *folder* to *commands*

__0.4.0__
- Replace blacklisted *gulp-browserify* with *browserify* and *vinyl-transform* packages (thanks for @JoeCianflone).
- Removed default _debowerify_ transform.

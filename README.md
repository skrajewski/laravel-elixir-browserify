# laravel-elixir-browserify

Simple extension to *laravel elixir* to build javascript bundle with *browserify*.

## Install

```
npm install --save-dev laravel-elixir-browserify
```

## Usage

### Example *Gulpfile*:

```javascript
var elixir = require('laravel-elixir');

require('laravel-elixir-browserify');

elixir(function(mix) {
    mix.browserify("bootstrap.js");
});
```

First argument is the entry point of your application _(default directory is resources/js)_. Second argument is destination directory. In third argument you could pass browserify options. Two latest parameters are optional. Default configuration has **debowerify** transform support. In production bundle will be compressed.

#### Advanced example

```javascript
elixir(function(mix) {
    mix.browserify("bootstrap.js", "public/js", {debug: true, insertGlobals: true});
});
```

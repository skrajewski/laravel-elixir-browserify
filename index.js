var gulp = require('gulp'),
    elixir = require('laravel-elixir'),
    utilities = require('laravel-elixir/ingredients/commands/Utilities'),
    notifications = require('laravel-elixir/ingredients/commands/Notification'),
    gulpIf = require('gulp-if'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    _  = require('underscore');

elixir.extend('browserify', function (src, options) {

    var config = this,
        defaultOptions = {
            debug:         ! config.production,
            rename:        null,
            srcDir:        config.assetsDir + 'js',
            output:        config.jsOutput,
            transform:     [],
            insertGlobals: false,
            cache: {},
            packageCache: {},
            fullPaths: true
        };

    options = _.extend(defaultOptions, options);
    src = "./" + utilities.buildGulpSrc(src, options.srcDir);

    gulp.task('browserify', function () {

        var onError = function(e) {
            new notifications().error(e, 'Browserify Compilation Failed!');
            this.emit('end');
        };

        var bundler = ! config.production ? watchify(browserify(src, options)) : browserify(src, options);

        bundler.on('update', bundle);

        function bundle() {
          return bundler.bundle().on('error', onError)
            .pipe(source(src.split("/").pop()))
            .pipe(buffer())
            .pipe(gulpIf(config.production, uglify()))
            .pipe(gulpIf(typeof options.rename === 'string', rename(options.rename)))
            .pipe(gulp.dest(options.output))
            .pipe(new notifications().message('Browserified!'));
        }

        return bundle();
    });

    this.registerWatcher('browserify', options.srcDir + '/**/*.js');

    return this.queueTask('browserify');
});
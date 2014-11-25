var gulp = require('gulp'),
    notify = require('gulp-notify'),
    browserify = require('gulp-browserify'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    plugins = require('gulp-load-plugins')(),
    debowerify = require('debowerify'),
    elixir = require('laravel-elixir'),
    _ = require('underscore'),
    utilities = require('laravel-elixir/ingredients/helpers/utilities'),
    config = require('laravel-elixir').config;


elixir.extend('browserify', function (src, outputDir, options) {

    var config = this,
        baseDir = config.assetsDir + 'js',
        defaultOptions;

    defaultOptions = {
        transform: ['debowerify'],
        insertGlobals: false,
        debug: !config.production
    };

    src = utilities.buildGulpSrc(src, baseDir, '**/*.js');

    options = _.extend(defaultOptions, options);

    gulp.task('browserify', function () {
        var onError = function (err) {
            notify.onError({
                title:    "Laravel Elixir",
                subtitle: "Browserify Compilation Failed!",
                message:  "Error: <%= error.message %>",
                icon: __dirname + '/../laravel-elixir/icons/fail.png'
            })(err);

            this.emit('end');
        };

        return gulp.src(src)
            .pipe(browserify(options)).on('error', onError)
            .pipe(plugins.if(config.production, uglify()))
            .pipe(gulp.dest(options.output || config.cssOutput))
            .pipe(notify({
                title: 'Laravel Elixir',
                message: 'Browserify Compiled!',
                icon: __dirname + '/../laravel-elixir/icons/laravel.png'
            }));
    });

    this.registerWatcher('browserify', baseDir + '/**/*.js');

    return this.queueTask('browserify');

});

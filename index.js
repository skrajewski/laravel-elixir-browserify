var gulp = require('gulp'),
    notify = require('gulp-notify'),
    browserify = require('gulp-browserify'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    debowerify = require('debowerify'),
    elixir = require('laravel-elixir'),
    _ = require('underscore');

elixir.extend('browserify', function (src, output, options) {

    var config = this,
        baseDir = config.preprocessors.baseDir + 'js',
        defaultOptions;

    defaultOptions = {
        transform: ['debowerify'],
        insertGlobals: false,
        debug: !config.production
    };

    src = this.buildGulpSrc(src, baseDir, '**/*.js');

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
            .pipe(gulpif(config.production, uglify()))
            .pipe(gulpif(config.production, rename('bundle.min.js'), rename("bundle.js")))
            .pipe(gulp.dest(output || config.jsOutput))
            .pipe(notify({
                title: 'Laravel Elixir',
                message: 'Browserify Compiled!',
                icon: __dirname + '/../laravel-elixir/icons/laravel.png',
            }));
    });

    this.registerWatcher('browserify', baseDir + '/**/*.js');

    return this.queueTask('browserify');

});
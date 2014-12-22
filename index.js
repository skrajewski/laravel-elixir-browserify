var gulp = require('gulp'),
    elixir = require('laravel-elixir'),
    plugins = require('gulp-load-plugins')(),
    _ = require('underscore'),
    utilities = require('laravel-elixir/ingredients/helpers/Utilities'),
    notifications= require('laravel-elixir/ingredients/helpers/Notification');

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

        var onError = function(e) {
            new notification().error(e, 'Browserify Compilation Failed!');
            this.emit('end');
        };

        return gulp.src(src)
            .pipe(plugins.browserify(options)).on('error', onError)
            .pipe(plugins.if(config.production, plugins.uglify()))
            .pipe(gulp.dest(options.output || config.jsOutput))
            .pipe(new notification().message('Browserified Compiled!'));
    });

    this.registerWatcher('browserify', baseDir + '/**/*.js');

    return this.queueTask('browserify');

});

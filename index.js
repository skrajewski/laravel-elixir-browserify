var gulp = require('gulp'),
    elixir = require('laravel-elixir'),
    inSequence = require('run-sequence'),
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

function snake_case(file) {
    return 'browserify_' + file.split('.')[0].split('/').join('_');
}

elixir.extend('browserify', function (src, options) {

    var config = this,
        taskName = snake_case(src),
        defaultOptions = {
            debug:         ! config.production,
            rename:        null,
            srcDir:        config.assetsDir + 'js',
            output:        config.jsOutput,
            transform:     [],
            insertGlobals: false
        };

    options = _.extend(defaultOptions, options);
    src = "./" + utilities.buildGulpSrc(src, options.srcDir);

    gulp.task(taskName, function () {

        var onError = function(e) {
            new notifications().error(e, 'Browserify Compilation Failed!');
            this.emit('end');
        };

        var bundle = function(b) {
            return b.bundle()
                .on('error', onError)
                .pipe(source(src.split("/").pop()))
                .pipe(buffer())
                .pipe(gulpIf(!options.debug, uglify()))
                .pipe(gulpIf(typeof options.rename === 'string', rename(options.rename)))
                .pipe(gulp.dest(options.output))
                .pipe(new notifications().message('Browserified!'));
        }

        var b = browserify(src, options);

        if (config.watchify) {
            b = watchify(b);

            b.on('update', function() {
                bundle(b);
            });
        }

        return bundle(b);
    });

    this.registerWatcher(taskName, options.srcDir + '/**/*.js', config.watchify ? 'nowatch' : 'default');

    return this.queueTask(taskName);
});

elixir.extend('watchify', function(src, options) {

    var config = this,
        srcPaths,
        tasksToRun;

    gulp.task('watchify', ['watch'], function() {
        srcPaths = config.watchers.nowatch;
        tasksToRun = _.intersection(config.tasks, _.keys(srcPaths).concat('copy'));
        config.watchify = true;

        inSequence.apply(this, tasksToRun);
    });

    return this.queueTask('watchify');
})
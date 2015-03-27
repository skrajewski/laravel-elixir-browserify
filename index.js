var gulp = require('gulp'),
    elixir = require('laravel-elixir'),
    config = elixir.config,
    inSequence = require('run-sequence'),
    utilities = require('laravel-elixir/ingredients/commands/Utilities'),
    notifications = require('laravel-elixir/ingredients/commands/Notification'),
    gulpIf = require('gulp-if'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    _  = require('underscore'),
    path = require('path');

var createBundle = function(watch) {
    var stream;
    var notification = new notifications();
    var onError = function(e) {
        notification.error(e, 'Browserify Compilation Failed!');
        this.emit('end');
    };

    var bundle = function(b, instance) {
        return b.bundle()
            .on('error', onError)
            .pipe(source(path.basename(instance.src)))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(gulpIf(!instance.options.debug, uglify()))
            .pipe(sourcemaps.write('./'))
            .pipe(gulpIf(_.isString(instance.options.rename), rename(instance.options.rename)))
            .pipe(gulp.dest(instance.options.output))
            .pipe(notification.message('Browserified!'));
    };

    config.toBrowserify.forEach(function(instance) {
        var b = browserify(instance.src, instance.options);

        if (watch) {
            b = watchify(b);

            b.on('update', function() {
                bundle(b, instance);
            });
        }

        stream = bundle(b, instance);
    });

    return stream;
};

/**
 * Create the Gulp task.
 *
 * @return {void}
 */
var buildTask = function() {
    gulp.task('browserify', function() {
        return createBundle(false);
    });
};

/**
 * Create elixir extension
 */
elixir.extend('browserify', function (src, options) {
    if (!_.isArray(config.toBrowserify)) {
        config.toBrowserify = [];
    }

    options = _.extend({
        debug:         ! config.production,
        rename:        null,
        srcDir:        config.assetsDir + 'js',
        output:        config.jsOutput,
        transform:     [],
        insertGlobals: false
    }, options);

    config.toBrowserify.push({
        src : "./" + utilities.buildGulpSrc(src, options.srcDir),
        options: options
    });

    buildTask();

    // Use null instead of browserify so gulp doesn't
    // compile each bundle twice on start.
    this.registerWatcher(null, function() {
        return createBundle(true);
    });

    return this.queueTask('browserify');
});

var gulp = require('gulp'),
    elixir = require('laravel-elixir'),
    config = elixir.config,
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

var initializePlugin = function(taskName) {
    taskName = taskName || "browserify";

    /**
     * Create the Gulp task.
     */
    var buildTask = function() {
        var stream;

        gulp.task(taskName, function() {
            var onError = function(e) {
                new notifications().error(e, 'Browserify Compilation Failed!');
                this.emit('end');
            };

            var bundle = function(b, instance) {
                return b.bundle()
                    .on('error', onError)
                    .pipe(source(instance.src.split("/").pop()))
                    .pipe(buffer())
                    .pipe(gulpIf(!instance.options.debug, uglify()))
                    .pipe(gulpIf(typeof instance.options.rename === 'string', rename(instance.options.rename)))
                    .pipe(gulp.dest(instance.options.output))
                    .pipe(new notifications().message('Browserified!'));
            };

            config.toBrowserify.forEach(function(instance) {
                var b = browserify(instance.src, instance.options);

                if (config.useWatchify) {
                    b = watchify(b);

                    b.on('update', function() {
                        bundle(b, instance);
                    });
                }

                stream = bundle(b, instance);
            });

            return stream;
        });
    };

    /**
     * Create elixir extension
     */
    elixir.extend(taskName, function (src, options) {
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

        this.registerWatcher(taskName, options.srcDir + '/**/*.js', config.useWatchify ? 'nowatch' : 'default');

        return this.queueTask(taskName);
    });

    /**
     * Watching changes with watchify
     */
    gulp.task('watchify', function() {
        config.useWatchify = true;

        srcPaths = config.watchers.default;
        tasksToRun = _.intersection(config.tasks, _.keys(srcPaths).concat('copy'));

        inSequence.apply(this, tasksToRun.concat('watch-assets'));
    });
};

module.exports = {
    init: initializePlugin
};

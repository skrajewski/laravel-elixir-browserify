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
        }
        hasBundler = false;

    options = _.extend(defaultOptions, options);
    src = "./" + utilities.buildGulpSrc(src, options.srcDir);

    var onError = function(e) {
        new notifications().error(e, 'Browserify Compilation Failed!');
        this.emit('end');
    };
        
    gulp.task('browserify', function(){
        
        if(!hasBundler){
            var bundler = gulp.tasks.watch.done === true ? watchify(browserify(src, options)) : browserify(src, options);

            bundler.on('update', function(){
                bundle(bundler);
            });    
        }
        
        return bundle(bundler);
    });

    function bundle(b) {
        return b.bundle().on('error', onError)
            .pipe(source(src.split("/").pop()))
            .pipe(buffer())
            .pipe(gulpIf(config.production, uglify()))
            .pipe(gulpIf(typeof options.rename === 'string', rename(options.rename)))
            .pipe(gulp.dest(options.output))
            .pipe(new notifications().message('Browserified!'));
    }

    this.registerWatcher('browserify', options.srcDir + '/**/*.js');

    return this.queueTask('browserify');
});
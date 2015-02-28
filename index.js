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
    _  = require('underscore');

elixir.extend('browserify', function (src, options, srcDir) {
    var config = this;
    srcDir = srcDir || config.assetsDir + 'js';

    var browserifyTask = function(callback) {
        var defaultOptions = {
                debug:         ! config.production,
                rename:        null,
                srcDir:        srcDir,
                output:        config.jsOutput,
                transform:     [],
                insertGlobals: false,
            };

      
        var bundleQueue;
           

        var onError = function(e) {
                new notifications().error(e, 'Browserify Compilation Failed!');
                this.emit('end');
            };

        var browserifyThis = function(src, bundleConfig) {
            var b = browserify(src, bundleConfig);
           
            
            var bundle = function() {

              return b
                .bundle()
                // Report compile errors
                .on('error', onError)
                // Use vinyl-source-stream to make the
                // stream gulp compatible. Specify the
                // desired output filename here.
                .pipe(source(src))
                .pipe(buffer())
                .pipe(gulpIf(! bundleConfig.debug, uglify()))
                .pipe(gulpIf(typeof bundleConfig.rename === 'string', rename(bundleConfig.rename)))
                .pipe(gulp.dest(bundleConfig.output))
                .on('end', onFinish)
                .pipe(new notifications().message('Browserified!'));
              
            };


            // Sort out shared dependencies.
            // b.require exposes modules externally
            if(bundleConfig.require) b.require(bundleConfig.require);
            // b.external excludes modules from the bundle, and expects
            // they'll be available externally
            if(bundleConfig.external) b.external(bundleConfig.external);

            var onFinish = function() {
                if(bundleQueue) {
                  bundleQueue--;
                  if(bundleQueue === 0) {
                    // If queue is empty, tell gulp the task is complete.
                    // https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
                    callback();
                  }
                }
            };

            return bundle();
        };
        
        if(Array.isArray(src)) {
            bundleQueue = src.length;
            _.each(src, function(conf) {

                var options = _.extend(defaultOptions, _.omit(conf, 'src'));

                var src = "./" + utilities.buildGulpSrc(conf.src, options.srcDir);
                browserifyThis(src, options);
            });
        } else {
            
            options = _.extend(defaultOptions, options);
            src = "./" + utilities.buildGulpSrc(src, options.srcDir);
            browserifyThis(src, options);
        }
    };

    gulp.task('browserify', browserifyTask);
   

    this.registerWatcher('browserify', srcDir + '/**/*.js');

    return this.queueTask('browserify');
});

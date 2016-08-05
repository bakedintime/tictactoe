var gulp        = require('gulp');
var gutil       = require('gulp-util');
var bower       = require('bower');
var concat      = require('gulp-concat');
var args        = require('yargs').argv;
var sh          = require('shelljs');
var groupConcat = require('gulp-group-concat');
var ngAnnotate  = require('gulp-ng-annotate');
var uglify      = require('gulp-uglify');
var debug       = require('gulp-debug');
var runSequence = require('run-sequence');
var gulpif      = require('gulp-if');
var jshint      = require('gulp-jshint');

gulp.task(
  'default',
  function(){
    runSequence(
      'process-js',
      function(){console.log('ok');}
    );
  }
);

gulp.task(
  'prepare-build',
  function(){
    runSequence(
      'process-js',
      function(){console.log('ok');}
    );
  }
);

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('process-js', function () {
  var mode = args.mode || 'debug';

  /** Concat and uglify **/
  gulp.src([
    'src/game.js'
  ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(debug({title: 'Concatenating and uglifying js files:'}))
    .pipe(groupConcat({
      'all.js': [
        'src/game.js'
      ]
    }))
    .pipe(ngAnnotate())
    .pipe(gulpif(mode==='prod', uglify()))
    .pipe(gulp.dest('build'));
});

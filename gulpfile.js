'use strict';

var gulp = require('gulp'),
    stripDebug = require('gulp-strip-debug'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    gJasmine = require('gulp-jasmine'),
    runSequence = require('run-sequence'),
    jshintOptions = {
      bitwise: true,
      camelcase: true,
      eqeqeq: true,
      immed: true,
      latedef: 'nofunc',
      newcap: true,
      noarg: true,
      nonbsp: true,
      quotmark: 'single',
      undef: true,
      strict: true,
      loopfunc: true,
      node: true,
      globals: {
         _: false,
         _V_: false,
         afterEach: false,
         beforeEach: false,
         confirm: false,
         context: false,
         describe: false,
         expect: false,
         it: false,
         jasmine: false,
         JSHINT: false,
         mostRecentAjaxRequest: false,
         qq: false,
         runs: false,
         spyOn: false,
         spyOnEvent: false,
         xdescribe: false
      }
    };

gulp.task('lint', function() {
  return gulp
    .src(['src/**/*.js', 'spec/**/*.js', 'gulpfile.js'])
    .pipe(jshint(jshintOptions))
    .pipe(jshint.reporter(stylish));
});

gulp.task('test', function() {
  return gulp
    .src(['./spec/**/*-spec.js'])
    .pipe(gJasmine({
      includeStackTrace: true,
      verbose: true
    }));
});

gulp.task('processJS', function() {
  return gulp
    .src('./src/index.js')
    .pipe(stripDebug())
    .pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
  gulp.watch(['./src/**/*.js', './spec/**/*-spec.js', './gulpfile.js'], function(cb) {
    runSequence('lint', 'test', 'processJS');
  });
});

gulp.task('default', function(cb) {
  runSequence('lint', 'test', 'processJS', 'watch');
});

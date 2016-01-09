'use strict';

const util = require('util');
const path = require('path');
const exec = require('child_process').exec;

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const exit = require('gulp-exit');

const dbConfigPath = path.join(__dirname, 'config', 'database.js');
const dbPath = path.join(__dirname, 'db');

var istanbulSettings = {
  dir: 'coverage',
  reporters: ['lcovonly', 'html', 'text', 'text-summary'],
  reportOpts: {
    html: { dir: 'coverage/html' },
    lcovonly: { dir: 'coverage/lcov' }
  }
};

function runKnexCommand(command, done) {
  var command = util.format(
    'knex %s --cwd %s --knexfile %s', command, dbPath, dbConfigPath
  );

  exec(command, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);

    done(err);
  });
}

gulp.task('db:migrate', function (done) {
  runKnexCommand('migrate:latest', done);
});

gulp.task('db:rollback', function (done) {
  runKnexCommand('migrate:rollback', done);
});

gulp.task('lint', function () {
  return gulp.src(['**/*.js','!node_modules/**'])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
  .pipe(exit());
});

gulp.task('pre-test', function () {
  return gulp.src(['lib/**/*.js', 'models/**/*.js', 'routes/**/*.js'])
  .pipe(istanbul())
  .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
  return gulp.src('./test/**/*_test.js')
  .pipe(mocha())
  .pipe(istanbul.writeReports(istanbulSettings))
  .pipe(exit());
});


const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');

var istanbulSettings = {
  dir: 'coverage',
  reporters: ['html', 'text', 'text-summary'],
  reportOpts: {
    html: { dir: 'coverage/html' }
  }
};

gulp.task('lint', function () {
  return gulp.src(['**/*.js','!node_modules/**'])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

gulp.task('pre-test', function () {
  return gulp.src(['lib/**/*.js'])
  .pipe(istanbul())
  .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
  return gulp.src('./test/**/*.js')
  .pipe(mocha())
  .pipe(istanbul.writeReports(istanbulSettings));
});


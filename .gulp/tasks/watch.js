const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

gulp.task('watch', ['babel'], () => {
  plugins.watch('./src/**/*.js', (files, cb) => { // eslint-disable-line no-unused-vars
    gulp.start(['babel']);
  });
});

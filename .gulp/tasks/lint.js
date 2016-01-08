const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

gulp.task('lint', () => {
  return gulp.src(['src/**/*.js', '!node_modules/**'])
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});

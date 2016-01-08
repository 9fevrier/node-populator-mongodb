const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

gulp.task('babel', () => {
  try {
    return gulp.src(['src/**/*.js'], {read: false})
      .pipe(plugins.rollup({external: []}))
      .on('error', plugins.util.log)
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.babel({
        presets: ['es2015'],
      }))
      .pipe(plugins.concat('index.js'))
      .pipe(plugins.replace('exports.default = ', 'module.exports = '))
      .pipe(plugins.replace('export ', 'module.exports.'))
      .pipe(plugins.sourcemaps.write('.'))
      .pipe(gulp.dest('dist/'));
  } catch (err) {
    console.log('Compilation failed!'); // eslint-disable-line no-console
  }
});

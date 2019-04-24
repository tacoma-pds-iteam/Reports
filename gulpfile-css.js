module.exports = function (gulp, plugins) {
    return function () {
  gulp.src('node-apps/node_modules/dev-reports/scss/**/*.scss')
    .pipe(plugins.compass({
      sass: 'node-apps/node_modules/dev-reports/scss',
      css: 'node-apps/node_modules/dev-reports/css'
    }))
    .pipe(plugins.autoprefixer({
      browsers: ['last 5 versions', 'ie >= 11', '> 5%'],
      cascade: false,
      grid: true
    }))
    .pipe(plugins.plumber())
    .pipe(plugins.cleanCSS())
    .pipe(gulp.dest('node-apps/node_modules/dev-reports/client/'));
  }
}
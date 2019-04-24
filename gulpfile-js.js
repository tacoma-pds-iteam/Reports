module.exports = function (gulp, plugins) {
    return function () {
  gulp.src('node-apps/node_modules/dev-reports/js/dev/*.js')
    .pipe(plugins.concat('../app.js'))
    .pipe(plugins.babel({
      presets: ['es2015', 'es2017', 'react']
    }))
    .pipe(plugins.uglify().on('error', err => {
      util.log(util.colors.red('[Error]'), err.toString());
    }))
    .pipe(plugins.plumber())
    .pipe(gulp.dest('node-apps/node_modules/dev-reports/client/js/'));
  }
}
var gulp = require('gulp');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var loopbackAngular = require('gulp-loopback-sdk-angular');
var sh = require('shelljs');
var browserify = require('browserify');
var fs = require('fs');

var paths = {
  lbmodel: ['common/models/*.js', 'common/*.js', 'models/*.json', 'global-config.js']
};

gulp.task('default', ['lb-services']);

gulp.task('vendor', function(callback) {
  return browserify()
    .require(require.resolve('./common/utils/phoneUtils.js'), { expose: 'phoneUtils' })
    .bundle(function(err, libs) {
      fs.writeFile('./client/js/bundle/bundle.js', libs);
    });
});

gulp.task('lb-services', function () {
  return gulp.src('server/server.js')
    .pipe(loopbackAngular({ apiUrl: 'http://127.0.0.1:3000/api' }))
    .pipe(rename('lb-services.js'))
    .pipe(gulp.dest('client/js/services'));
});



var
  gulp = require('gulp'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass'),
  webpack = require('webpack-stream');

gulp.task('sass', function () {
  gulp.src('./sass/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./www/css'))
});

gulp.task('js', function () {
  return gulp.src('src/entry.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('www/'))
    .pipe(reload({stream: true}));
});


gulp.task('compile_vendor', function () {
  gulp.src([
    './www/node_modules/hammerjs/hammer.js',
    './www/node_modules/jquery/dist/jquery.min.js',
    './www/node_modules/materialize-css/dist/js/materialize.min.js'
  ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./www/js/'));
});

gulp.task('build-server', function () {
  browserSync({
    server: {
      baseDir: 'build/'
    }
  });
});

gulp.task('serve', function () {
  gulp.watch('./sass/**/*.sass', ['sass']);
  gulp.watch('./js/**/*.js', ['js']);
});

gulp.task('default', ['sass', 'js']);
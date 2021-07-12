// Gulp Variables
let gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  del = require('del'),
  autoprefixer = require('gulp-autoprefixer'),
  ghPages = require('gulp-gh-pages');

// Clean Del
gulp.task('clean', async function () {
  del.sync('dist');
});

// SCSS
gulp.task('scss', function () {
  return gulp
    .src('app/scss/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 8 versions'],
      })
    )
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({ stream: true }));
});

// CSS Libraries Concatenation
gulp.task('css', function () {
  return gulp
    .src([
      'node_modules/normalize.css/normalize.css',
      'node_modules/slick-carousel/slick/slick.css',
      'node_modules/animate.css/animate.css',
    ])
    .pipe(concat('_libs.scss'))
    .pipe(gulp.dest('app/scss'))
    .pipe(browserSync.reload({ stream: true }));
});

// HTML
gulp.task('html', function () {
  return gulp.src('app/*.html').pipe(browserSync.reload({ stream: true }));
});

// JS
gulp.task('script', function () {
  return gulp.src('app/js/*.js').pipe(browserSync.reload({ stream: true }));
});

// JS Libraries Concatenation
gulp.task('js', function () {
  return gulp
    .src([
      'node_modules/slick-carousel/slick/slick.js',
      'node_modules/wow.js/dist/wow.js',
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({ stream: true }));
});

// Browser Sync
gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: 'app/',
    },
  });
});

// Gulp Export
gulp.task('export', async function () {
  let buildHtml = gulp.src('app/**/*.html').pipe(gulp.dest('dist'));

  let buildCss = gulp.src('app/css/**/*.css').pipe(gulp.dest('dist/css'));

  let buildJs = gulp.src('app/js/**/*.js').pipe(gulp.dest('dist/js'));

  let buildFonts = gulp.src('app/fonts/**/*.*').pipe(gulp.dest('dist/fonts'));

  let buildImg = gulp.src('app/img/**/*.*').pipe(gulp.dest('dist/img'));
});

// GIT Deploy
gulp.task('deploy', function () {
  return gulp.src('./app/**/*').pipe(ghPages());
});

// Gulp Watch
gulp.task('watch', function () {
  gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'));
  gulp.watch('app/*.html', gulp.parallel('html'));
  gulp.watch('app/js/*.js', gulp.parallel('script'));
});

// Gulp Build
gulp.task('build', gulp.series('export', 'clean'));

// Gulp Default
gulp.task(
  'default',
  gulp.parallel('css', 'scss', 'js', 'browser-sync', 'watch')
);

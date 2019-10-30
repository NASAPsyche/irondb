const gulp = require('gulp');
const sass = require('gulp-sass');
const jest = require('gulp-jest').default;

// Task compiles sass to css and moves module files to the public directories.
gulp.task('sass', function() {
  return gulp.src(['bin/scss/custom.scss'])
      .pipe(sass())
      .pipe(gulp.dest('public/stylesheets'));
});

// Move JS files to public javascripts directory.
gulp.task('js', function() {
  return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/tether/dist/js/tether.min.js',
    'node_modules/popper.js/dist/popper.min.js',
    'node_modules/pdfobject/pdfobject.min.js',
    'node_modules/ejs/ejs.min.js'])
      .pipe(gulp.dest('public/javascripts'));
});

// Run test suite
gulp.task('jest', function() {
  // Test ran outside docker, require env to be set to avoid error.
  process.env.DATABASE_URL = 'postgres://group16:abc123@localhost:5433/postgres';
  return gulp.src('__tests__').pipe(jest({
    'preprocessorIgnorePatterns': [
      'public/javascripts/bootstrap.min.js',
      'public/javascripts/jquery.min.js',
      'public/javascripts/tether.min.js',
      'node_modules/',
    ],
    'collectCoverage': true,
    'coveragePathIgnorePatterns': [
      'public/javascripts/bootstrap.min.js',
      'public/javascripts/jquery.min.js',
      'public/javascripts/tether.min.js',
      'node_modules/',
    ],
    'automock': false,
  }));
});

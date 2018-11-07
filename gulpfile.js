var gulp = require('gulp');
var sass = require('gulp-sass');

// Task compiles sass to css and moves module files to the public directories.
gulp.task('sass', function() {
	return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss'])
		.pipe(sass())
		.pipe(gulp.dest("public/stylesheets"));
});

// Move JS files to public javascripts directory.
gulp.task('js', function() {
	return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/tether/dist/js/tether.min.js'])
		.pipe(gulp.dest("public/javascripts"));
});

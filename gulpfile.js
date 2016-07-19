var del = require('del');
var gulp = require('gulp');
var gulpIf = require('gulp-if');
var useref = require('gulp-useref');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');

gulp.task('useref', function() {
    return gulp.src('app/index.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

gulp.task('clean:dist', function(){
    return del.sync('dist');
});

gulp.task('build', function(callback){
    runSequence('clean:dist', ['useref'], callback);
});

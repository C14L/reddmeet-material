var babel  = require('gulp-babel');
var cssnano = require('gulp-cssnano');
var del = require('del');
var filter = require('gulp-filter');
var gulp = require('gulp');
var gulpIf = require('gulp-if');
var htmlmin = require('gulp-htmlmin');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var runSequence = require('run-sequence');
var templateCache = require('gulp-angular-templatecache');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');

gulp.task("index", function() {
    var jsFilter = filter("**/*.js", { restore: true });
    var cssFilter = filter("**/*.css", { restore: true });
    var indexHtmlFilter = filter(['**/*', '!**/index.html'], { restore: true });

    return gulp.src("app/index.html")
        .pipe(useref())
        .pipe(jsFilter)
        .pipe(babel({presets: ['es2015']}))
        .pipe(uglify().on('error', e => console.log(e)))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(cssnano())
        .pipe(cssFilter.restore)
        .pipe(indexHtmlFilter)
        .pipe(rev())
        .pipe(indexHtmlFilter.restore)
        .pipe(revReplace())
        .pipe(gulp.dest('dist'));
});

gulp.task('tplcache', function () {
    return gulp.src('app/views/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true})) // Minify HTML before escaping.
        .pipe(templateCache()) // Escape into JS strings.
        .pipe(gulp.dest('dist')); // Write to dist/templates.js
});

gulp.task('views', () => gulp.src('app/views/**/*').pipe(gulp.dest('dist/views')));

gulp.task('swjs', () => gulp.src('app/sw.js').pipe(gulp.dest('dist')));

gulp.task('clean:dist', () => del.sync('dist'));

gulp.task('build', callback => runSequence('clean:dist', ['index', 'views', 'swjs'], callback));

gulp.task('build2', callback => runSequence('clean:dist', ['index', 'tplcache', 'swjs'], callback));

gulp.task('watch', () => {
    gulp.watch(['app/sw.js', 'app/views/**/*.html', 'app/assets/**/*.css', 'app/src/**/*.js', 'app/index.html'], 
               ['build']);
});

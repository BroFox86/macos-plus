var gulp = require('gulp'),
    plumberNotifier = require('gulp-plumber-notifier'),
    csscomb = require('gulp-csscomb'),
    removeCode = require('gulp-remove-code');

////////////////////////////////////////////////////////
//
// Default task
//
////////////////////////////////////////////////////////
gulp.task('default', ['watch','less','pug']);

////////////////////////////////////////////////////////
//
// Build with Gulp Sequence
//
////////////////////////////////////////////////////////
var gulpSequence = require('gulp-sequence');
 
gulp.task('build', gulpSequence(['clean'], ['copy'], 
    ['html:production', 'css:production'], 'images:minify'))

////////////////////////////////////////////////////////
//
// Copy to output directory
//
////////////////////////////////////////////////////////
gulp.task('copy', function () {
    gulp.src(['./src/*.md'])
        .pipe(gulp.dest('./dist/'))
    gulp.src(['src/*fonts/**/*','src/*icons/**/*'])
        .pipe(gulp.dest('./dist/'))
    gulp.src(['src/*less/**/*','src/*pug/**/*'])
        .pipe(gulp.dest('./dist/__sources/src/'))
    gulp.src(['./gulpfile.js','./package.json'])
        .pipe(gulp.dest('./dist/__sources'))
});

////////////////////////////////////////////////////////
//
// Clean output directory
//
////////////////////////////////////////////////////////
var clean = require('gulp-clean');
 
gulp.task('clean', function () {
    return gulp.src('./dist/*', {read: false})
        .pipe(clean())
});

////////////////////////////////////////////////////////
//
// Gulp Watch function
//
////////////////////////////////////////////////////////    
var browserSync = require('browser-sync');

gulp.task('watch', function() {

    browserSync.init({
        server:"./src/",
        notify: false,
        open: false
    });

    gulp.watch("./src/less/*.less", ['less']);
    gulp.watch(["./src/pug/*.pug"], ['pug']);
    gulp.watch("./src/*.html").on('change', browserSync.reload);
}); 

////////////////////////////////////////////////////////
//
// Less to CSS
//
////////////////////////////////////////////////////////
var path = require('path'),
    less = require('gulp-less'), 
    LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    autoprefixPlugin = new LessPluginAutoPrefix({browsers: ["last 2 versions"]}),
    LessPluginGroupMediaQueries = require('less-plugin-group-css-media-queries');

gulp.task('less', function() {
  return gulp.src(['./src/less/styles.less'])
    .pipe(plumberNotifier())
    .pipe(less({ plugins: [autoprefixPlugin, LessPluginGroupMediaQueries]  },{ paths: [ path.join(__dirname, 'less', 'includes')]}))
    .pipe(csscomb())
    .pipe(gulp.dest('./src/css/'))
    .pipe(browserSync.stream());
});

////////////////////////////////////////////////////////
//
// 1) Remove dev code from CSS
// 2) Minify
// 3) Rename
//
////////////////////////////////////////////////////////
var cleanCSS = require('gulp-clean-css'), 
    rename = require("gulp-rename");
 
gulp.task('css:production', function() {
  return gulp.src('./src/css/*.css')
    .pipe(removeCode({ production: true }))
    .pipe(cleanCSS())
    .pipe(rename(function (path) {
    path.basename += ".min";
    path.extname = ".css"
    }))
    .pipe(gulp.dest('./dist/css/'));
});

////////////////////////////////////////////////////////
//
// Prettify CSS/LESS code
//
////////////////////////////////////////////////////////
gulp.task('css:comb', function() {
  return gulp.src(['./src/less/*.less'])
    .pipe(plumberNotifier())
    .pipe(csscomb('my-csscomb-settings.json'))
    .pipe(gulp.dest('./src/less/'))
});

////////////////////////////////////////////////////////
//
// Pug template engine files to HTML
//
////////////////////////////////////////////////////////
var pug = require('gulp-pug');
 
gulp.task('pug', function buildHTML() {
  return gulp.src(['src/pug/*.pug', '!src/pug/b_*.pug','!src/pug/__*.pug'])
  .pipe(plumberNotifier())
  .pipe(pug({
    pretty: true 
  }))
  .pipe(gulp.dest('./src/'))
  .pipe(browserSync.stream());
});

////////////////////////////////////////////////////////
//
// 1) Remove code 
// 2) Minify HTML
//
////////////////////////////////////////////////////////
var htmlmin = require('gulp-htmlmin');
 
gulp.task('html:production', function() {
  return gulp.src('src/*.html')
    .pipe(removeCode({ production: true }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/'));
});

////////////////////////////////////////////////////////
//
// HTML W3C Validator
//
////////////////////////////////////////////////////////
var w3cjs = require('gulp-w3cjs');
 
gulp.task('html:validator', function () {
    gulp.src(['src/*.html','!src/temp.html'])
        .pipe(w3cjs())
        .pipe(w3cjs.reporter());
});

////////////////////////////////////////////////////////
//
// HTML Hinter
//
////////////////////////////////////////////////////////
var htmlhint = require("gulp-htmlhint");

gulp.task('html:hinter', function() {
  gulp.src("./src/*.html")
      .pipe(htmlhint())
      .pipe(htmlhint.reporter())
});

////////////////////////////////////////////////////////
//
// Minify images
//
////////////////////////////////////////////////////////
var imagemin = require('gulp-imagemin'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress');

gulp.task("images:minify", function() {
    return gulp.src("./src/images/**/*.*")
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imageminJpegRecompress({
                progressive: true,
                quality: 'veryhigh'
            }),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({plugins: [{removeViewBox: false}]})],
            { verbose: true}))
        .pipe(gulp.dest("./dist/images/"));
});        



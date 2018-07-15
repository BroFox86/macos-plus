"use strict";

/* ==========================================================================
  Variables
  ========================================================================== */

var // Common
  gulp         = require("gulp"),
  gulpSequence = require("gulp-sequence"),
  plumber      = require("gulp-plumber"),
  notify       = require("gulp-notify"),
  del          = require("del"),
  rename       = require("gulp-rename"),
  replace      = require("gulp-replace"),
  run          = require("gulp-run"),
  fs           = require("fs"),
  concat       = require("gulp-concat"),
  flatten      = require("gulp-flatten"),
  changed      = require("gulp-changed"),
  inject       = require("gulp-inject"),
  injectString = require("gulp-inject-string"),
  watch        = require("gulp-watch"),
  browserSync  = require("browser-sync"),
  // HTML
  pug            = require("gulp-pug"),
  pugIncludeGlob = require("pug-include-glob"),
  useref         = require("gulp-useref"),
  htmlbeautify   = require("gulp-html-beautify"),
  htmlmin        = require("gulp-htmlmin"),
  svgstore       = require("gulp-svgstore"),
  cheerio        = require("gulp-cheerio"),
  w3cjs          = require("gulp-w3cjs"),
  // Styles
  sass         = require("gulp-sass"),
  postcss      = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  cssnano      = require("cssnano"),
  mqpacker     = require("css-mqpacker"),
  sortCSSmq    = require("sort-css-media-queries"),
  pxtorem      = require("postcss-pxtorem"),
  uncss        = require("uncss").postcssPlugin,
  penthouse    = require("penthouse"),
  // Scripts
  uglify = require("gulp-uglify"),
  lec    = require('gulp-line-ending-corrector'),
  // Images
  responsive             = require("gulp-responsive"),
  imagemin               = require("gulp-imagemin"),
  imageminPngquant       = require("imagemin-pngquant"),
  imageminSvgo           = require("imagemin-svgo"),
  unusedImages           = require("gulp-unused-images");

/* ==========================================================================
   Paths and parameters
   ========================================================================== */

var paths = {
  plugins: {
    js: [
      "node_modules/moment/min/moment.min.js",
      "node_modules/moment/locale/ru.js",
      "node_modules/stickyfilljs/dist/stickyfill.js"
    ],
    css: [
      "node_modules/normalize.css/normalize.css"
    ]
  }
};

var criticalOptns = {
  url: "file:///Users/daurgamisonia/GitHub/macos-plus/.tmp/index.html",
  forceInclude: [".main-nav__inner", ".article__img", ".note__icon", ".error__img", ".vote"],
  propertiesToRemove: ["backdrop-filter"]
};

/* ==========================================================================
   Clean
   ========================================================================== */

gulp.task("clean:tmp", function() {
  console.log("----- Cleaning .tmp folder -----");
  del.sync(".tmp/**");
});

gulp.task("clean:dist", function() {
  console.log("----- Cleaning dist folder -----");
  del.sync("dist/**");
});

gulp.task("clean", function(cb) {
  gulpSequence(["clean:tmp", "clean:dist"])(cb);
});

/* ==========================================================================
   HTML
   ========================================================================== */

gulp.task("html:prebuild", ["images:sprites:svg"], function() {
  return gulp
    .src("src/*.pug")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(pug({
      basedir: __dirname + "/src",
      plugins: [pugIncludeGlob()]
    }))
    .pipe(inject(gulp.src(".tmp/sprite.svg"), {
      transform: function (filePath, file) {
        return file.contents.toString("utf8")
      }
    }))
    .pipe(htmlbeautify({ indent_size: 2 }))
    .pipe(rename(function (path) {
      if (path.basename == "ustanovka-macos-na-pc") {
        path.basename = "index";
      }
      return path;
    }))
    .pipe(gulp.dest(".tmp/"));
});

gulp.task("html:build", function() {
  return (
    gulp
      .src(".tmp/*.html")
      .pipe(
        plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
      )
      .pipe(
        inject(
          gulp
          .src(".tmp/css/_critical.css")
          .pipe(replace("../", ""))
          .pipe(postcss([cssnano()]))
          .pipe(injectString.prepend("<style>"))
          .pipe(injectString.append("</style>")), {
            starttag: "<!-- inject:critical:{{ext}} -->",
            transform: function(filePath, file) {
              return file.contents.toString("utf8")
            }
          }
        )
      )
      .pipe(
        inject(
          gulp
          .src(
            "node_modules/fg-loadcss/src/cssrelpreload.js"
          )
          .pipe(concat("fg-loadcss.html"))
          .pipe(injectString.prepend("<script>"))
          .pipe(injectString.append("</script>")), {
            starttag: "<!-- inject:fg-loadcss:{{ext}} -->",
            transform: function(filePath, file) {
              return file.contents.toString("utf8")
            }
          }
        )
      )
      .pipe(
        replace(
          /^.*inject-string:noscript.*$/m,
          '<noscript><link rel="stylesheet" href="css/styles.min.css"></noscript>'
        )
      )
      .pipe(useref())
      .pipe(gulp.dest("dist/"))
  );
});

// htmlmin won't work together with useref at this time!
gulp.task("html:minify", function() {
  return gulp
    .src("dist/*.html")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        minifyJS: true
      })
    )
    .pipe(gulp.dest("dist/"));
});

gulp.task("html:validate", function() {
  return gulp
    .src("dist/[^google]*.html")
    .pipe(w3cjs())
    .pipe(w3cjs.reporter());
});

/* ==========================================================================
   Styles
   ========================================================================== */

gulp.task("styles:main", function() {
  return gulp
    .src([
      "src/scss/**/!(global)*.scss",
      "src/scss/**/global.scss",
      "src/blocks/**/*.scss"
    ])
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(flatten())
    .pipe(concat("main.scss"))
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(
      postcss([
        pxtorem({
          propList: ["*", "!box-shadow"]
        }),
        autoprefixer(),
        mqpacker({
          sort: sortCSSmq.desktopFirst
        })
      ])
    )
    .pipe(gulp.dest(".tmp/css/"));
});

gulp.task("styles:plugins", function () {
  return gulp
    .src(paths.plugins.css)
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(
      postcss([
        pxtorem({
          propList: ["*", "!box-shadow"]
        }),
        // autoprefixer(),
        // mqpacker()
      ])
    )
    .pipe(gulp.dest(".tmp/css/"));
});

gulp.task("styles", function(cb) {
  gulpSequence([
    "styles:plugins",
    "styles:main"
  ])(cb);
});

gulp.task("styles:critical", function(cb) {
  penthouse(
    {
      url: criticalOptns.url,
      css: ".tmp/css/main.css",
      forceInclude: criticalOptns.forceInclude,
      propertiesToRemove: criticalOptns.propertiesToRemove
    },
    function(err, criticalCss) {
      fs.writeFileSync(".tmp/css/_critical.css", criticalCss);
    },
    setTimeout(function() {
      cb();
    }, 2000)
  );
});

gulp.task("styles:build", function() {
  return gulp
    .src("dist/css/*")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(
      postcss([
        uncss({
          html: ["dist/[^google]*.html"],
          ignore: [/.*[is,has]-.*/, /.*[tooltip].*/],
          ignoreSheets: [/fonts.googleapis/]
        })
      ])
    )
    .pipe(postcss([cssnano()]))
    .pipe(gulp.dest("dist/css/"));
});

/* ==========================================================================
   Scripts
   ========================================================================== */

gulp.task("scripts:plugins", function() {
  return gulp
    .src(paths.plugins.js)
    .pipe(changed("src/js/"))
    .pipe(lec({ 
      verbose: true, 
      eolc: "LF", 
      encoding: "utf8" 
    }))
    .pipe(gulp.dest("src/js/"));
});

gulp.task("scripts:common", function() {
  return gulp
    .src("src/js/**")
    .pipe(changed(".tmp/js/"))
    .pipe(gulp.dest(".tmp/js/"));
});

gulp.task("scripts:blocks", function() {
  return gulp
    .src("src/blocks/**/*.js")
    .pipe(concat("main.js"))
    .pipe(gulp.dest(".tmp/js/"));
});

gulp.task("scripts:prebuild", function(cb) {
  gulpSequence(
    ["scripts:plugins"],
    ["scripts:common", "scripts:blocks"]
  )(cb);
});

gulp.task("scripts:build", function() {
  return gulp
    .src("dist/js/*")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(uglify())
    .pipe(gulp.dest("dist/js/"));
});

/* ==========================================================================
   Images
   ========================================================================== */

var respOptions = {
    errorOnUnusedImage: false,
    errorOnUnusedConfig: false,
    errorOnEnlargement: false,
    silent: true,
    quality: 80
  },
  large = "@1.5x",
  huge = "@2x";

// Generate responsive images
gulp.task("images:responsive", function() {
  return gulp
    .src("src/images/*.*")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(flatten())
    .pipe(
      responsive(
        {
          "**/logo.*": [ 
            { width: 240 },
            {
              width: 240 * 1.5,
              rename: { suffix: large }
            },
            {
              width: 240 * 2,
              rename: { suffix: huge }
            }
          ],
          "**/logo-mobile.*": [
            { width: 126 },
            {
              width: 126 * 1.5,
              rename: { suffix: large }
            },
            {
              width: 126 * 2,
              rename: { suffix: huge }
            }
          ],
          "**/community.*": [
            { width: 240 },
            {
              width: 240 * 1.5,
              rename: { suffix: large }
            },
            {
              width: 240 * 2,
              rename: { suffix: huge }
            }
          ],
          "**/fox.*": [
            { width: 326 },
            {
              width: 326 * 1.5,
              rename: { suffix: large }
            },
            {
              width: 326 * 2,
              rename: { suffix: huge }
            }
          ]
        },
        respOptions
      )
    )
    .pipe(gulp.dest(".tmp/images/"));
});

// Generate content images
gulp.task("images:content", function() {
  return gulp
    .src("src/images/*content/**")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(
      responsive(
        {
          "**/!(icon|*_small|thumbnail)*": [
            {  width: 682 },
            {
              rename: { suffix: "_original" }
            }
          ],
          "**/icon*": [
            {  width: 160 }
          ],
          "**/*_small*": [{}],
          "**/thumbnail*": [{}]
        },
        respOptions
      )
    )
    .pipe(gulp.dest(".tmp/images/"));
});

gulp.task("images:prebuild", function(cb) {
  gulpSequence([
    "images:responsive",
    "images:content"
  ])(cb);
});

// Copy responsive images to dist folder
gulp.task("images:build", function() {
  return gulp
    .src(".tmp/images/*.*")
    .pipe(changed("dist/images/"))
    .pipe(gulp.dest("dist/images/"));
});

// Compress PNG images 
gulp.task("images:png:build", function() {
  return gulp
    .src(".tmp/images/*content/**")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(changed("dist/images/"))
    .pipe(
      imagemin([
        imageminPngquant({
          quality: 90
        })
      ])
    )
    .pipe(gulp.dest("dist/images/"));
});

/* SVG sprites
   ========================================================================== */

gulp.task("images:sprites:svg", function() {
  return gulp
    .src("src/images/icons/**/*.svg")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(
      imagemin([
        imageminSvgo({
          plugins: [{ removeViewBox: false }]
        })
      ])
    )
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(
      cheerio({
        run: function($, file) {
          $("svg").attr("style", "display: none");
          //$("path").removeAttr("fill");
        },
        parserOptions: { xmlMode: true }
      })
    )
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest(".tmp/"))
    .pipe(browserSync.stream());
});

/* Check unused images
   ========================================================================== */

gulp.task("images:unused", function() {
  return gulp
    .src([
      ".tmp/*.{html,xml}",
      ".tmp/css/*",
      ".tmp/images/**/!(*_original|*@1.5|*@2|thumbnail|logo-mobile)*"
    ])
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "Images filter error"
        })
      })
    )
    .pipe(unusedImages())
    .pipe(plumber.stop());
});

/* ==========================================================================
   Fonts
   ========================================================================== */

gulp.task("fonts:prebuild", function() {
  return gulp
    .src("src/fonts/**")
    .pipe(changed(".tmp/fonts/"))
    .pipe(gulp.dest(".tmp/fonts/"));
});

gulp.task("fonts:build", function() {
  return gulp
    .src("src/fonts/**")
    .pipe(gulp.dest("dist/fonts/"));
});
  
/* ==========================================================================
    Misc
   ========================================================================== */

gulp.task("favicons", function() {
  return gulp
    .src("src/favicons/**")
    .pipe(gulp.dest("dist/"));
});

gulp.task("metadata", function() {
  return gulp
    .src("src/metadata/*")
    .pipe(gulp.dest("dist/"));
});

/* ==========================================================================
   Watch
   ========================================================================== */

gulp.task("watch", function() {
  watch("src/images/_images-to-svg-sprite/**/*.svg",
    { readDelay: 200 },
    function() {
      gulp.start("html:prebuild");
    }
  );

  watch(
    [
      "src/blocks/*/*.pug", 
      "src/layouts/*",
      "src/*.pug"
    ],
    { readDelay: 200 },
    function() {
      gulp.start("html:prebuild");
    }
  );

  watch(
    [
      "src/blocks/**/*.scss", 
      "src/scss/**"
    ],
    { readDelay: 200 },
    function() {
      gulp.start("styles");
    }
  );

  watch(
    [
      "src/blocks/**/*.{jpg,jpeg,png}", 
      "src/images/**"
    ],
    { readDelay: 200 },
    function() {
      gulp.start("images:prebuild");
    }
  );

  watch(
    [
      "src/blocks/**/*.js", 
      "src/js/**"
    ],
    { readDelay: 200 },
    function() {
      gulp.start("scripts:prebuild");
    }
  );

  watch("src/fonts/*", { readDelay: 200 }, function() {
    gulp.start("fonts:prebuild");
  });
});

/* ==========================================================================
   Local server
   ========================================================================== */

gulp.task("connect:tmp", function() {
  browserSync.init({
    server: ".tmp/",
    notify: false,
    open: false,
    reloadDebounce: 500
  });
  browserSync.watch(".tmp/*.html").on("change", browserSync.reload);
  browserSync.watch(".tmp/css/main.css").on("change", browserSync.reload);
  browserSync.watch(".tmp/js/*").on("change", browserSync.reload);
  browserSync.watch(".tmp/fonts/*").on("change", browserSync.reload);
});

gulp.task("connect:dist", function() {
  browserSync.init({
    server: "dist/",
    notify: false,
    open: false
  });
});

/* ==========================================================================
   Build & deploy
   ========================================================================== */

gulp.task("prebuild", function(cb) {
  gulpSequence(
    ["images:prebuild", "scripts:prebuild", "fonts:prebuild"],
    ["html:prebuild", "styles"]
  )(cb);
});

gulp.task("build:fast", function(cb) {
  gulpSequence(
    ["styles:critical"],
    ["html:build"],
    ["html:minify", "styles:build", "scripts:build"],
    ["images:png:build", "images:build", "fonts:build", "metadata"],
    ["html:validate"]
  )(cb);
});

gulp.task("build", function(cb) {
  gulpSequence(
    ["clean"],
    ["prebuild"],
    ["styles:critical"],
    ["html:build"],
    ["html:minify", "styles:build", "scripts:build"],
    ["images:png:build", "images:build", "fonts:build", "favicons", "metadata"],
    ["images:unused", "html:validate"]
  )(cb);
});

/* ==========================================================================
   Main tasks
   ========================================================================== */

gulp.task("serve", function(cb) {
  gulpSequence(["prebuild"], ["connect:tmp"], ["watch"])(cb);
});

gulp.task("default", ["serve"], function() {});

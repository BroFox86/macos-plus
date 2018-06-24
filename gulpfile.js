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
  // Images
  responsive             = require("gulp-responsive"),
  imagemin               = require("gulp-imagemin"),
  responsive             = require("gulp-responsive"),
  imageminSvgo           = require("imagemin-svgo"),
  unusedImages           = require("gulp-unused-images");

/* ==========================================================================
   Paths and parameters
   ========================================================================== */

var paths = {
  src: {
    root:              "src/",
    blocks:            "src/blocks/",
    layouts:           "src/layouts/",
    scss:              "src/scss/",
    fonts:             "src/fonts/",
    js:                "src/js/",
    images:            "src/images/",
    imagesToSprite:    "src/images/icons/",
    favicons:          "src/favicons/",
    metadata:          "src/metadata/"
  },
  tmp: {
    root:      ".tmp/",
    css:       ".tmp/css/",
    js:        ".tmp/js/",
    fonts:     ".tmp/fonts/",
    images:    ".tmp/images/"
  },
  dist: {
    root:      "dist/",
    css:       "dist/css/",
    js:        "dist/js/",
    fonts:     "dist/fonts/",
    images:    "dist/images/"
  },
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
  forceInclude: [".main-nav__inner", ".article__img", ".note__icon", ".error__img"],
  propertiesToRemove: ["backdrop-filter"]
};

/* ==========================================================================
   Clean
   ========================================================================== */

gulp.task("clean:tmp", function() {
  console.log("----- Cleaning .tmp folder -----");
  del.sync(paths.tmp.root + "**");
});

gulp.task("clean:dist", function() {
  console.log("----- Cleaning dist folder -----");
  del.sync(paths.dist.root + "**");
});

gulp.task("clean", function(callback) {
  gulpSequence(["clean:tmp", "clean:dist"])(callback);
});

/* ==========================================================================
   HTML
   ========================================================================== */

gulp.task("html", ["images:sprites:svg"], function() {
  return gulp
    .src(paths.src.root + "*.pug")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(pug({
      basedir: __dirname + "/src",
      plugins: [pugIncludeGlob()]
    }))
    .pipe(inject(gulp.src(paths.tmp.root + "sprite.svg"), {
      transform: function (filePath, file) {
        return file.contents.toString("utf8")
      }
    }))
    .pipe(replace("../images/", "images/"))
    .pipe(htmlbeautify({ indent_size: 2 }))
    .pipe(rename(function (path) {
      if (path.basename == "ustanovka-macos-na-pc") {
        path.basename = "index";
      }
      return path;
    }))
    .pipe(gulp.dest(paths.tmp.root));
});

gulp.task("html:dist", function() {
  return (
    gulp
      .src(paths.tmp.root + "*.html")
      .pipe(
        plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
      )
      .pipe(
        inject(
          gulp
          .src(paths.tmp.css + "_critical.css")
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
      .pipe(gulp.dest(paths.dist.root))
  );
});

// htmlmin won't work together with useref at this time!
gulp.task("html:minify", function() {
  return gulp
    .src(paths.dist.root + "*.html")
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
    .pipe(gulp.dest(paths.dist.root));
});

gulp.task("html:validate", function() {
  return gulp
    .src(paths.dist.root + "[^google]*.html")
    .pipe(w3cjs())
    .pipe(w3cjs.reporter());
});

/* ==========================================================================
   Styles
   ========================================================================== */

gulp.task("styles:main", function() {
  return gulp
    .src([
      paths.src.scss + "**/*.scss",
      paths.src.blocks + "**/*.scss"
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
    .pipe(gulp.dest(paths.tmp.css));
});

gulp.task("styles:plugins", function () {
  return gulp
    .src(paths.plugins.css)
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(
      postcss([
        pxtorem({
          propList: ["*", "!box-shadow"]
        }),
        // autoprefixer(),
        // mqpacker()
      ])
    )
    .pipe(gulp.dest(paths.tmp.css));
});

gulp.task("styles", function(callback) {
  gulpSequence([
    "styles:plugins",
    "styles:main"
  ])(callback);
});

gulp.task("styles:critical", function(callback) {
  penthouse(
    {
      url: criticalOptns.url,
      css: paths.tmp.css + "main.css",
      forceInclude: criticalOptns.forceInclude,
      propertiesToRemove: criticalOptns.propertiesToRemove
    },
    function(err, criticalCss) {
      fs.writeFileSync(paths.tmp.css + "_critical.css", criticalCss);
    },
    setTimeout(function() {
      callback();
    }, 2000)
  );
});

gulp.task("styles:dist", function() {
  return gulp
    .src(paths.dist.css + "*")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(
      postcss([
        uncss({
          html: [paths.dist.root + "[^google]*.html"],
          ignore: [/.*[is,has]-.*/, /.*[tooltip].*/],
          ignoreSheets: [/fonts.googleapis/]
        })
      ])
    )
    .pipe(postcss([cssnano()]))
    .pipe(gulp.dest(paths.dist.css));
});

/* ==========================================================================
   Scripts
   ========================================================================== */

gulp.task("scripts:plugins", function() {
  return gulp
    .src(paths.plugins.js)
    .pipe(changed(paths.tmp.js))
    .pipe(gulp.dest(paths.tmp.js));
});

gulp.task("scripts:main", function() {
  return gulp
    .src(paths.src.js + "**")
    .pipe(changed(paths.tmp.js))
    .pipe(gulp.dest(paths.tmp.js));
});

gulp.task("scripts:blocks", function() {
  return gulp
    .src(paths.src.blocks + "**/*.js")
    .pipe(concat("main.js"))
    .pipe(gulp.dest(paths.tmp.js));
});

gulp.task("scripts", function(callback) {
  gulpSequence([
    "scripts:plugins",
    "scripts:main",
    "scripts:blocks"
  ])(callback);
});

gulp.task("scripts:minify", function() {
  return gulp
    .src(paths.dist.js + "*")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist.js));
});

/* ==========================================================================
   Images
   ========================================================================== */

var respOptions = {
    errorOnUnusedImage: false,
    errorOnUnusedConfig: false,
    errorOnEnlargement: false,
    silent: true,
    quality: 80,
    compressionLevel: 9
  },
  large = "@1.5x",
  huge = "@2x";

gulp.task("images:responsive", function() {
  return gulp
    .src(paths.src.images + "*.*")
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
    .pipe(gulp.dest(paths.tmp.images));
});

gulp.task("images:content", function() {
  return gulp
    .src(paths.src.images + "*content/**")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(
      responsive(
        {
          "**/!(icon|*_small|thumbnail)*": [
            {  width: 630 },
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
    .pipe(gulp.dest(paths.tmp.images));
});

/* SVG sprites
   ========================================================================== */

gulp.task("images:sprites:svg", function() {
  return gulp
    .src(paths.src.imagesToSprite + "**/*.svg")
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
          $("path").removeAttr("fill");
        },
        parserOptions: { xmlMode: true }
      })
    )
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest(paths.tmp.root))
    .pipe(browserSync.stream());
});

/* Images: build and test
   ========================================================================== */

gulp.task("images", function(callback) {
  gulpSequence([
    "images:responsive",
    "images:content"
  ])(callback);
});

gulp.task("images:dist", function() {
  return gulp
    .src("**", { cwd: paths.tmp.images })
    .pipe(gulp.dest(paths.dist.images));
});

gulp.task("images:unused", function() {
  return gulp
    .src([
      paths.tmp.root + "*.{html,xml}",
      paths.tmp.css + "*",
      paths.tmp.images + "**/!(*_original|*@1.5|*@2|thumbnail|logo-mobile)*"
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

gulp.task("fonts", function() {
  return gulp
    .src(paths.src.fonts + "**")
    .pipe(changed(paths.tmp.fonts))
    .pipe(gulp.dest(paths.tmp.fonts));
});

gulp.task("fonts:dist", function() {
  return gulp.src(paths.src.fonts + "**").pipe(gulp.dest(paths.dist.fonts));
});
  
/* ==========================================================================
    Misc
   ========================================================================== */

gulp.task("favicons", function() {
  return gulp
    .src([
      paths.src.favicons + "**"
    ])
    .pipe(gulp.dest(paths.dist.root));
});

gulp.task("metadata", function() {
  return gulp
    .src(paths.src.metadata + "*")
    .pipe(gulp.dest(paths.dist.root));
});

/* ==========================================================================
   Watch
   ========================================================================== */

gulp.task("watch", function() {
  watch(
    [
      paths.src.imagesToSprite + "**/*.svg"
    ],
    { readDelay: 200 },
    function() {
      gulp.start("html");
    }
  );

  watch(
    [
      paths.src.blocks + "*/*.pug", 
      paths.src.layouts + "*",
      paths.src.root + "*.pug"
    ],
    { readDelay: 200 },
    function() {
      gulp.start("html");
    }
  );

  watch(
    [
      paths.src.blocks + "**/*.scss", 
      paths.src.scss + "**"
    ],
    { readDelay: 200 },
    function() {
      gulp.start("styles");
    }
  );

  watch(
    [
      paths.src.blocks + "**/*.{jpg,jpeg,png}", 
      paths.src.images + "**"
    ],
    { readDelay: 200 },
    function() {
      gulp.start("images");
    }
  );

  watch(
    [
      paths.src.blocks + "**/*.js", 
      paths.src.js + "**"
    ],
    { readDelay: 200 },
    function() {
      gulp.start("scripts");
    }
  );

  watch(paths.src.fonts + "*", { readDelay: 200 }, function() {
    gulp.start("fonts");
  });
});

/* ==========================================================================
   Local server
   ========================================================================== */

gulp.task("connect:tmp", function() {
  browserSync.init({
    server: paths.tmp.root,
    notify: false,
    open: false,
    reloadDebounce: 500
  });
  browserSync.watch(paths.tmp.root + "*.html").on("change", browserSync.reload);
  browserSync.watch(paths.tmp.css + "main.css").on("change", browserSync.reload);
  browserSync.watch(paths.tmp.js + "*").on("change", browserSync.reload);
  browserSync.watch(paths.tmp.fonts + "*").on("change", browserSync.reload);
});

gulp.task("connect:dist", function() {
  browserSync.init({
    server: paths.dist.root,
    notify: false,
    open: false
  });
});

/* ==========================================================================
   Build & deploy
   ========================================================================== */

gulp.task("prebuild", function(callback) {
  gulpSequence(
    ["images", "scripts", "fonts"],
    ["html", "styles"]
  )(callback);
});

gulp.task("build:fast", function(callback) {
  gulpSequence(
    ["prebuild"],
    ["styles:critical"],
    ["html:dist"],
    ["html:minify", "styles:dist", "scripts:minify"],
    ["images:dist", "fonts:dist", "metadata"],
    ["html:validate"]
  )(callback);
});

gulp.task("build", function(callback) {
  gulpSequence(
    ["clean"],
    ["prebuild"],
    ["html:dist"],
    ["html:minify", "styles:dist", "scripts:minify"],
    ["images:dist", "fonts:dist", "favicons", "metadata"],
    ["images:unused", "html:validate"]
  )(callback);
});

/* ==========================================================================
   Main tasks
   ========================================================================== */

gulp.task("serve", function(callback) {
  gulpSequence(["prebuild"], ["connect:tmp"], ["watch"])(callback);
});

gulp.task("default", ["serve"], function() {});

"use strict";

/* ==========================================================================
  Vars
  ========================================================================== */

var // Common
  gulp         = require("gulp"),
  watch        = require("gulp-watch"),
  browserSync  = require("browser-sync"),
  del          = require("del"),
  fs           = require("fs"),
  concat       = require("gulp-concat"),
  rename       = require("gulp-rename"),
  replace      = require("gulp-replace"),
  changed      = require("gulp-changed"),
  plumber      = require("gulp-plumber"),
  notify       = require("gulp-notify"),
  gulpSequence = require("gulp-sequence"),
  flatten      = require("gulp-flatten"),
  run          = require("gulp-run"),
  path         = require("path"),
  inject       = require("gulp-inject"),
  injectString = require("gulp-inject-string"),
  // HTML
  pug            = require("gulp-pug"),
  pugIncludeGlob = require("pug-include-glob"),
  htmlmin        = require("gulp-htmlmin"),
  useref         = require("gulp-useref"),
  cheerio        = require("gulp-cheerio"),
  svgstore       = require("gulp-svgstore"),
  w3cjs          = require("gulp-w3cjs"),
  // Styles
  less         = require("gulp-less"),
  postcss      = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  cssnano      = require("cssnano"),
  mqpacker     = require("css-mqpacker"),
  sortCSSmq    = require("sort-css-media-queries"),
  pxtorem      = require("postcss-pxtorem"),
  uncss        = require("uncss").postcssPlugin,
  penthouse    = require("penthouse"),
  // JS
  uglify = require("gulp-uglify"),
  // Images
  imagemin               = require("gulp-imagemin"),
  imageminSvgo           = require("imagemin-svgo"),
  imageminJpegRecompress = require("imagemin-jpeg-recompress"),
  responsive             = require("gulp-responsive"),
  unusedImages           = require("gulp-unused-images");

/* ==========================================================================
  Paths and parameters
  ========================================================================== */

var paths = {
  src: {
    root:             "src/",
    blocks:           "src/blocks/",
    pug:              "src/pug/",
    css:              "src/css/",
    less:             "src/less/",
    images:           "src/images/",
    imagesToSprite:   "src/images-to-sprite/",
    favicons:         "src/favicons/",
    fonts:            "src/fonts/",
    js:               "src/js/"
  },
  tmp: {
    root:     ".tmp/",
    css:      ".tmp/css/",
    images:   ".tmp/images/",
    fonts:    ".tmp/fonts/",
    js:       ".tmp/js/"
  },
  dist: {
    root:     "dist/",
    css:      "dist/css/",
    js:       "dist/js/",
    images:   "dist/images/",
    fonts:    "dist/fonts/"
  },
  plugins: {
    js: [
      "node_modules/moment/min/moment.min.js",
      "node_modules/moment/locale/ru.js",
      "node_modules/stickyfilljs/dist/stickyfill.js"
    ]
  }
};

var criticalOptns = {
  url: "file:///Users/daurgamisonia/GitHub/macos-plus/.tmp/index.html",
  forceInclude: [".article__img", ".note__icon", ".error__img"]
};

var psiOptns = {
  url: "http://ff99d014.ngrok.io",
  key: ""
};

/* ==========================================================================
   Cleaning
   ========================================================================== */

gulp.task("clean:tmp", function() {
  console.log("----- Cleaning .tmp folder -----");
  del.sync(paths.tmp.root + "**");
});

gulp.task("clean:dist", function() {
  console.log("----- Cleaning dist folder -----");
  del.sync(paths.dist.root + "**");
});

gulp.task("clean:all", function(callback) {
  gulpSequence(["clean:tmp", "clean:dist"])(callback);
});

/* ==========================================================================
   HTML
   ========================================================================== */

function fileContents(filePath, file) {
  return file.contents.toString("utf8");
}

gulp.task("html:generate-svg", function() {
  return gulp
    .src([
      paths.src.imagesToSprite + "*.svg",
      paths.src.blocks + "*/images-to-sprite/*.svg"
    ])
    .pipe(
      imagemin([
        imageminSvgo({
          plugins: [{ removeViewBox: false }]
        })
      ])
    )
    .pipe(
      svgstore({
        inlineSvg: true
      })
    )
    .pipe(
      cheerio({
        run: function($, file) {
          $("svg").attr("style", "display: none");
          $("path").removeAttr("fill");
        },
        parserOptions: {
          xmlMode: true
        }
      })
    )
    .pipe(rename("_sprite.svg"))
    .pipe(gulp.dest(paths.tmp.images));
});

gulp.task("html:generate", function buildHTML() {
  return gulp
    .src(paths.src.pug + "[^_]*")
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "HTML compilation error"
        })
      })
    )
    .pipe(
      pug({
        pretty: true,
        basedir: __dirname + "/src",
        plugins: [pugIncludeGlob()]
      })
    )
    .pipe(
      inject(gulp.src(paths.tmp.images + "_sprite.svg"), {
        transform: fileContents
      })
    )
    .pipe(replace("../images/", "images/"))
    .pipe(gulp.dest(paths.tmp.root));
});

gulp.task("html:generate:watch", function buildHTML() {
  return watch(paths.src.pug + "[^_]*", {
    ignoreInitial: true
  })
    .pipe(plumber())
    .pipe(
      pug({
        pretty: true,
        basedir: __dirname + "/src",
        plugins: [pugIncludeGlob()]
      })
    )
    .pipe(
      inject(gulp.src(paths.tmp.images + "_sprite.svg"), {
        transform: fileContents
      })
    )
    .pipe(replace("../images/", "images/"))
    .pipe(gulp.dest(paths.tmp.root));
});

gulp.task("html:prebuild", function(callback) {
  gulpSequence(["html:generate-svg"], ["html:generate"])(callback);
});

gulp.task("html:build", function() {
  return gulp
    .src(paths.tmp.root + "*.html")
    .pipe(
      inject(
        gulp
          .src(paths.tmp.css + "_critical.css")
          .pipe(replace("../", ""))
          .pipe(postcss([cssnano()]))
          .pipe(injectString.prepend("<style>"))
          .pipe(injectString.append("</style>")),
        {
          starttag: "<!-- inject:critical:{{ext}} -->",
          transform: fileContents
        }
      )
    )
    .pipe(
      inject(
        gulp
          .src("node_modules/fg-loadcss/src/cssrelpreload.js")
          .pipe(concat("fg-loadcss.html"))
          .pipe(injectString.prepend("<script>"))
          .pipe(injectString.append("</script>")),
        {
          starttag: "<!-- inject:fg-loadcss:{{ext}} -->",
          transform: fileContents
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
    .pipe(gulp.dest(paths.dist.root));
});

// htmlmin won't work together with useref at this time!
gulp.task("html:minify", function() {
  return gulp
    .src(paths.dist.root + "*.html")
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
    .src([paths.src.less + "_*", paths.src.blocks + "*/*.less"])
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "Styles compilation error"
        })
      })
    )
    .pipe(flatten())
    .pipe(concat("main.less"))
    .pipe(less())
    .pipe(
      postcss([
        pxtorem({
          propList: ["*", "!box-shadow"]
        }),
        mqpacker({
          sort: sortCSSmq.desktopFirst
        }),
        autoprefixer()
      ])
    )
    .pipe(gulp.dest(paths.tmp.css));
});

gulp.task("styles:additions", function() {
  return gulp
    .src(paths.src.less + "[^_]*")
    .pipe(
      less({
        paths: [path.join(__dirname, "./")]
      })
    )
    .pipe(gulp.dest(paths.tmp.css));
});

gulp.task("styles:prebuild", function(callback) {
  gulpSequence(["styles:additions", "styles:main"])(callback);
});

gulp.task("styles:critical", function() {
  penthouse(
    {
      url: criticalOptns.url,
      css: paths.tmp.css + "main.css",
      forceInclude: criticalOptns.forceInclude
    },
    function(err, criticalCss) {
      fs.writeFileSync(paths.tmp.css + "_critical.css", criticalCss);
    }
  );
});

gulp.task("styles:build", function() {
  return gulp
    .src(paths.dist.css + "*")
    .pipe(
      postcss([
        uncss({
          html: [paths.dist.root + "[^google]*.html"],
          ignore: [/.*[is,has]-.*/, /.*[tooltip,lightbox].*/]
        })
      ])
    )
    .pipe(postcss([cssnano()]))
    .pipe(gulp.dest(paths.dist.css));
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
  large = "@large",
  huge = "@huge";

gulp.task("images:responsive", function() {
  return gulp
    .src(paths.src.blocks + "*/responsive-images/*")
    .pipe(changed(paths.tmp.images))
    .pipe(flatten())
    .pipe(
      responsive(
        {
          "**/header__logo.*": [ 
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
          "**/header__logo--mobile.*": [
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
          "**/community-logo.*": [
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
          "**/404.*": [
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

gulp.task("images:content:firstpass", function() {
  return gulp
    .src(paths.src.images + "*/*")
    .pipe(changed(paths.tmp.images))
    .pipe(
      responsive(
        {
          "**/article-logo.*": [
            { width: 184 }
          ],
          "**/*_small.*": [{}],
          "**/meta.*": [{}]
        },
        respOptions
      )
    )
    .pipe(gulp.dest(paths.tmp.images));
});

gulp.task("images:content", ["images:content:firstpass"], function() {
  return gulp
    .src(["*/*", "!*/*{_small,article-logo,meta}.*"], {
      cwd: paths.src.images
    })
    .pipe(changed(paths.tmp.images))
    .pipe(
      responsive(
        {
          "**/*": [
            {  width: 630 },
            {
              rename: { suffix: "_original" }
            }
          ]
        },
        respOptions
      )
    )
    .pipe(gulp.dest(paths.tmp.images));
});

gulp.task("images:prebuild", function(callback) {
  gulpSequence(["images:responsive", "images:content"])(callback);
});

gulp.task("images:copy", function() {
  return gulp
    .src(["**", "!_*"], {
      cwd: paths.tmp.images
    })
    .pipe(gulp.dest(paths.dist.images));
});

gulp.task("images:unused", function() {
  return gulp
    .src([
      paths.tmp.root + "*.{html,xml}",
      paths.tmp.css + "*",
      paths.tmp.images + "*/*[^_original, @*]"
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
   JS
   ========================================================================== */

gulp.task("js:plugins", function() {
  return gulp
    .src(paths.plugins.js)
    .pipe(changed(paths.tmp.js))
    .pipe(gulp.dest(paths.tmp.js));
});

gulp.task("js:common", function() {
  return gulp
    .src(paths.src.js + "*")
    .pipe(changed(paths.tmp.js))
    .pipe(gulp.dest(paths.tmp.js));
});

gulp.task("js:main", function() {
  return gulp
    .src(paths.src.blocks + "*/*.js")
    .pipe(concat("scripts.js"))
    .pipe(gulp.dest(paths.tmp.js));
});

gulp.task("js:prebuild", function(callback) {
  gulpSequence(["js:plugins", "js:common", "js:main"])(callback);
});

gulp.task("js:minify", function() {
  return gulp
    .src(paths.dist.js + "*")
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist.js));
});

/* ==========================================================================
   Copying
   ========================================================================== */

gulp.task("copy:fonts:prebuild", function() {
  return gulp
    .src(paths.src.fonts + "*")
    .pipe(changed(paths.tmp.fonts))
    .pipe(gulp.dest(paths.tmp.fonts));
});

gulp.task("copy:fonts:build", function() {
  return gulp.src(paths.src.fonts + "*").pipe(gulp.dest(paths.dist.fonts));
});

gulp.task("copy:root-files", function() {
  return gulp.src(paths.src.root + "*.*").pipe(gulp.dest(paths.dist.root));
});

gulp.task("copy:favicons", function() {
  return gulp
    .src(paths.src.favicons + "*")
    .pipe(gulp.dest(paths.dist.images));
});

gulp.task("copy:logo", function() {
  return gulp.src(paths.src.images + "logo.jpg").pipe(gulp.dest(paths.dist.images));
});

gulp.task("copy:prebuild", function(callback) {
  gulpSequence(["copy:fonts:prebuild"])(callback);
});

gulp.task("copy:build", function(callback) {
  gulpSequence([
    "copy:favicons",
    "copy:logo",
    "copy:root-files",
    "copy:fonts:build"
  ])(callback);
});

/* ==========================================================================
   Watch
   ========================================================================== */

gulp.task("watch:tasks", function() {
  watch(
    [
      paths.src.images + "images-to-sprite/*.svg",
      paths.src.blocks + "*/images-to-sprite/*.svg"
    ],
    { readDelay: 200 },
    function() {
      gulp.start("html:prebuild");
    }
  );

  watch(
    [paths.src.blocks + "*/*.pug", paths.src.pug + "_*"],
    { readDelay: 200 },
    function() {
      gulp.start("html:prebuild");
    }
  );

  watch(
    [paths.src.blocks + "*/*.less", paths.src.less + "*"],
    { readDelay: 200 },
    function() {
      gulp.start("styles:main");
    }
  );

  watch(
    [paths.src.blocks + "*/*.js", paths.src.js + "*"],
    { readDelay: 200 },
    function() {
      gulp.start("js:prebuild");
    }
  );

  watch(
    [
      paths.src.blocks + "**/*.{jpg,jpeg,png}",
      paths.src.images + "**"
    ],
    { readDelay: 200 },
    function() {
      gulp.start("images:prebuild");
    }
  );

  watch(
    paths.src.fonts + "*",
    { readDelay: 200 },
    function() {
      gulp.start("copy:fonts:prebuild");
    }
  );
});

gulp.task("watch", function(callback) {
  gulpSequence(["html:generate:watch", "watch:tasks"])(callback);
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
  browserSync.watch(paths.tmp.css + "*.css").on("change", browserSync.reload);
  browserSync.watch(paths.tmp.js + "*.js").on("change", browserSync.reload);
});

gulp.task("connect:dist", function() {
  browserSync.init({
    server: paths.dist.root,
    notify: false,
    open: false
  });
});

/* ==========================================================================
   Build
   ========================================================================== */

   gulp.task("prebuild", function(callback) {
    gulpSequence(
      ["html:prebuild"],
      ["styles:prebuild"],
      ["styles:critical", "images:prebuild", "js:prebuild", "copy:fonts:prebuild"]
    )(callback);
  });
  
  gulp.task("build", function(callback) {
    gulpSequence(
      ["clean:all"],
      ["prebuild"],
      ["html:build"],
      ["styles:build", "html:minify", "js:minify", "images:copy", "copy:build"],
      ["html:validate", "images:unused"]
    )(callback);
  });
  
  gulp.task("build:fast", function(callback) {
    gulpSequence(
      ["prebuild"],
      ["html:build"],
      ["styles:build", "html:minify", "js:minify", "images:copy", "copy:build"],
      ["html:validate"]
    )(callback);
  });

/* ==========================================================================
   Main
   ========================================================================== */

gulp.task("serve", function(callback) {
  gulpSequence(["prebuild"], ["watch", "connect:tmp"])(callback);
});

gulp.task("default", ["watch", "connect:tmp"], function() {});

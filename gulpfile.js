"use strict";

/* ==========================================================================
  Variables
  ========================================================================== */

var
  gulp           = require("gulp"),
  del            = require("del"),
  fs             = require("fs"),
  run            = require("gulp-run"),
  browserSync    = require("browser-sync"),
  watch          = require("gulp-watch"),
  pugIncludeGlob = require("pug-include-glob"),
  penthouse      = require("penthouse"),

  // PostCSS plugins
  autoprefixer = require("autoprefixer"),
  mqpacker     = require("css-mqpacker"),
  sortCSSmq    = require("sort-css-media-queries"),
  pxtorem      = require("postcss-pxtorem"),
  uncss        = require("uncss").postcssPlugin,
  cssnano      = require("cssnano"),
  
  // Imagemin plugins
  imagemin         = require("gulp-imagemin"),
  imageminPngquant = require("imagemin-pngquant"),
  imageminSvgo     = require("imagemin-svgo"),

  // Plug the rest via gulp-load-plugins
  plugins = require("gulp-load-plugins")();

/* ==========================================================================
   Paths and options
   ========================================================================== */

var paths = {
  plugins: {
    js: [
      "node_modules/moment/min/moment.min.js",
      "node_modules/moment/locale/ru.js"
    ],
    css: [
      "node_modules/normalize.css/normalize.css"
    ]
  }
};

var criticalOptns = {
  url: "file:///Users/daurgamisonia/GitHub/macos-plus/.tmp/index.html",
  forceInclude: [".nav__inner", ".article__img", ".note__icon", ".error404__img", ".vote"],
  //propertiesToRemove: [""]
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
  plugins.sequence(["clean:tmp", "clean:dist"])(cb);
});

/* ==========================================================================
   HTML
   ========================================================================== */

gulp.task("html:prebuild", ["images:sprites:svg"], function() {
  return gulp
    .src("src/*.pug")
    .pipe(
      plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") })
    )
    .pipe(plugins.pug({
      basedir: __dirname + "/src",
      plugins: [pugIncludeGlob()]
    }))
    .pipe(plugins.inject(gulp.src(".tmp/sprite.svg"), {
      transform: function (filePath, file) {
        return file.contents.toString("utf8")
      }
    }))
    .pipe(plugins.htmlBeautify({ indent_size: 2 }))
    .pipe(plugins.rename(function (path) {
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
        plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") })
      )
      .pipe(
        plugins.inject(
          gulp
          .src(".tmp/css/_critical.css")
          .pipe(plugins.replace("../", ""))
          .pipe(plugins.replace("@charset \"UTF-8\";", ""))
          .pipe(plugins.postcss([cssnano()]))
          .pipe(plugins.injectString.prepend("<style>"))
          .pipe(plugins.injectString.append("</style>")), {
            starttag: "<!-- inject:critical:{{ext}} -->",
            transform: function(filePath, file) {
              return file.contents.toString("utf8")
            }
          }
        )
      )
      .pipe(
        plugins.inject(
          gulp
          .src(
            "node_modules/fg-loadcss/src/cssrelpreload.js"
          )
          .pipe(plugins.concat("fg-loadcss.html"))
          .pipe(plugins.injectString.prepend("<script>"))
          .pipe(plugins.injectString.append("</script>")), {
            starttag: "<!-- inject:fg-loadcss:{{ext}} -->",
            transform: function(filePath, file) {
              return file.contents.toString("utf8")
            }
          }
        )
      )
      .pipe(
        plugins.replace(
          /^.*inject-string:noscript.*$/m,
          '<noscript><link rel="stylesheet" href="css/styles.min.css"></noscript>'
        )
      )
      .pipe(plugins.useref())
      .pipe(gulp.dest("dist/"))
  );
});

// htmlmin won't work together with useref at this time!
gulp.task("html:minify", function() {
  return gulp
    .src("dist/*.html")
    .pipe(
      plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") })
    )
    .pipe(
      plugins.htmlmin({
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
    .pipe(plugins.w3cjs())
    .pipe(plugins.w3cjs.reporter());
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
      plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") })
    )
    .pipe(plugins.flatten())
    .pipe(plugins.concat("main.scss"))
    .pipe(plugins.sass({ outputStyle: "expanded" }).on("error", plugins.sass.logError))
    .pipe(
      plugins.postcss([
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
      plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") })
    )
    .pipe(
      plugins.postcss([
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
  plugins.sequence([
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
      plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") })
    )
    .pipe(
      plugins.postcss([
        uncss({
          html: ["dist/[^google]*.html"],
          ignore: [/.*[is,has]-.*/, /.*[tooltip].*/],
          ignoreSheets: [/fonts.googleapis/]
        })
      ])
    )
    .pipe(plugins.postcss([cssnano()]))
    .pipe(gulp.dest("dist/css/"));
});

/* ==========================================================================
   Scripts
   ========================================================================== */

gulp.task("scripts:plugins", function() {
  return gulp
    .src(paths.plugins.js)
    .pipe(plugins.lineEndingCorrector({ 
      verbose: true, 
      eolc: "LF", 
      encoding: "utf8" 
    }))
    .pipe(plugins.changed(".tmp/js/"))
    .pipe(gulp.dest(".tmp/js/"));
});

gulp.task("scripts:common", function() {
  return gulp
    .src("src/js/**")
    .pipe(plugins.changed(".tmp/js/"))
    .pipe(gulp.dest(".tmp/js/"));
});

gulp.task("scripts:blocks", function() {
  return gulp
    .src("src/blocks/**/*.js")
    .pipe(plugins.concat("main.js"))
    .pipe(gulp.dest(".tmp/js/"));
});

gulp.task("scripts:prebuild", function(cb) {
  plugins.sequence(
    ["scripts:plugins"],
    ["scripts:common", "scripts:blocks"]
  )(cb);
});

gulp.task("scripts:build", function() {
  return gulp
    .src("dist/js/*")
    .pipe(
      plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") })
    )
    .pipe(plugins.uglify())
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
      plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") })
    )
    .pipe(plugins.flatten())
    .pipe(
      plugins.responsive(
        {
          "**/logo.png": [ 
            { width: 170 },
            {
              width: 170 * 1.5,
              rename: { suffix: large }
            },
            {
              width: 170 * 2,
              rename: { suffix: huge }
            }
          ],
          "**/fox.*": [
            { width: 400 },
            {
              width: 400 * 1.5,
              rename: { suffix: large }
            },
            {
              width: 400 * 2,
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
      plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") })
    )
    .pipe(
      plugins.responsive(
        {
          "**/!(icon|*_small|thumbnail)*": [
            {  width: 700 },
            {
              rename: { suffix: "_original" }
            }
          ],
          "**/icon*": [
            {  width: 133 }
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
  plugins.sequence([
    "images:responsive",
    "images:content"
  ])(cb);
});

gulp.task("images:build", function() {
  return gulp
    .src(".tmp/images/**")
    .pipe(
      plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") })
    )
    .pipe(plugins.changed("dist/images/"))
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
      plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") })
    )
    .pipe(
      imagemin([
        imageminSvgo({
          plugins: [{ removeViewBox: false }]
        })
      ])
    )
    .pipe(plugins.svgstore({ inlineSvg: true }))
    .pipe(
      plugins.cheerio({
        run: function($, file) {
          $("svg").attr("style", "display: none");
          //$("path").removeAttr("fill");
        },
        parserOptions: { xmlMode: true }
      })
    )
    .pipe(plugins.rename("sprite.svg"))
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
      plugins.plumber({
        errorHandler: plugins.notify.onError({
          title: "Images filter error"
        })
      })
    )
    .pipe(plugins.unusedImages())
    .pipe(plugins.plumber.stop());
});

/* ==========================================================================
   Fonts
   ========================================================================== */

gulp.task("fonts:prebuild", function() {
  return gulp
    .src("src/fonts/**")
    .pipe(plugins.changed(".tmp/fonts/"))
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
    .pipe(plugins.lineEndingCorrector({ 
      verbose: true, 
      eolc: "LF", 
      encoding: "utf8" 
    }))
    .pipe(gulp.dest("dist/"));
});

/* ==========================================================================
   Watch
   ========================================================================== */

gulp.task("watch", function() {
  watch("src/images/icons/*.svg",
    { readDelay: 200 },
    function() {
      gulp.start("html:prebuild");
    }
  );

  watch(
    [
      "src/blocks/*/*.pug", 
      "src/layouts/*",
      "src/pug/**", 
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
  plugins.sequence(
    ["images:prebuild", "scripts:prebuild", "fonts:prebuild"],
    ["html:prebuild", "styles"]
  )(cb);
});

gulp.task("build:fast", function(cb) {
  plugins.sequence(
    ["styles:critical"],
    ["html:build"],
    ["html:minify", "styles:build", "scripts:build"],
    ["metadata"],
    ["html:validate"]
  )(cb);
});

gulp.task("build", function(cb) {
  plugins.sequence(
    ["clean"],
    ["prebuild"],
    ["styles:critical"],
    ["html:build"],
    ["html:minify", "styles:build", "scripts:build"],
    ["images:build", "fonts:build", "favicons", "metadata"],
    ["images:unused", "html:validate"]
  )(cb);
});

/* ==========================================================================
   Main tasks
   ========================================================================== */

gulp.task("serve", function(cb) {
  plugins.sequence(["prebuild"], ["connect:tmp"], ["watch"])(cb);
});

gulp.task("default", ["serve"], function() {});

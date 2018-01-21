"use strict";

// Common packages
var gulp = require("gulp"),
  watch = require("gulp-watch"),
  del = require("del"),
  fs = require("fs"),
  plumber = require("gulp-plumber"),
  notify = require("gulp-notify"),
  gulpSequence = require("gulp-sequence"),
  flatten = require("gulp-flatten"),
  run = require("gulp-run"),
  path = require("path"),
  concat = require("gulp-concat"),
  rename = require("gulp-rename"),
  replace = require("gulp-replace"),
  inject = require("gulp-inject"),
  injectString = require("gulp-inject-string"),
  browserSync = require("browser-sync"),
  ghPages = require("gulp-gh-pages"),
  depcheck = require("gulp-depcheck"),
  // Packages for html
  pug = require("gulp-pug"),
  pugIncludeGlob = require("pug-include-glob"),
  htmlmin = require("gulp-htmlmin"),
  useref = require("gulp-useref"),
  w3cjs = require("gulp-w3cjs"),
  // Packages for styles
  less = require("gulp-less"),
  postcss = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  penthouse = require("penthouse"),
  cssnano = require("cssnano"),
  mqpacker = require("css-mqpacker"),
  sortCSSmq = require("sort-css-media-queries"),
  pxtorem = require("postcss-pxtorem"),
  uncss = require("gulp-uncss"),
  gulpStylelint = require("gulp-stylelint"),
  csscomb = require("gulp-csscomb"),
  // Packages for js
  uglify = require("gulp-uglify"),
  // Packages for images
  responsive = require("gulp-responsive"),
  changed = require("gulp-changed"),
  unusedImages = require("gulp-unused-images"),
  svgstore = require("gulp-svgstore"),
  svgmin = require("gulp-svgmin"),
  cheerio = require("gulp-cheerio");

var paths = {
  src: {
    root: "src/",
    blocks: "src/blocks/",
    pug: "src/pug/",
    css: "src/css/",
    less: "src/less/",
    images: "src/images/",
    favicons: "src/images/favicons/",
    logos: "src/images/logos/",
    fonts: "src/fonts/",
    js: "src/js/"
  },
  tmp: {
    root: ".tmp/",
    css: ".tmp/css/",
    images: ".tmp/images/",
    fonts: ".tmp/fonts/",
    js: ".tmp/js/"
  },
  dist: {
    root: "dist/",
    css: "dist/css/",
    js: "dist/js/",
    images: "dist/images/",
    fonts: "dist/fonts/"
  }
};

///////////////////////////////////////////////////////////////////////////////
// Clean
///////////////////////////////////////////////////////////////////////////////

gulp.task("clean:tmp", function() {
  console.log("----- Cleaning tmp folder -----");
  del.sync(paths.tmp.root + "**");
});

gulp.task("clean:dist", function() {
  console.log("----- Cleaning dist folder -----");
  del.sync(paths.dist.root + "**");
});

///////////////////////////////////////////////////////////////////////////////
// HTML
///////////////////////////////////////////////////////////////////////////////

function fileContents(filePath, file) {
  return file.contents.toString("utf8");
}

gulp.task("html:svg", function() {
  return gulp
    .src([
      paths.src.images + "images-to-sprite/*.svg",
      paths.src.blocks + "*/images-to-sprite/*.svg"
    ])
    .pipe(
      svgmin({
        plugins: [
          {
            removeTitle: true
          }
        ]
      })
    )
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(
      cheerio({
        run: function($, file) {
          $("svg").attr("style", "display: none");
        },
        parserOptions: { xmlMode: true }
      })
    )
    .pipe(rename("_sprite.svg"))
    .pipe(gulp.dest(paths.tmp.images));
});

gulp.task("html:generate", function buildHTML() {
  return gulp
    .src(paths.src.pug + "[^_]*.pug")
    .pipe(
      plumber({
        errorHandler: notify.onError({ title: "HTML compilation error" })
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
  return watch(paths.src.pug + "[^_]*.pug", { ignoreInitial: true })
    .pipe(
      plumber({
        errorHandler: notify.onError({ title: "HTML compilation error" })
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

gulp.task("html:prebuild", function(callback) {
  gulpSequence(["html:svg"], ["html:generate"])(callback);
});

gulp.task("html:build", function() {
  return gulp
    .src(paths.tmp.root + "*.html")
    .pipe(
      inject(
        gulp
          .src(paths.tmp.css + "_critical.css")
          .pipe(postcss(cssnano))
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
          .src([
            "node_modules/fg-loadcss/src/loadCSS.js",
            "node_modules/fg-loadcss/src/cssrelpreload.js"
          ])
          .pipe(concat("loadcss.html"))
          .pipe(uglify())
          .pipe(injectString.prepend("<script>"))
          .pipe(injectString.append("</script>")),
        {
          starttag: "<!-- inject:loadcss:{{ext}} -->",
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
    .pipe(replace(/data-defer=[",'].*[",']\040/, "defer "))
    .pipe(useref())
    .pipe(gulp.dest(paths.dist.root));
});

// htmlmin doesn't work together with useref!
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
    .src(paths.dist.root + "[^google*]*.html")
    .pipe(w3cjs())
    .pipe(w3cjs.reporter());
});

///////////////////////////////////////////////////////////////////////////////
// Styles
///////////////////////////////////////////////////////////////////////////////

// PostCSS plugins
var plugins = [
    pxtorem({
      propList: ["*", "!box-shadow"]
    }),
    mqpacker({
      sort: sortCSSmq.desktopFirst
    }),
    autoprefixer()
  ],
  cssnano = [cssnano()];

// gulp.task("styles:plugins", function() {
//   return gulp
//     .src(["node_modules/"])
//     .pipe(replace("images/", "../images/"))
//     .pipe(concat("plugins.css"))
//     .pipe(gulp.dest(paths.tmp.css));
// });

gulp.task("styles:main", function() {
  return gulp
    .src([
      "node_modules/normalize.css/normalize.css",
      paths.src.less + "*.less",
      paths.src.blocks + "**/*.less"
    ])
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "Styles compilation error"
        })
      })
    )
    .pipe(flatten())
    .pipe(concat("main-styles.less"))
    .pipe(
      less({
        paths: [path.join(__dirname, "src/")]
      })
    )
    .pipe(postcss(plugins))
    .pipe(gulp.dest(paths.tmp.css));
});

// Uncss realize as separate task to avoid trim css before html compilation
gulp.task("styles:trim", function() {
  return gulp
    .src(paths.tmp.css + "main-styles.less")
    .pipe(
      uncss({
        html: [paths.tmp.root + "*.html"],
        ignore: [/^.*is-.*$/, /^.*js-.*$/, /^.*outdated.*$/]
      })
    )
    .pipe(gulp.dest(paths.tmp.css));
});

gulp.task("styles:prebuild", function(callback) {
  gulpSequence([
    // "styles:plugins",
    "styles:main",
    "styles:trim"
  ])(callback);
});

gulp.task("styles:critical", function() {
  penthouse(
    {
      url: "file:///Users/daurgamisonia/GitHub/macos-plus/.tmp/index.html",
      css: ".tmp/css/main-styles.css",
      forceInclude: [".article__img", ".note__icon"]
    },
    function(err, criticalCss) {
      fs.writeFile(paths.tmp.css + "_critical.css", criticalCss);
    }
  );
});

gulp.task("styles:minify", function() {
  return gulp
    .src(paths.dist.css + "*.css")
    .pipe(postcss(cssnano))
    .pipe(gulp.dest(paths.dist.css));
});

gulp.task("styles:prettify", function() {
  return gulp
    .src(paths.src.blocks + "**/*.less")
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "Styles prettification error"
        })
      })
    )
    .pipe(csscomb("csscomb.json"))
    .pipe(
      gulp.dest(function(file) {
        return file.base;
      })
    );
});

gulp.task("styles:lint", function lintCssTask() {
  return gulp.src(paths.tmp.css + "*.css").pipe(
    gulpStylelint({
      reporters: [{ formatter: "string", console: true }]
    })
  );
});

///////////////////////////////////////////////////////////////////////////////
// JS
///////////////////////////////////////////////////////////////////////////////

gulp.task("js:plugins", function() {
  return gulp
    .src([
      "node_modules/moment/min/moment.min.js",
      "node_modules/moment/locale/ru.js"
    ])
    .pipe(changed(paths.tmp.js))
    .pipe(gulp.dest(paths.tmp.js));
});

gulp.task("js:common", function() {
  return gulp
    .src(paths.src.js + "*.js")
    .pipe(changed(paths.tmp.js))
    .pipe(gulp.dest(paths.tmp.js));
});

gulp.task("js:main", function() {
  return gulp
    .src(paths.src.blocks + "**/*.js")
    .pipe(concat("scripts.js"))
    .pipe(gulp.dest(paths.tmp.js));
});

gulp.task("js:prebuild", function(callback) {
  gulpSequence(["js:plugins", "js:common", "js:main"])(callback);
});

gulp.task("js:minify", function() {
  return gulp
    .src(paths.dist.js + "*.js")
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist.js));
});

///////////////////////////////////////////////////////////////////////////////
// Images
///////////////////////////////////////////////////////////////////////////////

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
            { width: 240 * 1.5, rename: { suffix: large } },
            { width: 240 * 2, rename: { suffix: huge } }
          ],
          "**/header__logo--mobile.*": [
            { width: 126 },
            { width: 126 * 1.5, rename: { suffix: large } },
            { width: 126 * 2, rename: { suffix: huge } }
          ],
          "**/community-logo.*": [
            { width: 240 },
            { width: 240 * 1.5, rename: { suffix: large } },
            { width: 240 * 2, rename: { suffix: huge } }
          ]
        },
        respOptions
      )
    )
    .pipe(gulp.dest(paths.tmp.images));
});

gulp.task("images:content:firstpass", function() {
  return gulp
    .src(paths.src.images + "*pages/**/*")
    .pipe(changed(paths.tmp.images))
    .pipe(
      responsive(
        {
          "**/article-image.*": [{ width: 330 }],
          "**/*_small.*": [{}]
        },
        respOptions
      )
    )
    .pipe(gulp.dest(paths.tmp.images));
});

gulp.task("images:content", ["images:content:firstpass"], function() {
  return gulp
    .src(["*pages/**/*", "!*pages/**/*{_small,article-image}.*"], {
      cwd: paths.src.images
    })
    .pipe(changed(paths.tmp.images))
    .pipe(
      responsive(
        {
          "**/*": [{ width: 586 }, { rename: { suffix: "_original" } }]
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
    .src(["**/[^_]*", "!_*/**"], { cwd: paths.tmp.images })
    .pipe(gulp.dest(paths.dist.images));
});

gulp.task("images:unused", function() {
  return gulp
    .src([
      paths.tmp.root + "*.{html,xml}",
      paths.tmp.css + "*",
      paths.tmp.images + "**/*[^_original, @*]"
    ])
    .pipe(
      plumber({
        errorHandler: notify.onError({ title: "Images filter error" })
      })
    )
    .pipe(unusedImages())
    .pipe(plumber.stop());
});

///////////////////////////////////////////////////////////////////////////////
// Copy
///////////////////////////////////////////////////////////////////////////////

gulp.task("copy:fonts", function() {
  return gulp
    .src(paths.src.fonts + "*")
    .pipe(changed(paths.tmp.fonts))
    .pipe(gulp.dest(paths.tmp.fonts));
});

gulp.task("copy:common", function() {
  return gulp.src(paths.src.root + "*.*").pipe(gulp.dest(paths.dist.root));
});

gulp.task("copy:fonts:dist", function() {
  return gulp.src(paths.src.fonts + "*").pipe(gulp.dest(paths.dist.fonts));
});

gulp.task("copy:favicons", function() {
  return gulp.src(paths.src.favicons + "*").pipe(gulp.dest(paths.dist.images));
});

gulp.task("copy:logos", function() {
  return gulp.src(paths.src.logos + "*").pipe(gulp.dest(paths.dist.images));
});

gulp.task("copy:build", function(callback) {
  gulpSequence([
    "copy:fonts:dist",
    "copy:favicons",
    "copy:logos",
    "copy:common"
  ])(callback);
});

///////////////////////////////////////////////////////////////////////////////
// Check
///////////////////////////////////////////////////////////////////////////////

// Check spelling
gulp.task("spelling", function(cb) {
  run("./node_modules/.bin/yaspeller .")
    .exec()
    .on("error", function(err) {
      console.error(err.message);
      cb();
    })
    .on("finish", cb);
});

// Check unused packages
gulp.task(
  "depcheck",
  depcheck({
    dependencies: false,
    missing: false,
    ignoreMatches: ["stylelint-config-*", "yaspeller"]
  })
);

///////////////////////////////////////////////////////////////////////////////
// Build & Deploy
///////////////////////////////////////////////////////////////////////////////

gulp.task("prebuild", function(callback) {
  gulpSequence(
    ["clean:tmp"],
    ["html:prebuild"],
    ["styles:prebuild"],
    ["styles:critical"],
    ["js:prebuild", "images:prebuild", "copy:fonts"]
  )(callback);
});

gulp.task("build", function(callback) {
  gulpSequence(
    ["clean:tmp", "clean:dist"],
    ["prebuild"],
    ["html:build"],
    ["html:minify"],
    ["styles:minify"],
    ["js:minify"],
    ["images:copy"],
    ["copy:build"],
    ["html:validate"]
  )(callback);
});

gulp.task("deploy", function() {
  return gulp.src(paths.dist.root + "**/*").pipe(ghPages());
});

///////////////////////////////////////////////////////////////////////////////
// Watch
///////////////////////////////////////////////////////////////////////////////

gulp.task("watch:tasks", function() {
  watch(
    [
      paths.src.images + "images-to-sprite/*.svg",
      paths.src.blocks + "*/images-to-sprite/*.svg"
    ],
    function() {
      gulp.start("html:prebuild");
    }
  );

  watch(
    [paths.src.blocks + "**/*.pug", paths.src.pug + "_*.pug"],
    { readDelay: 200 },
    function() {
      gulp.start("html:prebuild");
    }
  );

  watch(
    [paths.src.blocks + "**/*.less", paths.src.less + "**/*.less"],
    { readDelay: 200 },
    function() {
      gulp.start("styles:main");
    }
  );

  watch([paths.src.blocks + "**/*.js", paths.src.js + "*.js"], function() {
    gulp.start("js:prebuild");
  });

  watch(paths.src.blocks + "**/*.{jpg,jpeg,png}", function() {
    gulp.start("images:responsive");
  });

  watch(paths.src.images + "pages/**/*", function() {
    gulp.start("images:content");
  });

  watch(paths.src.fonts + "*", function() {
    gulp.start("copy:fonts");
  });
});

gulp.task("watch", function(callback) {
  gulpSequence(["html:generate:watch", "watch:tasks"])(callback);
});

///////////////////////////////////////////////////////////////////////////////
// Server
///////////////////////////////////////////////////////////////////////////////

gulp.task("connect:tmp", function() {
  browserSync.init({
    server: paths.tmp.root,
    notify: false,
    open: false,
    reloadDebounce: 800
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

///////////////////////////////////////////////////////////////////////////////
// General tasks
///////////////////////////////////////////////////////////////////////////////

gulp.task("serve", function(callback) {
  gulpSequence(["prebuild"], ["connect:tmp"], ["watch"])(callback);
});

gulp.task("default", ["watch", "connect:tmp"], function() {});

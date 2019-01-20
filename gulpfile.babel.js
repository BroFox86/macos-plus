/*
 * Run 'gulp' or 'gulp serve' to make a prebuild
 * in the .tmp/ folder and serve it.
 *
 * Run 'gulp build' to build the project in the dist/ folder.
 *
 * Run 'gulp dist' to start local server in the dist/ folder.
 */

"use strict";

// Main plugins
const {
  task, src, lastRun, dest, watch, series, parallel, symlink
} = require("gulp");

import browserSync from "browser-sync";
import pugIncludeGlob from "pug-include-glob";
import useref from "gulp-useref";
import fs from "fs";
import penthouse from "penthouse";
import buffer from "vinyl-buffer";
import merge from "merge-stream";
import del from "del";

// PostCSS plugins
import autoprefixer from "autoprefixer";
import uncss from "postcss-uncss";
import cssnano from "cssnano";
import mqpacker from "css-mqpacker";
import sortCSSmq from "sort-css-media-queries";
import pxtorem from "postcss-pxtorem";

// Imagemin plugins
import imagemin from "gulp-imagemin";
import imageminPngquant from "imagemin-pngquant";
import imageminSvgo from "imagemin-svgo";

// Plug the rest via gulp-load-plugins
import loadPlugins from "gulp-load-plugins";
const plugins = loadPlugins();

/* ==========================================================================
  Paths & options
  ======================================================================== */

const paths = {
  plugins: {
    js: [
      "node_modules/svg4everybody/dist/svg4everybody.min.js"
    ],
    css: [
      "node_modules/normalize.css/normalize.css",
      "src/css/*.css"
    ]
  }
};

const options = {
  quality: {
    png: 80
  },
  uncss: {
    ignore: [/.*[is,has]-.*/, /.*[tooltip].*/]
  },
  penthouse: {
    url: "file:///Users/daurgamisonia/Development/GitHub/macos-plus/.tmp/index.html",
    css: ".tmp/css/main.css",
    include: [
      ".nav__inner",
      ".article__img",
      ".note__icon",
      ".error404__img",
      ".vote"
    ]
  }
}

/* ==========================================================================
  Local server
  ======================================================================== */

function connectToTemp() {
  browserSync.init({
    server: ".tmp/",
    notify: false,
    open: false,
    port: 3000,
    reloadDebounce: 500
  });

  browserSync.watch(".tmp/*.html").on("change", browserSync.reload);
  browserSync.watch(".tmp/css/*").on("change", browserSync.reload);
  browserSync.watch(".tmp/js/*").on("change", browserSync.reload);
  browserSync.watch(".tmp/fonts/*").on("change", browserSync.reload);
}

function connectToDist() {
  browserSync.init({
    server: "dist/",
    notify: false,
    open: false,
    port: 3002
  });
}

export { connectToDist as dist };

/* ==========================================================================
  Watch files
  ======================================================================== */

function watchFiles() {
  watch([
    "src/blocks/*/*.pug",
    "src/layouts/*",
    "src/pug/**"
  ], prebuildHtml);

  watch([
    "src/*.pug"
  ], generateIncrementalHtml);

  watch([
    "src/blocks/**/*.scss",
    "src/scss/**",
    "src/css/*"
  ], prebuildStyles);

  watch([
    "src/blocks/**/*.js",
    "src/js/**"
  ], prebuildScripts);

  watch([
    "src/images/content/**",
    "src/images/*.*"
  ], generateResponsiveImages);

  watch("src/images/icons/*", generateSvgSprite);

  watch("src/fonts/*", prebuildFonts);
}

/* ==========================================================================
  Generate HTML
  ======================================================================== */

function prebuildHtml() {
  return src("src/*.pug")
    .pipe(
      plugins.pug({
        basedir: __dirname + "/src",
        plugins: [pugIncludeGlob()]
      })
      .on("error", plugins.notify.onError())
    )
    .pipe(plugins.htmlBeautify({
      indent_size: 4,
      indent_inner_html: true
    }))
    .pipe(dest(".tmp/"));
}

function generateIncrementalHtml() {
  return src("src/*.pug", {since: lastRun(generateIncrementalHtml)})
    .pipe(
      plugins.pug({
        basedir: __dirname + "/src",
        plugins: [pugIncludeGlob()]
      })
      .on("error", plugins.notify.onError())
    )
    .pipe(plugins.htmlBeautify({
      indent_size: 4,
      indent_inner_html: true
    }))
    .pipe(dest(".tmp/"));
}

function buildHtml() {
  return src(".tmp/*.html")
    .pipe(
      plugins.inject(
        src(".tmp/css/_critical.css")
        .pipe(plugins.replace("../", ""))
        .pipe(plugins.replace("@charset \"UTF-8\";", ""))
        .pipe(plugins.postcss([ cssnano() ]))
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
        src(
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
    .pipe(useref())
    .pipe(dest("dist/"));
}

// htmlmin won't work together with useref at this time
function minifyHtml() {
  return src("dist/*.html")
    .pipe(
      plugins.htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        minifyJS: true
      })
    )
    .pipe(dest("dist/"));
}

function validateHtml() {
  return src("dist/[^google]*.html")
    .pipe(plugins.w3cjs())
    .pipe(plugins.w3cjs.reporter());
}

export { validateHtml as validate };

/* ==========================================================================
  Styles
  ======================================================================== */

function generateStyles()  {
  return src([
      "src/scss/*",
      "src/blocks/**/*.scss"
    ])
    .pipe(plugins.flatten())
    .pipe(plugins.concat("main.scss"))
    .pipe(
      plugins.sass({ outputStyle: "expanded" })
      .on("error", plugins.sass.logError))
      .on("error", plugins.notify.onError()
    )
    .pipe(
      plugins.postcss([
        pxtorem({
          propList: ["*", "!box-shadow", "!border*"]
        }),
        autoprefixer(),
        mqpacker({
          sort: sortCSSmq.desktopFirst
        })
      ])
    )
    .pipe(dest(".tmp/css/"));
}

function copyPluginStyles() {
  return src(paths.plugins.css)
    .pipe(
      plugins.postcss([
        pxtorem({
          propList: ["*", "!box-shadow", "!border*"]
        })
      ])
    )
    .pipe(dest(".tmp/css/"));
}

const prebuildStyles = series(
  copyPluginStyles,
  generateStyles
);

export function generateCritical(cb) {
  penthouse(
    {
      url: options.penthouse.url,
      css: options.penthouse.css,
      forceInclude: options.penthouse.include
    },
    function(err, criticalCss) {
      fs.writeFileSync(".tmp/css/_critical.css", criticalCss);
    },
    setTimeout(function() {
      cb();
    }, 2000)
  );
}

function buildStyles() {
  return src("dist/css/*")
    .pipe(
      plugins.postcss([
        uncss({
          html: ["dist/[^google]*.html"],
          ignore: options.uncss.ignore,
          ignoreSheets: [/fonts.googleapis/]
        })
      ])
    )
    .pipe(plugins.postcss( [cssnano()] ))
    .pipe(dest("dist/css/"));
}

/* ==========================================================================
  Scripts
  ======================================================================== */

function copyPluginScripts() {
  return src(paths.plugins.js)
    .pipe(dest(".tmp/js/"));
}

export function copyCommonScripts() {
  return src("src/js/**")
    .pipe(dest(".tmp/js/"));
}

function concatBlockScripts() {
  return src("src/blocks/**/*.js")
    .pipe(plugins.concat("blocks.js"))
    .pipe(dest(".tmp/js/"));
}

const prebuildScripts =
  series(
    copyPluginScripts,
    parallel(copyCommonScripts, concatBlockScripts)
  );

function buildScripts() {
  return src("dist/js/*")
    .pipe(plugins.uglify())
    .pipe(dest("dist/js/"));
}

/* ==========================================================================
  Images
  ======================================================================== */

const respOptions = {
  errorOnUnusedImage: false,
  errorOnUnusedConfig: false,
  errorOnEnlargement: false,
  silent: true,
  quality: 80
},
large = "@1.5x",
huge = "@2x";

export function generateResponsiveImages() {
  return src([
    "src/images/*content/**",
    "src/images/*.*"
  ], {since: lastRun(generateResponsiveImages)}
    )
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
          ],
          "**/!(icon|*_small|thumbnail)*": [
            {  width: 700 },
            {
              rename: { suffix: "_original" }
            }
          ],
          "**/*_small*": [{}],
          "**/thumbnail*": [{}]
        },
        respOptions
      )
    )
    .pipe(
      imagemin([
        imageminPngquant({
          quality: options.quality.png
        })
      ])
    )
    .pipe(dest(".tmp/images/"))
    .pipe(plugins.wait(1500))
    .pipe(browserSync.stream())
}

function copyMiscImages() {
  return src("src/images/*misc/**")
    .pipe(dest(".tmp/images/"));
}

const prebuildImages = parallel(
  generateResponsiveImages,
  copyMiscImages
);

function buildImages() {
  return src(".tmp/images/**")
    .pipe(dest("dist/images/"));
}

/* SVG sprites
  ======================================================================== */

function generateSvgSprite() {
  return src("src/images/icons/*.svg")
    .pipe(
      imagemin([
        imageminSvgo({
          plugins: [{ removeViewBox: false }]
        })
      ])
    )
    .pipe(plugins.svgstore())
    .pipe(plugins.rename("sprite.svg"))
    .pipe(dest(".tmp/images"));
}

export { generateSvgSprite as svg };

/* ==========================================================================
  Fonts
  ======================================================================== */

function prebuildFonts() {
  return src("src/fonts/")
    .pipe(symlink(".tmp/fonts/"))
}

function buildFonts() {
  return src(".tmp/fonts/**")
    .pipe(dest("dist/fonts/"));
}

/* ==========================================================================
    Misc
  ======================================================================== */

function copyFavicons() {
  return src("src/favicons/**")
    .pipe(dest("dist/"));
}

function copyMetadata() {
  return src("src/metadata/*")
    .pipe(plugins.lineEndingCorrector({
      verbose: true,
      eolc: "LF",
      encoding: "utf8"
    }))
    .pipe(dest("dist/"));
}

/* ==========================================================================
  Clean
  ======================================================================== */

export function cleanTemp() {
  console.log("----- Cleaning .tmp/ folder -----");
  return del([".tmp/**"]);
}

export function cleanDist() {
  console.log("----- Cleaning dist/ folder -----");
  return del(["dist/**"]);
}

const clean = series(cleanTemp, cleanDist);

/* ==========================================================================
  Main tasks
  ======================================================================== */

/*
 * Start without prebuild
 */
const start = series(parallel(watchFiles, connectToTemp));
task("start", start);

const prebuild = parallel(
  prebuildHtml,
  prebuildStyles,
  prebuildScripts,
  generateSvgSprite,
  prebuildImages,
  prebuildFonts
);

/*
 * Start with prebuild
 */
const serve = series(prebuild, parallel(watchFiles, connectToTemp));
task("serve", serve);

/*
 * Export the default task
 */
export default serve;

const build = series(
  clean,
  prebuild,
  generateCritical,
  buildHtml,
  minifyHtml,
  parallel(
    buildStyles,
    buildScripts,
    buildImages,
    buildFonts,
    copyFavicons,
    copyMetadata
  ),
  validateHtml
);
task("build", build);

/*
 * Fast build
 */
const fastBuild = series(
  generateCritical,
  buildHtml,
  minifyHtml,
  parallel(
    buildStyles,
    buildScripts,
    buildFonts
  ),
  validateHtml
);
task("fast", fastBuild);
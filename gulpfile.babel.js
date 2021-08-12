/*
 * Run 'gulp' or 'gulp serve' to make a prebuild
 * in the .tmp/ folder and serve it.
 *
 * Run 'gulp cleanBuild' to build the project in the dist/ folder.
 *
 * Run 'gulp dist' to start local server in the dist/ folder.
 */

"use strict";

const {
  src, lastRun, dest, watch, series, parallel, symlink
} = require("gulp");

// Main plugins
import browserSync from "browser-sync";
import pugIncludeGlob from "pug-include-glob";
import useref from "gulp-useref";
import fs from "fs";
import penthouse from "penthouse";
import del from "del";

// PostCSS plugins
import autoprefixer from "autoprefixer";
import uncss from "postcss-uncss";
import cssnano from "cssnano";
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

const PATHS = {
  plugins: {
    js: "",
    css: "node_modules/normalize.css/normalize.css"
  }
};

const OPTIONS = {
  htmlBeautify: {
    indent_size: 2,
    indent_inner_html: true,
    max_preserve_newlines: 1,
    inline: ""
  },
  pngquant: {
    quality: [0.9, 1]
  },
  pxToRem: {
    propList: ["*", "!box-shadow", "!border*"]
  },
  uncss: {
    ignore: [/.*[is,has]-.*/, /.*[tooltip].*/]
  },
  penthouse: {
    url: "file:///Users/daur.gamisonia/Development/macos-plus/.tmp/index.html",
    css: ".tmp/css/main.css",
    include: [
      ".nav__inner",
      ".article__img",
      ".note__icon",
      ".error404__img",
      ".vote"
    ]
  },
  responsive: {
    errorOnUnusedImage: false,
    errorOnUnusedConfig: false,
    errorOnEnlargement: false,
    silent: true,
    quality: 80
  }
};

/* ==========================================================================
  Local server & Watching
  ======================================================================== */

export function watchFiles() {
  browserSync.init({
    server: ".tmp/",
    notify: false,
    open: false,
    port: 3000,
    reloadDebounce: 500
  });

  // Watch Pug
  watch("src/pug/*/*", {
    delay: 500,
    ignoreInitial: true
  }, generateHtml);

  // Watch pages
  watch("src/pug/*.*", {
    delay: 500
  }, generateHtmlPage);

  // Watch styles
  watch("src/scss/**", {
    delay: 500,
    ignoreInitial: true
  }, generateStyles);

  // Watch scripts
  watch("src/js/*.*", {
    ignoreInitial: true
  }, copyAllScripts);

  // Watch images
  watch("src/images/**", {
    delay: 500,
    ignoreInitial: true
  }, prebuildImages);

  // Watch icons
  watch("src/images/icons/*", {
    delay: 500,
    ignoreInitial: true
  }, generateSvgSprite);

  // Watch fonts
  watch("src/fonts/*", {
    ignoreInitial: true
  }, prebuildFonts);
}

export function connectDist() {
  browserSync.init({
    server: "dist/",
    notify: false,
    open: false,
    port: 3002
  });
}

/* ==========================================================================
  HTML
  ======================================================================== */

function generateHtml() {
  return src("src/pug/*.*")
    .pipe(
      plugins.pug({
        basedir: `${__dirname}/src`,
        plugins: [pugIncludeGlob()]
      })
      .on("error", plugins.notify.onError())
    )
    .pipe(plugins.htmlBeautify(OPTIONS.htmlBeautify))
    .pipe(dest(".tmp/"))
    .pipe(browserSync.stream());
}

function generateHtmlPage() {
  return src("src/pug/*.*", {
    since: lastRun(generateHtmlPage)
  })
    .pipe(
      plugins.pug({
        basedir: `${__dirname}/src`,
        plugins: [pugIncludeGlob()]
      })
      .on("error", plugins.notify.onError())
    )
    .pipe(plugins.htmlBeautify(OPTIONS.htmlBeautify))
    .pipe(dest(".tmp/"))
    .pipe(browserSync.stream());
}

function buildHtml() {
  return src(".tmp/*.html")
    .pipe(
      plugins.inject(
        src(".tmp/css/_critical.css")
        .pipe(plugins.replace("../", ""))
        .pipe(plugins.replace("@charset \"UTF-8\";", ""))
        .pipe(plugins.postcss([cssnano()]))
        .pipe(plugins.injectString.prepend("<style>"))
        .pipe(plugins.injectString.append("</style>")), {
          starttag: "<!-- inject:critical:{{ext}} -->",
          transform: function(filePath, file) {
            return file.contents.toString("utf8");
          }
        }
      )
    )
    .pipe(
      plugins.inject(
        src("node_modules/fg-loadcss/src/cssrelpreload.js")
        .pipe(plugins.concat("fg-loadcss.html"))
        .pipe(plugins.injectString.prepend("<script>"))
        .pipe(plugins.injectString.append("</script>")), {
          starttag: "<!-- inject:fg-loadcss:{{ext}} -->",
          transform: function(filePath, file) {
            return file.contents.toString("utf8");
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

// htmlmin won't work together with useref
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

export function validate() {
  return src("dist/[^google]*.html")
    .pipe(plugins.w3cjs({
      // showInfo: true
    }))
    .pipe(plugins.w3cjs.reporter());
}

/* ==========================================================================
  Styles
  ======================================================================== */

export function copyPluginStyles(callback) {
  // Do nothing if there are no sources
  if (PATHS.plugins.css == "") {
    return callback();
  }

  return src(PATHS.plugins.css)
    .pipe(plugins.rename({
      extname: ".scss"
    }))
    .pipe(plugins.changed("src/scss/vendors/"))
    .pipe(dest("src/scss/vendors/"));
}

function generateStyles() {
  return src(["src/scss/main.scss", "src/scss/vendors/*"])
    .pipe(plugins.sassGlob())
    .pipe(
      plugins.sass({
        outputStyle: "expanded"
      })
      .on("error", plugins.sass.logError))
      .on("error", plugins.notify.onError()
    )
    .pipe(
      plugins.postcss([
        autoprefixer(),
        pxtorem({
          propList: OPTIONS.pxToRem.propList
        })
      ])
    )
    .pipe(dest(".tmp/css/"))
    .pipe(browserSync.stream());
}

const prebuildStyles = series(
  copyPluginStyles,
  generateStyles
);

/* Critical styles
  ======================================================================== */

export function generateCritical(cb) {
  penthouse({
    url: OPTIONS.penthouse.url,
    css: OPTIONS.penthouse.css,
    forceInclude: OPTIONS.penthouse.include
  })
  .then(criticalCss => {
    fs.writeFileSync(".tmp/css/_critical.css", criticalCss);
    setTimeout(() => cb(), 2000);
  })
}

function buildStyles() {
  return src("dist/css/*")
    .pipe(
      plugins.postcss([
        uncss({
          html: ["dist/[^google]*.html"],
          ignore: OPTIONS.uncss.ignore,
          ignoreSheets: [/fonts.googleapis/]
        })
      ])
    )
    .pipe(plugins.postcss([cssnano()]))
    .pipe(dest("dist/css/"));
}

/* ==========================================================================
  Scripts
  ======================================================================== */

export function copyPluginScripts(callback) {
  // Do nothing if there are no sources
  if (PATHS.plugins.js == "") {
    return callback();
  }

  return src(PATHS.plugins.js)
    .pipe(plugins.changed("src/js/vendors"))
    .pipe(dest("src/js/vendors"));
}

function copyAllScripts() {
  return src("src/js/**")
    .pipe(plugins.flatten())
    .pipe(dest(".tmp/js/"))
    .pipe(browserSync.stream());
}

const prebuildScripts = series(copyPluginScripts, copyAllScripts);

export function buildScripts() {
  return src("dist/js/*")
    .pipe(plugins.babel())
    .pipe(plugins.uglify())
    .pipe(dest("dist/js/"));
}

/* ==========================================================================
  Images
  ======================================================================== */

export function processContentImages() {
  return src("src/images/*content/**")
    .pipe(plugins.changed("src/images/*content/**", {
      hasChanged: plugins.changed.compareContents
    }))
    .pipe(
      plugins.responsive(
        {
          "**/!(icon|*_small|thumbnail)*": [
            {
              width: 480
            },
            {
              rename: {
                suffix: "_original"
              }
            }
          ],
          "**/*_small*": [{}],
          "**/thumbnail*": [{}]
        },
        OPTIONS.responsive
      )
    )
    .pipe(
      imagemin([
        imageminPngquant({
          quality: OPTIONS.pngquant.quality
        })
      ])
    )
    .pipe(dest(".tmp/images/"))
    .pipe(plugins.wait(1500))
    .pipe(browserSync.stream());
}

export function processResponsiveImages() {
  const large = "@1.5x";
  const huge = "@2x";

  return src("src/images/*.*")
    .pipe(plugins.changed("src/images/*.*", {
      hasChanged: plugins.changed.compareContents
    }))
    .pipe(
      plugins.responsive(
        {
          "**/logo.png": [
            {
              width: 150
            },
            {
              width: 150 * 1.5,
              rename: {
                suffix: large
              }
            },
            {
              width: 150 * 2,
              rename: {
                suffix: huge
              }
            }
          ],
          "**/fox.*": [
            {
              width: 400
            },
            {
              width: 400 * 1.5,
              rename: {
                suffix: large
              }
            },
            {
              width: 400 * 2,
              rename: {
                suffix: huge
              }
            }
          ]
        },
        OPTIONS.responsive
      )
    )
    .pipe(
      imagemin([
        imageminPngquant({
          quality: OPTIONS.pngquant.quality
        })
      ])
    )
    .pipe(dest(".tmp/images/"))
    .pipe(plugins.wait(1500))
    .pipe(browserSync.stream());
}

export function copyMiscImages() {
  return src("src/images/*misc/**")
    .pipe(dest(".tmp/images/"));
}

const prebuildImages = parallel(
  processContentImages,
  processResponsiveImages,
  copyMiscImages
);

exports.prebuildImages = prebuildImages;

function buildImages() {
  return src(".tmp/images/**")
    .pipe(dest("dist/images/"));
}

/* SVG sprites
  ======================================================================== */

export function generateSvgSprite() {
  return src("src/images/icons/*.svg")
    .pipe(
      imagemin([
        imageminSvgo({
          plugins: [{ removeViewBox: false }]
        })
      ])
    )
    .pipe(plugins.svgstore())
    .pipe(plugins.rename("icons.svg"))
    .pipe(dest(".tmp/images"))
    .pipe(browserSync.stream());
}

/* ==========================================================================
  Fonts
  ======================================================================== */

function prebuildFonts() {
  return src("src/fonts/")
    .pipe(symlink(".tmp/fonts/"))
    .pipe(browserSync.stream());
}

function buildFonts() {
  return src(".tmp/fonts/**")
    .pipe(dest("dist/fonts/"));
}

/* ==========================================================================
  Misc
  ======================================================================== */

export function copyFavicons() {
  return src("src/favicons/**")
    .pipe(dest("dist/"));
}

export function copyMetadata() {
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

function cleanTemp() {
  console.log("----- Cleaning .tmp/ folder -----");
  return del(".tmp/**");
}

function cleanDist() {
  console.log("----- Cleaning dist/ folder -----");
  return del("dist/**");
}

const clean = series(cleanTemp, cleanDist);

/* ==========================================================================
  Build
  ======================================================================== */

const prebuild = parallel(
  generateHtml,
  prebuildStyles,
  prebuildScripts,
  generateSvgSprite,
  prebuildImages,
  prebuildFonts
);

const build = series(
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
  )
  // validate
);

const cleanBuild = series(
  clean,
  prebuild,
  build
);

/* ==========================================================================
  Main tasks
  ======================================================================== */

// Prebuild and watch files
const serve = series(prebuild, watchFiles);

// Set default task (gulp)
export default serve;

// Build from prebuild
exports.build = build;

// Clean build
exports.cleanBuild = cleanBuild;

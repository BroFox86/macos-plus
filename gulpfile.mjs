/**
 * GULP TASKS DOCUMENTATION
 *
 * Run 'gulp or gulp serve' to monitor sources for changes & compile it automatically.
 *
 * Run 'gulp build' to build project in dist/.
 */

"use strict";

/* ==========================================================================
  Package declarations
  ======================================================================== */

import gulp from "gulp";
import browserSync from "browser-sync";
import { deleteAsync } from "del";
import through2 from "through2";
import path from "path";
import replace from "gulp-replace";
import wait from "gulp-wait";
import rename from "gulp-rename";
import notify from "gulp-notify";
import changed from "gulp-changed";
import flatten from "gulp-flatten";
import concat from "gulp-concat";
import uglify from "gulp-uglify";

// HTML
import useref from "gulp-useref";
import pug from "gulp-pug";
import pugIncludeGlob from "pug-include-glob";
import htmlBeautify from "gulp-html-beautify";
import htmlTest from "html-test";

// PostCSS
import postcss from "gulp-postcss";
import pxtorem from "postcss-pxtorem";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

// Images.
import imagemin from "gulp-imagemin";
// import imageminPngquant from "imagemin-pngquant";
import svgstore from "gulp-svgstore";
import imageminSvgo from "imagemin-svgo";
import sharp from "sharp";

// Sass
import gulpSass from "gulp-sass";
import * as dartSass from "sass";
const sass = gulpSass(dartSass);

/* ==========================================================================
  Paths & Options
  ======================================================================== */

const SRC_PATH = "./src";
const DEV_PATH = "./.temp";
const DIST_PATH = "./dist";

const JPEG_QUALITY = 80;
// const PNG_QUALITY = [0.5, 1];

const PX_TO_REM_OPTIONS = {
  rootValue: 16,
  propList: ["*", "!box-shadow", "!border*"]
};

/* ==========================================================================
  Local servers & watching files
  ======================================================================== */

export function watchFiles() {
  browserSync.init({
    server: `${DEV_PATH}`,
    notify: false,
    open: false,
    port: 3000,
    reloadDebounce: 500
  });

  gulp.watch(`${SRC_PATH}/pug/**/*.pug`, doHtmlWithCache);
  gulp.watch(`${SRC_PATH}/scss/**/*.scss`, doStylesWithCache);
  gulp.watch(`${SRC_PATH}/js/**/*.js`, doScriptsWithCache);
  gulp.watch(`${SRC_PATH}/images/**/*.*(jpg|jpeg|png|svg)`, doImages);
  gulp.watch(`${SRC_PATH}/fonts/**/*.*(ttf|otf|woff|woff2)`, copyFonts);
}

/* ==========================================================================
  Clear tasks
  ======================================================================== */

export function clearTemp() {
  console.log(`----- Cleaning ${DEV_PATH}/ folder -----`);
  return deleteAsync(`${DEV_PATH}/**`);
}

export function clearProduction() {
  console.log(`----- Cleaning ${DIST_PATH} folder -----`);
  return deleteAsync(`${DIST_PATH}/**`, { force: true });
}

const clear = gulp.series(clearTemp, clearProduction);

function clearCache() {
  const time = new Date().getTime();

  return gulp
    .src(`${DEV_PATH}/*.html`)
    .pipe(replace(/cache_bust=\d+/g, `cache_bust=${time}`))
    .pipe(gulp.dest(`${DEV_PATH}`));
}

/* ==========================================================================
  HTML
  ======================================================================== */

export function doHtml() {
  return gulp
    .src(`${SRC_PATH}/pug/*.*`)
    .pipe(wait(700))
    .pipe(
      pug({
        basedir: `${process.cwd()}/src`,
        plugins: [pugIncludeGlob()]
      }).on("error", notify.onError())
    )
    .pipe(changed(`${DEV_PATH}`))
    .pipe(
      htmlBeautify({
        indent_size: 2,
        indent_inner_html: true,
        max_preserve_newlines: 1,
        inline: ""
      })
    )
    .pipe(flatten())
    .pipe(gulp.dest(`${DEV_PATH}`))
    .pipe(browserSync.stream());
}

const doHtmlWithCache = gulp.series(doHtml, clearCache);

function buildHtml() {
  return gulp
    .src(`${DEV_PATH}/*.html`)
    .pipe(useref({ noAssets: true }))
    .pipe(replace(/\?cache_bust=\d*/g, ""))
    .pipe(gulp.dest(`${DIST_PATH}`));
}

export function validateHTML() {
  return htmlTest(`${DEV_PATH}/*.html`, {
    ignore: ["node_modules/**", `${DIST_PATH}/**`]
  });
}

/* ==========================================================================
  Styles
  ======================================================================== */

export function doStyles() {
  return gulp
    .src(`${SRC_PATH}/scss/base/_index.scss`)
    .pipe(gulp.src("node_modules/normalize.css/normalize.css"))
    .pipe(gulp.src(`${SRC_PATH}/scss/base/_variables.scss`))
    .pipe(gulp.src(`${SRC_PATH}/scss/base/_mixins.scss`))
    .pipe(gulp.src(`${SRC_PATH}/scss/base/_fonts.scss`))
    .pipe(gulp.src(`${SRC_PATH}/scss/base/_base.scss`))
    .pipe(gulp.src(`${SRC_PATH}/scss/layout/*.scss`))
    .pipe(gulp.src(`${SRC_PATH}/scss/components/*.scss`))
    .pipe(concat("main.scss"))
    .pipe(sass().on("error", sass.logError))
    .on("error", notify.onError())
    .pipe(postcss([pxtorem(PX_TO_REM_OPTIONS), autoprefixer()]))
    .pipe(flatten())
    .pipe(gulp.dest(`${DEV_PATH}/css/`))
    .pipe(browserSync.stream());
}

const doStylesWithCache = gulp.series(doStyles, clearCache);

function buildStyles() {
  return gulp
    .src(`${DEV_PATH}/css/main.css`)
    .pipe(postcss([cssnano()]))
    .pipe(rename("styles.min.css"))
    .pipe(gulp.dest(`${DIST_PATH}/css/`));
}

/* ==========================================================================
  Scripts
  ======================================================================== */

export function doScripts() {
  return gulp
    .src(`${SRC_PATH}/js/**/*.js`)
    .pipe(gulp.dest(`${DEV_PATH}/js/`))
    .pipe(browserSync.stream());
}

const doScriptsWithCache = gulp.series(doScripts, clearCache);

function buildCustomScripts() {
  return gulp
    .src(`${DEV_PATH}/js/*`)
    .pipe(concat("global.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest(`${DIST_PATH}/js/`));
}

/* ==========================================================================
  Images
  ======================================================================== */

export const processContentImages = () => {
  return gulp
    .src(`${SRC_PATH}/images/content/**/!(*_small|thumbnail)*`, { encoding: false })
    .pipe(
      through2.obj(async function (file, enc, cb) {
        if (file.isBuffer()) {
          try {
            const smallBuffer = await sharp(file.contents).resize({ width: 480, withoutEnlargement: true }).toBuffer();
            const smallFile = file.clone();

            smallFile.contents = smallBuffer;

            const originalFile = file.clone();
            const dir = file.dirname;
            const ext = path.extname(file.path);
            const name = path.basename(file.path, ext);

            originalFile.path = path.join(dir, `${name}_original${ext}`);

            this.push(smallFile);
            this.push(originalFile);
          } catch (err) {
            console.error(`[Sharp Error] ${file.relative}:`, err.message);
          }
        }
        cb();
      })
    )
    .pipe(
      gulp.src([`${SRC_PATH}/images/content/**/*_small*`, `${SRC_PATH}/images/content/**/thumbnail*`], {
        encoding: false
      })
    )
    .pipe(wait(1500))
    .pipe(gulp.dest(`${DEV_PATH}/images/content/`));
};

export function copyResponsiveImages() {
  return gulp
    .src(`${SRC_PATH}/images/*.*`, { encoding: false })
    .pipe(changed(`${DEV_PATH}/images/`))
    .pipe(gulp.dest(`${DEV_PATH}/images/`))
    .pipe(browserSync.stream());
}

export function copyMiscImages() {
  return gulp
    .src(`${SRC_PATH}/images/misc/*`, {
      encoding: false
    })
    .pipe(changed(`${DEV_PATH}/images/misc/`))
    .pipe(gulp.dest(`${DEV_PATH}/images/misc/`))
    .pipe(browserSync.stream());
}

export function generateSvgSprite() {
  return gulp
    .src(`${SRC_PATH}/images/icons/*.svg`)
    .pipe(imagemin([imageminSvgo()]))
    .pipe(svgstore())
    .pipe(rename("icons.svg"))
    .pipe(gulp.dest(`${DEV_PATH}/images`))
    .pipe(browserSync.stream());
}

const doImages = gulp.series(processContentImages, copyResponsiveImages, copyMiscImages, generateSvgSprite);

export function buildImages() {
  return gulp.src(`${DEV_PATH}/images/**`, { encoding: false }).pipe(gulp.dest(`${DIST_PATH}/images/`));
}

/* ==========================================================================
  Fonts
  ======================================================================== */

function copyFonts() {
  return gulp
    .src(`${SRC_PATH}/fonts/*.*(ttf|otf|woff|woff2)`, { encoding: false })
    .pipe(changed(`${DEV_PATH}/fonts/`))
    .pipe(gulp.dest(`${DEV_PATH}/fonts/`));
}

function buildFonts() {
  return gulp.src(`${DEV_PATH}/fonts/**`, { encoding: false }).pipe(gulp.dest(`${DIST_PATH}/fonts/`));
}

/* ==========================================================================
  Favicons
  ======================================================================== */

function copyFavicons() {
  return gulp.src(`${SRC_PATH}/favicons/**`, { encoding: false }).pipe(gulp.dest(`${DIST_PATH}/`));
}

/* ==========================================================================
  Building tasks
  ======================================================================== */

const doDevelopmentBuild = gulp.parallel(doHtml, doStyles, doScripts, doImages, copyFonts);
const doProductionBuild = gulp.parallel(
  buildHtml,
  buildCustomScripts,
  buildStyles,
  buildImages,
  buildFonts,
  copyFavicons
);

export const build = gulp.series(clear, doDevelopmentBuild, doProductionBuild);

/* ==========================================================================
  Main tasks
  ======================================================================== */

const serve = gulp.series(doDevelopmentBuild, watchFiles);

export default serve;

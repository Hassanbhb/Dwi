const { parallel, src, dest } = require("gulp");
const uglify = require("gulp-uglify-es").default;
const cleanCss = require("gulp-clean-css");

const files = {
  svgPath: "public/images/*.svg",
  cssPath: "public/stylesheets/main.css",
  jsPath: "public/javascripts/**/*.js"
};

function copyImgs() {
  return src(files.svgPath).pipe(dest("src/images/"));
}

function cssTask() {
  //for production minifycss and uglify it
  return src(files.cssPath)
    .pipe(cleanCss())
    .pipe(dest("src/stylesheets/"));
}

function jsTask() {
  //for production minify and uglify
  return src(files.jsPath)
    .pipe(uglify())
    .pipe(dest("src/javascripts/"));
}

exports.default = parallel(copyImgs, cssTask, jsTask);

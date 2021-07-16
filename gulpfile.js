const { src, dest, watch, parallel, series } = require('gulp');

const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const convert = require('gulp-sass');
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const imagemin = require('gulp-imagemin');
const del = require('del');
const gcmq = require('gulp-group-css-media-queries');

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
}
function styles() {
    return src('app/sass/style.sass')
        .pipe(convert({ outputStyle: 'compressed' }))
        .pipe(concat('style.min.css'))
        .pipe(gcmq())
        .pipe(postcss([autoprefixer({
            grid: true,
        })]))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}
function scripts() {
    return src([
        'app/js/main.js',
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}
function cleanDist() {
    return del('dist')
}
function images() {
    return src('app/img/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({ quality: 75, progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(dest('dist/img'))
}
function watching() {
    watch(['app/sass/**/*.sass'], styles);
    watch("app/*.html").on('change', browserSync.reload);
    watch(['app/js/main.js'], scripts);
}
function build() {
    return src([
        'app/*.html',
        'app/css/*.css',
        'app/js/*.js',
        'app/fonts/**/*',
    ], { base: 'app' })
        .pipe(dest('dist'))
}

exports.styles = styles;
exports.watch = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, images, build);
exports.default = parallel(scripts, styles, watching, browsersync);
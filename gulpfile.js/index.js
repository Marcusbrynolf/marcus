/*================================
=            Required            =
================================*/


var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	sass = require('gulp-sass'),
	sourcemaps   = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	cssnano = require('gulp-cssnano'),
	render = require('gulp-nunjucks-render'),
	htmlmin = require('gulp-htmlmin'),
	del = require('del'),
	plumber = require('gulp-plumber'),
	webpack = require('gulp-webpack'),
	csslint = require('gulp-csslint'),
	size = require('gulp-size'),
	rev = require('gulp-rev'),
	// stripDebug = require('gulp-strip-debug'),
	cssBase64 = require('gulp-css-base64'),
	bytediff = require('gulp-bytediff'),
	rucksack = require('gulp-rucksack'),
	// imagemin = require('gulp-imagemin'),
	// useref = require('gulp-useref'),
	tinypng = require('gulp-tinypng-compress'),
	changed = require('gulp-changed'),
	revReplace = require('gulp-rev-replace');


/*===================================
=            Script Task            =
===================================*/

gulp.task('scripts', function() {
	gulp.src(['src/javascripts/**/*.js', '!src/js/**/*.min.js'])
	.pipe(changed('public/javascripts'))
	.pipe(plumber())
	.pipe(webpack({
		output: {
			filename: 'app.min.js'
		}
	}))
	.pipe(uglify())
	// .pipe(stripDebug())

	.pipe(size())
	.pipe(gulp.dest('public/javascripts'))
	.pipe(reload({stream:true}));
})

/*=================================
=            HTML Task            =
=================================*/

gulp.task('html', function () {
  return gulp.src('src/html/**/*.html')
    .pipe(render({
      path: ['src/html/'] // String or Array 
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(size())
    .pipe(gulp.dest('public/html'))
    .pipe(reload({stream:true}));
});

/*============================================
=            Compass / Sass Tasks            =
============================================*/
gulp.task('sass', function() {
	return gulp.src('src/stylesheets/**/*.scss')
	.pipe(changed('public/stylesheets'))
	.pipe(plumber())
	.pipe(bytediff.start())
	.pipe(sourcemaps.init())
	
	.pipe(sass().on('error', sass.logError))
	.pipe(rucksack())
	.pipe(csslint())
	.pipe(csslint.reporter())
	.pipe(rename({suffix: '.min'}))
	.pipe(cssBase64())
	.pipe(cssnano())
	.pipe(autoprefixer('last 2 versions'))
	.pipe(sourcemaps.write())
	.pipe(size())
	.pipe(bytediff.stop())
	.pipe(gulp.dest('public/stylesheets'))
	.pipe(reload({stream:true}));
});

/*====================================
=            Images Tasks            =
====================================*/

gulp.task('images', function() {
    gulp.src('src/images/*')
        // .pipe(imagemin())
        .pipe(tinypng({
            key: 'C3luljFCD7bFKyNvLr4GdLKKsDm9nl9Q',
            log: true
        }))
        .pipe(gulp.dest('public/images'))
});

/*=============================
=            Fonts            =
=============================*/

gulp.task('fonts', function() {
    gulp.src('src/fonts/*')
        .pipe(changed('public/fonts'))
        .pipe(gulp.dest('public/fonts'))
});


/*=====  End of Fonts  ======*/


/*===================================
=            Build Tasks            =
===================================*/
// clear out all files and folder from the public folder
// gulp.task('build:cleanfolder', function() {
// 	return del([
// 		'public/**'
// 	]);
// });

// task to create public directory for all files
// gulp.task('build:copy', ['build:cleanfolder'], function() {
// 	return gulp.src(['src/**/*'])
// 	.pipe(gulp.dest('public/'));
// });

// task to remove unwanted public files
// list all files and directories that you don't want to include
// gulp.task('build:remove', ['build:copy'], function(){
// 	return gulp.src([
// 		'public/stylesheets/',
// 		'public/javascripts/!(*.min.js)'
// 	])
// });

// gulp.task('build', ['build:copy', 'build:remove']);

/*==========================================
=            Browser-Sync Tasks            =
==========================================*/
gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: ['./src/html', './src/']
		}
	})
})

gulp.task('build:serve', function(){
	browserSync({
		server: {
			baseDir: ['./public/html', './public/']
		}
	})
})
/*==================================
=            Watch Task            =
==================================*/
gulp.task('watch', function() {
	gulp.watch('src/javascripts/**/*.js', ['scripts']);
	gulp.watch('src/stylesheets/**/*.scss', ['sass']);
	gulp.watch('src/html/**/*.html', ['html']);
	gulp.watch('src/images/*', ['images']);
});



/*====================================
=            Default Task            =
====================================*/

gulp.task('default', ['scripts', 'sass', 'html', 'images', 'fonts', 'build:serve', 'watch']);

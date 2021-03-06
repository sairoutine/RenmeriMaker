'use strict';

// ソース元の対象ファイル
var source_file = './client/js/main.js';
// 出力ディレクトリ
var dist_dir = './public/js/';
// アプリファイル
var appjs = 'main.js';
// minify後のアプリ名ファイル
var appminjs = 'main.min.js';

var watch      = require('gulp-watch');
var browserify = require('browserify');
var stringify  = require('stringify');
var gulp       = require('gulp');
var source     = require('vinyl-source-stream');
var uglify     = require("gulp-uglify");
var rename     = require('gulp-rename');
var runSequence= require('run-sequence');
var path       = require('path');
var notify     = require('gulp-notify');

gulp.task('browserify', function() {
	return browserify(source_file)
		.transform(stringify, {
			appliesTo: { includeExtensions: ['.vs', '.fs'] }, // シェーダーファイルをテキストとして require できるようにする
		})
		.transform("babelify", {presets: ["es2015"], "plugins": ["mjsx"]})
		.bundle()
		.on('error', function(err){   //ここからエラーだった時の記述
			// デスクトップ通知
			var error_handle = notify.onError('<%= error.message %>');
			error_handle(err);
			this.emit('end');
		})
		.pipe(source(appjs))
		.pipe(gulp.dest(dist_dir));
});

gulp.task('minify', function() {
	return gulp.src(path.join(dist_dir, appjs))
		.pipe(uglify())
		.pipe(rename(appminjs))
		.pipe(gulp.dest(dist_dir));
});


gulp.task('build', function(callback) {
	return runSequence(
		'browserify',
		'minify',
		callback
	);
});

gulp.task('watch', function() {
	watch(['client/js/**/*.(js|html|fs|vs)'], function(event) {
		gulp.start("build");
	});
});

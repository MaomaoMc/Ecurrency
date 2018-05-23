// /**
//  * css/script资源压缩配置
//  * 使用前需要安装
//  * 1. node&npm
//  * 2. npm install --save-dev gulp gulp-concat gulp-minify-css gulp-uglify gulp-strip-debug gulp-react gulp-browserify
//  *
//  * gulp 教程:http://www.smashingmagazine.com/2014/06/11/building-with-gulp/
//  */
'use strict';
var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var react = require('gulp-react'),
    watch = require('gulp-watch');
// var browserify = require('gulp-browserify');

gulp.task('sass', function () {
    return gulp.src('src/css/sass/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('src/css/css'));
  });
   
gulp.task('sass:watch', function () {
    gulp.watch('src/css/sass/*.scss', ['sass']);
});
var allTasks = Object.keys(gulp.tasks);
console.log(allTasks);
//execute all tasks by default
gulp.task('default', allTasks);
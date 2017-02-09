var del  = require('del');
var argv = require('yargs').argv;
var gulp = require('gulp');
var gulpif  = require('gulp-if')
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var vinylPaths  = require('vinyl-paths');
var sh = require('shelljs');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyHtml = require("gulp-minify-html");
var templateCache = require('gulp-angular-templatecache');
var runSequence = require('run-sequence');
var inject = require('gulp-inject');
var merge = require('merge-stream');
var ngAnnotate = require('gulp-ng-annotate');
var imagemin = require('gulp-imagemin');//图片压缩
var order = require("gulp-order"); // 排序
var calManifest = require('gulp-cordova-app-loader-manifest');

//  编译环境(默认为生产环境)
var env = argv.p && !argv.d;
//  编译模块(默认为app)
var mod = argv.m?argv.m:'app';

var paths = {
    sass: ['./scss/**/*.scss'],
};

//  帮助说明
gulp.task('help',function () {
    console.log('   gulp build          文件打包');
    console.log('   gulp watch          文件监控打包');
    console.log('   gulp help           gulp参数说明');
    console.log('   gulp server         测试server');
    console.log('   gulp -p             生产环境（默认生产环境）');
    console.log('   gulp -d             开发环境');
});

// 生成
gulp.task('build', function(){
    runSequence(
        'clean',
        'build-comm-lib',
        'build-app-lib',
        'build-html',
        'build-js',
        'build-css',
        'build-lib-css',
        'build-lib-js',
        'build-index',
        'build-fonts',
        'build-img',
        'build-manifest'
    );
});

// 清理
gulp.task('clean', function () {
    return  gulp.src(['./www','./tmp'],{read:false})
        .pipe(clean());
});

// 生成通用库
gulp.task('build-comm-lib',function(){
    var copyBower = gulp.src([
            './bower_components/ionic/release/js/ionic.bundle.js',
            './bower_components/ionic/release/fonts/**.*',
            './bower_components/moment/min/moment.min.js',
            './bower_components/moment/locale/zh-cn.js',
            './bower_components/angular-moment/angular-moment.min.js',
            './bower_components/angular-cache/dist/angular-cache.min.js',
            './bower_components/ti-segmented-control/dist/ti-segmented-control.js',
            './bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            './bower_components/c3/c3.min.js',
            './bower_components/c3/c3.min.css',
            './bower_components/d3/d3.min.js',
            './bower_components/ngstorage/ngStorage.min.js',
            './bower_components/ionic-timepicker/dist/ionic-timepicker.bundle.min.js',
            './bower_components/ionic-date-slider/src/ionic-date-slider.js',
            './bower_components/flex-calendar/dist/flex-calendar.min.css',
            './bower_components/angular-translate/angular-translate.min.js',
            './bower_components/flex-calendar/dist/flex-calendar.js',
            './bower_components/angular-svg-round-progressbar/build/roundProgress.min.js',
            './bower_components/es6-promise/es6-promise.auto.min.js',
            './bower_components/bluebird/js/browser/blurbird.min.js',
        './bower_components/html2canvas/dist/html2canvas.js',
    ],  {base: './bower_components/'})
        .pipe(gulp.dest('./tmp/lib')); 

    var copyComm = gulp.src('./www_src/lib/**.*',{base:'./www_src/lib/'})
        .pipe(gulp.dest('./tmp/lib'));

    var buildSass = gulp.src('./scss/ionic.app.scss')
        .pipe(sass({errLogToConsole: true}))
        .pipe(minifyCss({keepSpecialComments: 0}))
        .pipe(rename('ionic.min.css'))
        .pipe(gulp.dest('./tmp/lib/ionic/'));

    return merge(copyBower,copyComm,buildSass);

});

// 生成app的lib库
gulp.task('build-app-lib',function(){
    var copyCordova =  gulp.src([
            './bower_components/ngCordova/dist/ng-cordova.min.js',
            './bower_components/cordova-app-loader/dist/CordovaAppLoader.js',
            './bower_components/cordova-app-loader/dist/CordovaPromiseFS.js'
        ],  {base: './bower_components/'}) 
        .pipe(gulp.dest('./tmp/lib')); 
    
    var copyLib = gulp.src([
            './www_src/lib/iconfont/**.css',
        ],  {base: './www_src/lib/'})
        .pipe(gulp.dest('./tmp/lib')); 

     var copyFonts = gulp.src([
            './www_src/lib/iconfont/**.*',
            '!./www_src/lib/iconfont/**.css',
            ]) 
        .pipe(gulp.dest('./www/fonts')); 

     var copyBootstrap = gulp.src([
            './www_src/bootstrap.js'])
          .pipe(gulp.dest('./www'));

    return merge(copyCordova,copyLib,copyFonts,copyBootstrap);

});

// 生成wechat的lib库
gulp.task('build-wechat-lib',function(){
    return; 
});

// 生成wechat的lib库
gulp.task('build-wechat_public-lib',function(){
    return; 
});

// 生成html
gulp.task('build-html',function(){
   return gulp.src(['./www_src/templates/*.html'])
            .pipe(gulp.dest('./tmp/html/'))
            .pipe(templateCache({standalone:true,root: 'templates/'}))
            .pipe(gulp.dest('./tmp/js/')); 
});

// 生成js
gulp.task('build-js',function(){
    return gulp.src(['./www_src/js/app.module.js',
                    './www_src/js/**/**.module.js',
                    './www_src/js/app.config.js',
                    './www_src/js/app.run.js',
                    './www_src/js/**/*.js',
                    './tmp/js/templates.js'])
            .pipe(jshint())                // 语法检查
            .pipe(jshint.reporter('default'))
            .pipe(gulp.dest('./tmp/js/')) // 拷贝临时目录
            .pipe(concat('app.js')) // 合并
            .pipe(gulpif(env,ngAnnotate())) // 处理
            .pipe(gulpif(env,rename('app.min.js'))) // 重命名
            // .pipe(gulpif(env,uglify())) // 压缩
            .pipe(gulp.dest('./www/js/')); // 拷贝最终目录
});


gulp.task('build-lib-css',function(){
    return  gulp.src([
            './tmp/lib/ionic/release/css/ionic.min.css',
            './tmp/lib/**/*.css'])
        .pipe(gulpif(env,concat('vendor.min.css'))) // 合并
        .pipe(gulpif(env,minifyCss({keepSpecialComments: 0}))) // 压缩
        .pipe(gulp.dest('./www/css/')); //拷贝最终目录
});

gulp.task('build-lib-js',function(){
    return  gulp.src([
            "./tmp/lib/jquery-1.9.1.min.js",
            "./tmp/lib/ionic/release/js/ionic.bundle.js",
            "./tmp/lib/moment/min/moment.min.js",
            "./tmp/lib/moment/local/zh-cn.js",
            "./tmp/lib/angular-moment/angular-moment.min.js",
            "./tmp/lib/**/*.js"
          ])
        .pipe(concat('vendor.min.js')) // 合并
        .pipe(gulp.dest('./www/js/')); //拷贝最终目录
});


//  生成index.html
gulp.task('build-index',function(){
    var injectIndex = gulp.src('./www_src/index.html')
              .pipe(inject(gulp.src(['./www/js/vendor.min.js','./www/js/app.min.js','./www/css/vendor.min.css','./www/css/app.min.css']),{ignorePath:'www',addRootSlash: false}))
          .pipe(gulp.dest('./www'));

    var copyManifest = gulp.src('./www_src/index.manifest')
          .pipe(gulp.dest('./www'));
    
    return merge(injectIndex,copyManifest);

 });

//  生成css
gulp.task('build-css',function(){
    return  gulp.src(['./www_src/css/*.css'])
        .pipe(gulp.dest('./tmp/css/')) // 拷贝临时目录
        .pipe(gulpif(env,concat('app.min.css'))) // 合并
        .pipe(gulpif(env,minifyCss({keepSpecialComments: 0}))) // 压缩
        .pipe(gulp.dest('./www/css/')); //拷贝最终目录
});

//  生成image
gulp.task('build-img',function(){
    return  gulp.src(['./www_src/img/**.*'])
        .pipe(gulpif(env,imagemin()))
        .pipe(gulp.dest('./www/img/')); 
});


//  生成fonts
gulp.task('build-fonts',function(){
    return  gulp.src(['./bower_components/bootstrap/fonts/**.*',
        './bower_components/ionic/release/fonts/**.*'])
        .pipe(gulp.dest('./www/fonts/')); 
});

// sass压缩
gulp.task('sass', function(done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

// js语法检查
gulp.task('lint', function() {
    return gulp.src('./www/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// 观察文件
gulp.task('watch', function() {
    gulp.watch(paths.sass, ['sass']);
});


gulp.task('build-manifest', function() {
    var options = {};
    options.load = [
        "css/vendor.min.css",
        "css/app.min.css",
        "js/vendor.min.js",
        "js/app.min.js"
    ];
    // options.root = './';
    options.prefixSplit = 'www';

  return gulp.src([
    './www/css/*.css',
    './www/js/*.js',
    './www/fonts/**.*',
    './www/img/**.*'],{base: './www/'})
    .pipe(calManifest(options))
    .pipe(gulp.dest('./www'));
});


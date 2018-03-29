/* terminal command
 *
 cnpm install --save-dev gulp del browser-sync gulp-htmlmin
 gulp-less gulp-autoprefixer gulp-make-css-url-version gulp-clean-css
 jshint gulp-jshint gulp-uglify
 gulp-imagemin gulp-cache
 gulp-rev gulp-rev-collector
 run-sequence gulp-plumber gulp-notify
 *
 */

var gulp = require('gulp');
var del = require('del'),  // 删除文件夹
    browserSync = require('browser-sync'),  // 浏览器自动刷新
    htmlmin = require('gulp-htmlmin'),  // html 压缩
    //htmlver = require('gulp-rev-append'),  // 为 html 内引用添加版本号
    less = require('gulp-less'),    // less 转换 css
    sass = require('gulp-sass'),    // sass 转换 css
    autoprefixer = require('gulp-autoprefixer'),    // css 添加浏览器私有前缀
    cssver = require('gulp-make-css-url-version'),    // 给css文件里引用url加版本号
    cssmin = require('gulp-clean-css'), // css 压缩
    // jshint = require('gulp-jshint'),    // js 校验，依赖 jshint
    concat = require('gulp-concat'),
    merge = require('merge-stream'),
    closureCompiler = require('google-closure-compiler').gulp(),
    uglify = require('gulp-uglify'),    // js 压缩
    imgmin = require('gulp-imagemin'),  // image 压缩
    cache = require('gulp-cache'),  // 缓存管理，提高图片第二次压缩的速度
    rev = require('gulp-rev'),  // 版本管理
    revCollector = require('gulp-rev-collector'),
    //useref = require('gulp-useref'),  // 合并 html 内引用的 css、js
    //revReplace = require('gulp-rev-replace'),
    //gulpIf = require('gulp-if'),  // gulp 内if判断
    runSequence = require('run-sequence'),  // 顺序执行
    plumber = require('gulp-plumber'),  // 处理管道崩溃问题
    notify = require('gulp-notify');  // 报错与不中断当前任务

var appName = 'reading',
	baseDir = './',
    // appDir = './'
	appDir = baseDir + appName + '/'

// 静态服务器
gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: appDir,
            index: "index.html"
        }
    });
});

gulp.task('less', function () {
    return gulp.src(appDir+'less/*.less')
    //如果less文件中有语法错误，用notify插件报错，用plumber保证任务不会停止
        .pipe(plumber({
            errorHandler: notify.onError('Error:<%= error.message %>;')
        }))
        .pipe(less())
        .pipe(gulp.dest(appDir+'css'));
});
gulp.task('sass', function () {
    return gulp.src(appDir+'sass/*.scss')
        .pipe(plumber({
            errorHandler: notify.onError('Error:<%= error.message %>;')
        }))
        .pipe(sass())
        .pipe(gulp.dest(appDir+'css'));
});

gulp.task('watch', ['sass', 'browser-sync'], function () {
    gulp.watch(appDir+'sass/*.scss', ['sass']);

    // 通过 browserSync 控制浏览器自动刷新
    var reload = browserSync.reload;
    gulp.watch(appDir+'css/*.css').on('change', reload);
    gulp.watch(appDir+'js/*.js').on('change', reload);
    gulp.watch(appDir+'*.html').on('change', reload);
    gulp.watch(appDir+'*.htm').on('change', reload);
});

/*----- 分割线（上：部署开发环境；下：部署生产环境） -----*/

gulp.task('img', function () {
    return gulp.src(appDir+'images/**/*.+(png|jpg|gif|svg|mp4)')
        .pipe(cache(imgmin({
            interlaced: true
        })))
        .pipe(gulp.dest(appDir+'dist/images'));
});

gulp.task('copy', function () {
    var sourceFiles = ['/fonts/*', 'src/lib/*'];
    var destination = 'dist';

    return gulp.src(sourceFiles, {base: 'src'})
        .pipe(gulp.dest(destination));
});

gulp.task('css', function () {
    var optionsPrefixer = {
        browsers: ['Android >= 2.2', 'iOS >= 6'],
        cascade: true,  //是否美化属性值 默认：true
        remove: true    //是否去掉不必要的前缀 默认：true
    };
    var optionsCssmin = {
        advanced: true,    //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
        compatibility: '*',   //保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
        keepBreaks: false,   //类型：Boolean 默认：false [是否保留换行]
        keepSpecialComments: '*'    //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
    };

    return gulp.src(appDir+'css/*.css')
        .pipe(autoprefixer(optionsPrefixer))
        .pipe(cssmin(optionsCssmin))
        .pipe(cssver()) //给css文件里引用文件加版本号（文件MD5）
        .pipe(rev())
        .pipe(gulp.dest(appDir+'dist/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(appDir+'dist/rev/css'));
});

gulp.task('js', function () {
    /* 
        appDir+'js/vendor/swiper.jquery.min.js',    // swiper插件
        appDir+'js/vendor/swiper.animate1.0.2.min.js',   //swiper animate 插件
        ,appDir+'js/vendor/common.js' //微信插件
    */
	var vendor = gulp.src([appDir+'js/vendor/jquery-3.1.0.min.js',])
        // .pipe(jshint())
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest(appDir+'dist/js'))
    var app = gulp.src(appDir+'js/app.js')
	  //   .pipe(closureCompiler({
			// compilation_level: 'SIMPLE',
			// warning_level: 'VERBOSE',
			// language_in: 'ECMASCRIPT5_STRICT',
			// language_out: 'ECMASCRIPT5_STRICT',
			// output_wrapper: '(function(){\n%output%\n}).call(this)',
			// js_output_file: 'app.min.js'
   //      }))
        .pipe(babel({
            presets: ['env']
        }))
    	.pipe(gulp.dest(appDir+'dist/js'))
        return merge(vendor,app)
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(appDir+'dist/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(appDir+'dist/rev/js'));
});

gulp.task('html', function () {
    var options = {
        removeComments: true,   //清除HTML注释
        collapseWhitespace: true,   //压缩HTML
        collapseBooleanAttributes: true,    //省略布尔属性的值 <input checked="true"/> ==> <input checked />
        removeEmptyAttributes: true,    //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,   //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,    //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };

    return gulp.src([appDir+'dist/rev/**/*.json', appDir+'*.html',appDir+'*.htm'])
        .pipe(revCollector())
        .pipe(htmlmin(options))
        .pipe(gulp.dest(appDir+'dist'));
});

gulp.task('clean', function () {
    del(appDir+'dist');
    return cache.clearAll();
});
gulp.task('clean:dist', function () {
    del([appDir+'dist/**/*', '!'+appDir+'dist/images', '!'+appDir+'dist/images/**/*']);
});

gulp.task('build', function () {
    runSequence(
        'clean:dist',
        ['sass','img'],
        ['css', 'js'],
        'html')
});

gulp.task('default', ['watch']);
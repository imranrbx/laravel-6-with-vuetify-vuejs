const mix = require('laravel-mix');
const WebpackDeployFtp = require('webpack-deploy-ftp');
const FtpUpload = require('./uploadFtp');
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */
mix.js('resources/js/app.js', 'public/js')
   .sass('resources/sass/app.scss', 'public/css');
const config = {
	    user: "perfectw",
	    // Password optional, prompted if none given
	    password: "#ZXC9434691#",
	    host: "ftp.perfectwebsolutions.info",
	    port: 21,
	    localRoot: __dirname,
	    remoteRoot: "/public_html/myapp/",
	    // include: ["*", "**/*"],      // this would upload everything except dot files
	    include: ["app/**","public/**"],
	    // e.g. exclude sourcemaps, and ALL files in node_modules (including dot files)
	    exclude: ["vendor/**","vendor/**/.*","dist/**/*.map", "node_modules/**", "node_modules/**/.*", ".git/**"],
	    // delete ALL existing files at destination before uploading, if true
	    deleteRemote: false,
	    // Passive mode is forced (EPSV command is not sent)
	    forcePasv: true
	}
// mix.webpackConfig({
// 	plugins: [
// 		 new FtpUpload(config),
//    ]
// });
mix.browserSync("laravue.test");
// const connect = {
// 	        host : 'ftp.perfectwebsolutions.info',
// 	        port : '21', 
// 	        user : 'perfectw', 
// 	        password : '#ZXC9434691#',
// 	        secure: false,
// 	        secureOptions: undefined,
// 	        connTimeout: 5000,
// 	        pasvTimeout: 10000,
// 	        keepalive: 10000
// 	    }

// mix.webpackConfig({
// 	plugins: [
// 		new WebpackDeployFtp({
// 	    dir: './app',
// 	    remoteDir : '/public_html/myapp/app',
// 	    console: false, 
// 	    connect : connect
// 	 })
//    ]
// });



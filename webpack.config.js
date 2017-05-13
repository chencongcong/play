const path = require('path');
const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const publicPath = '/asset/';

module.exports = {
	entry: "./src/js/index.js",
	output: {
		path:path.resolve(__dirname,'./dist/'),
		filename: "js/bundle.js",
		publicPath:publicPath
	},

    module: {
        rules: [
			{
				test: /\.json$/,
				use: 'json-loader'
			},
	        {
	            test: /\.scss$/,
	            use: [{
	                loader: "style-loader" // creates style nodes from JS strings 
	            }, {
	                loader: "css-loader" // translates CSS into CommonJS 
	            }, {
	                loader: "sass-loader" // compiles Sass to CSS 
	            }]
	        },
	        {
	        	test: /\.js$/,
	        	exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
					  presets: ['env','es2015']
					}
				}
	        }
        ]
    },
    plugins:[
		new webpack.DefinePlugin({
	        'process.env.NODE.ENV': "development"
	    }),
	    new webpack.HotModuleReplacementPlugin(),
	    new BrowserSyncPlugin(
	      {
	        host: 'localhost',
	        port: 3000,
	        proxy: 'http://localhost:3100/'
	      },
	      {
	        reload: false
	      }
	    ),
	    new HtmlWebpackPlugin({
	    	title: 'My App test1',
      		filename: 'views/app.html',
      		template: './src/views/index.html',
      		minify:false,
      		hash:true

	    })
    ],

    devServer:{
    	// contentBase:'./',
    	publicPath:publicPath,
    	historyApiFallback:true,
		hot:true,
		inline:true,
		noInfo: true,
        quiet: true,
        stats: {
            cached: false,
            colors: true
        }
    }

};
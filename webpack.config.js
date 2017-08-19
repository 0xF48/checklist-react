var webpack = require("webpack");
var path = require('path')
var V8LazyParseWebpackPlugin = require('v8-lazy-parse-webpack-plugin');
const ENV = process.env.NODE_ENV || 'development';
console.log('env: ',ENV);

var cfg = {
	devtool: 'source-map',
	module: {
		loaders: [
			{ test: /\.json$/, loader: 'json-loader'},
			{ test: /\.coffee$/, loader: "coffee-loader" },
			{ test: /\.(xml|html|txt|md|svg|glsl)$/, loader: "raw" },
			{ test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' },
			{ test: /\.css$/, loader: 'style-loader!css-loader!postcss-loader' },
		]
	},


	entry: {
		main: __dirname+"/client-source/app.coffee",
		// main:[/*"babel-polyfill", */__dirname+"/client-source/jobbot-client.coffee"],
		// vendor: [
		// 	"gsap/src/minified/TweenMax.min.js",
		// 	"gsap/src/minified/easing/EasePack.min.js",			
		// ],
	},
	resolve: {
		"alias": {
			"intui" : __dirname+"/client-source/lib/intui",
			// "react" : "preact-compat",
			// "react-dom": "preact-compat",
			"re": "preact",
		}
	},

	output: {
		path: __dirname+'/client-static',
		publicPath: __dirname+'/client-static',
		filename: "[name].bundle.js"
	},
	plugins: [
		new webpack.DefinePlugin({
		   'process.env.NODE_ENV': JSON.stringify(ENV)
		}),
		// new webpack.ProvidePlugin({
		// 	re: "preact",
		// }),
		// new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js")
	].concat(ENV==='production' ? [
		new V8LazyParseWebpackPlugin(),
		new webpack.optimize.UglifyJsPlugin({
		 	output: {
		 		comments: false
			},
			compress: {
				warnings: false,
				conditionals: true,
				unused: true,
				comparisons: true,
				sequences: true,
				dead_code: true,
				evaluate: true,
				if_return: true,
				join_vars: true,
				negate_iife: false
			}
		})
	]: []),
	devServer: {
		host : '192.168.1.6',
		inline: true,
		port: 5293,
		host: 'localhost',
		colors: true,
		publicPath: '/',
		contentBase: __dirname+'/client-static',
		historyApiFallback: true,
		open: true,
	}
}



module.exports = cfg;

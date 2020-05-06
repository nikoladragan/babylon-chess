const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
	entry: {
		"script": "./src/js/script.js",
	},
	output: {
		path: path.join(__dirname, "./dist/"),
		filename: "js/[name].js"
	},
	module: {
		rules: [
			{
				test: /\.(js)$/,
				enforce: "pre",
				use: [
					{
						options: {
							eslintPath: require.resolve("eslint")
						},
						loader: require.resolve("eslint-loader")
					}
				],
				exclude: /node_modules/
			},
			{
				test: path.join(__dirname),
				loader: "babel-loader"
			}
		]
	},
	mode: "production",
	plugins: [
		new CopyPlugin([
			{ from: "./src/models/*.gltf", to: "models/[name].[ext]" },
			{ from: "./src/index.html", to: "" },
			{ from: "./src/js/babylon.js", to: "js/libs/babylon.js" },
			{ from: "./src/js/babylonjs.loaders.js", to: "js/libs/babylon.loaders.js" },
		]),
	],
	performance: {
		maxAssetSize: 10000000
	},
	devServer: {
		// open: true,
		contentBase: path.join(__dirname, "dist"),
		compress: true,
		port: 1234,
		host: "0.0.0.0"
	}
};

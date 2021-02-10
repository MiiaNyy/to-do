const currentTask = process.env.npm_lifecycle_event;
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
    // defaults to ./src, Here the application starts executing and webpack starts bundling
    entry: "./src/scripts/index.js",
    output: {
        // the filename template for entry chunks, voi olla mikä tahansa
        filename: "bundle.js",
        // the target directory for all output files
        // must be an absolute path (use the Node.js path module)
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [],
    mode: 'development',
    //Jos käytät serveriä
    devServer: {
        port: 8080,
        contentBase: path.resolve(__dirname, 'dist'),
        hot: true
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        }, ],
    }
}



if(currentTask === "build") {
    config.mode = "production";
    config.module.rules[0].use[0] = MiniCssExtractPlugin.loader;
    config.plugins.push(new MiniCssExtractPlugin({filename: 'main.css'}))
}

module.exports = config;


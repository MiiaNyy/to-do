const path = require('path');

module.exports = {
    // defaults to ./src, Here the application starts executing and webpack starts bundling
    entry: "./src/index.js",
    output: {
        // the filename template for entry chunks, voi olla mikä tahansa
        filename: "bundle.js",
        // the target directory for all output files
        // must be an absolute path (use the Node.js path module)
        path: path.resolve(__dirname, 'dist')
    },
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
        }],
    }

}
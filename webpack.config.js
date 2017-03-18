const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'mm',
        libraryTarget: 'var'
    },
    devtool: 'source-map',
    // externals: {
    //     'sp-pnp-js': '$pnp',
    //     lodash: '_',
    // },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: [/node_modules/],
            use: [{
                loader: 'babel-loader',
            }],
        }],
    },
};
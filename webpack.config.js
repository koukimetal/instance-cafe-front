module.exports = {
    entry: './src/Main/main.js',
    output: {
        path: './bin',
        filename: 'app.bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets:['es2015', 'react']
            }
        }]
    }
};
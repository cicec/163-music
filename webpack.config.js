const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: {
        index: './src/index/index.js',
        admin: './src/admin/index.js',
        song: './src/song/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js',
        publicPath: './'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader'
            }]
        }, {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        'stage-0'
                    ]
                }
            }
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            path: 'dist',
            filename: 'index.html',
            template: './src/index/index.html',
            chunks: ['index'],
        }),
        new HtmlWebpackPlugin({
            path: 'dist',
            filename: 'song.html',
            template: './src/song/index.html',
            chunks: ['song'],
        }),
        new HtmlWebpackPlugin({
            path: 'dist',
            filename: 'admin.html',
            template: './src/admin/index.html',
            chunks: ['admin'],
        })
    ],
}
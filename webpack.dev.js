const path = require('path')
const { resolve } = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: {
        index: [
            'webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/only-dev-server',
            './index/index.js',
        ],
        admin: [
            'webpack-dev-server/client?http://localhost:8080/admin.html',
            'webpack/hot/only-dev-server',
            './admin/index.js',
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js',
        publicPath: '/'
    },
    context: resolve(__dirname, 'src'),
    devtool: 'inline-source-map',
    devServer: {
        hot: true,
        contentBase: resolve(__dirname, 'dist'),
        publicPath: '/'
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
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({
            path: 'dist',
            filename: 'index.html',
            template: './index/index.html',
            chunks: ['index'],
        }),
        new HtmlWebpackPlugin({
            path: 'dist',
            filename: 'admin.html',
            template: './admin/index.html',
            chunks: ['admin'],
        })
    ],
}
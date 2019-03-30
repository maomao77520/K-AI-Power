const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
module.exports = {
    // 插件项
    plugins: [

        /*new CommonsChunkPlugin('common'),*/
        new ExtractTextPlugin('css/[name].css'),
        new CopyWebpackPlugin([{
            from: __dirname + '/lib',
            to: __dirname + '/dist/lib'
        }, {
            from: __dirname + '/page',
            to: __dirname + '/dist/page'
        }])
    ],
    // 页面入口文件配置
    entry: {
        index: './js/index.js',
        detail: './js/detail.js',
        list: './js/list.js',
        charge: './js/charge.js',
        user: './js/user.js',
        record: './js/record.js',
        favourite: './js/favourite.js',
        progress: './js/progress.js',
        qrcode: './js/qrcode.js'
    },
    // 入口文件输出配置
    output: {
        path: __dirname + '/dist',
        filename: 'js/[name].js',
        publicPath: '../'
    },
    module: {
        // 加载器配置
        rules: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [
                    "css-loader",
                    "postcss-loader"
                ]
            })
        }, {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [
                    "css-loader",
                    "postcss-loader",
                    "sass-loader"
                ]
            })
        }, {
            test: /\.(png|jpg|jpeg)$/,
            use: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
        }]
    },
    resolve: {

    },
    externals: {
        jquery: 'jQuery'
    }
};

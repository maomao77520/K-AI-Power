const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = require('./config.js');
const path = require('path');
let pages = config.pages;
let hbsHtmlWebpackPlugins = [];

for (let i = 0; i < pages.length; i++) {

    let subJs = '../js/';
    let js = config.js.concat(subJs + pages[i] + '.js');

    let subCss = '../css/';
    let css = config.css.concat(subCss + pages[i] + '.css');

    hbsHtmlWebpackPlugins.push(new HtmlWebpackPlugin({
        // params: config.dev,
        js: config.js,
        css: config.css,
        prejs: config.prejs,
        filename: path.join('page', pages[i] + '.html'),
        inject: 'body',
        template: path.join(__dirname, 'page', pages[i] + '.html'),
        chunks: [pages[i]]
    }));
}

module.exports = {
    // 插件项
    plugins: [
        new ExtractTextPlugin('css/[name]-[chunkhash:8].css'),
        new CopyWebpackPlugin([{
            from: __dirname + '/lib',
            to: __dirname + '/dist/lib'
        }, {
            from: __dirname + '/page',
            to: __dirname + '/dist/page'
        }]),
        new webpack.DefinePlugin({
            __ENV: JSON.stringify(process.env.NODE_ENV || 'pro') 
        })
    ].concat(hbsHtmlWebpackPlugins),
    // 页面入口文件配置
    entry: (function() {
        let obj = {};
        for (let i = 0; i < pages.length; i++) {
            let base = pages[i];
            obj[base] = path.join(__dirname, 'js', base)
        }
        return obj;
    })(),
    // 入口文件输出配置
    output: {
        path: __dirname + '/dist',
        filename: 'js/[name]-[chunkhash:8].js',
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

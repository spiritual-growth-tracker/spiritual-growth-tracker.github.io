const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Check if we're building for GitHub Pages
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: {
        app: [
            'jquery',
            'bootstrap',
            'flatpickr',
            'chart.js',
            './assets/src/js/app.js',
            './assets/src/css/styles.css',
            'bootstrap/dist/css/bootstrap.min.css',
            'bootstrap-icons/font/bootstrap-icons.css',
            'flatpickr/dist/flatpickr.min.css'
        ]
    },
    output: {
        filename: 'js/[name].[contenthash].js',
        path: path.resolve(__dirname, 'assets/dist'),
        clean: true,
        // Adjust publicPath based on deployment environment
        publicPath: isGitHubPages ? '/spiritual-growth-tracker/' : '/',
        hotUpdateChunkFilename: 'js/hot/[id].[fullhash].hot-update.js',
        hotUpdateMainFilename: 'js/hot/[fullhash].hot-update.json'
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'assets/dist'),
            publicPath: '/',
        },
        compress: true,
        port: 8080,
        hot: true,
        devMiddleware: {
            publicPath: '/',
            writeToDisk: true,
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
        }
    },
    optimization: {
        minimize: process.env.NODE_ENV === 'production',
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                    compress: {
                        drop_console: true,
                    },
                },
                extractComments: false,
            }),
            new CssMinimizerPlugin(),
        ],
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: process.env.NODE_ENV === 'production' 
                            ? MiniCssExtractPlugin.loader 
                            : 'style-loader',
                        options: {
                            esModule: true,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css'
        }),
        new HtmlWebpackPlugin({
            template: 'assets/src/index.html',
            filename: 'index.html',
            inject: true,
            minify: process.env.NODE_ENV === 'production'
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: 'assets/src/images/icons',
                    to: 'images/icons'
                }
            ]
        })
    ]
}; 
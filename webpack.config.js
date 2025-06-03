const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const webpack = require('webpack');
const fs = require('fs');

// Check if we're building for GitHub Pages
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

// Function to check if directory exists
const directoryExists = (dirPath) => {
    try {
        return fs.existsSync(dirPath);
    } catch (err) {
        return false;
    }
};

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    const publicPath = isGitHubPages ? '/dailyinventory.github.io/' : '/';
    const imagesDir = path.resolve(__dirname, 'assets/images');

    return {
        mode: isProduction ? 'production' : 'development',
        entry: {
            app: ['./assets/js/app.js'],
            vendor: ['./assets/js/vendor.js']
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'assets/js/[name].bundle.js',
            chunkFilename: 'assets/js/[name].[chunkhash].bundle.js',
            publicPath: publicPath
        },
        devServer: {
            static: {
                directory: path.join(__dirname, 'dist'),
            },
            compress: true,
            port: 8080,
            hot: true,
            devMiddleware: {
                writeToDisk: true
            }
        },
        optimization: {
            minimize: isProduction,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        format: {
                            comments: false,
                        },
                    },
                    extractComments: false,
                }),
                new CssMinimizerPlugin(),
            ],
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: 'html-loader',
                            options: {
                                minimize: isProduction,
                                sources: {
                                    list: [
                                        "...",
                                        {
                                            tag: "link",
                                            attribute: "href",
                                            type: "src",
                                        },
                                        {
                                            tag: "img",
                                            attribute: "src",
                                            type: "src",
                                        },
                                        {
                                            tag: "script",
                                            attribute: "src",
                                            type: "src",
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader'
                    ]
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/images/[name][ext]'
                    }
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/fonts/[name][ext]'
                    }
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: 'assets/css/[name].bundle.css',
                chunkFilename: 'assets/css/[id].bundle.css'
            }),
            new CopyWebpackPlugin({
                patterns: [
                  {
                    from: imagesDir,
                    to: path.resolve(__dirname, 'dist/assets/images'),
                    globOptions: {
                        ignore: ['**/.DS_Store']
                    },
                    noErrorOnMissing: true
                  },
                  {
                    from: path.resolve(__dirname, 'manifest.json'),
                    to: path.resolve(__dirname, 'dist/manifest.json'),
                    noErrorOnMissing: true
                  },
                  {
                    from: path.resolve(__dirname, 'index.html'),
                    to: path.resolve(__dirname, 'dist/index.html'),
                    noErrorOnMissing: true
                  }
                ]
            })
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'assets')
            }
        }
    };
}; 
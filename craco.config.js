const path = require('path');

// Safely get git commit hash, fallback to 'unknown' if not available
const getGitCommitHash = () => {
  try {
    const gitRevSync = require('git-rev-sync');
    return gitRevSync.short();
  } catch (error) {
    return 'unknown';
  }
};

module.exports = {
  webpack: {
    configure: (webpackConfig, { env }) => {
      // Only modify output for production builds
      if (env === 'production') {
        // Set output directory to 'dist' only for production
        webpackConfig.output.path = path.resolve(__dirname, 'dist');

        // Set public path for GitHub Pages user/organization site
        webpackConfig.output.publicPath = '/';

        // Customize the output path for JS files
        webpackConfig.output.filename = 'assets/js/[name].[contenthash:8].js';
        webpackConfig.output.chunkFilename = 'assets/js/[name].[contenthash:8].chunk.js';

        // Find and modify the MiniCssExtractPlugin configuration
        const miniCssExtractPlugin = webpackConfig.plugins.find(
          (plugin) => plugin.constructor.name === 'MiniCssExtractPlugin'
        );

        if (miniCssExtractPlugin) {
          miniCssExtractPlugin.options.filename = 'assets/css/[name].[contenthash:8].css';
          miniCssExtractPlugin.options.chunkFilename = 'assets/css/[name].[contenthash:8].chunk.css';
        }
      }

      // Add a custom plugin to inject git commit hash (for both dev and prod)
      const { DefinePlugin } = require('webpack');
      webpackConfig.plugins.push(
        new DefinePlugin({
          'process.env.GIT_COMMIT_HASH': JSON.stringify(getGitCommitHash()),
        })
      );

      return webpackConfig;
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    hot: true,
  },
};

import fs = require('node:fs');
import path = require('node:path');
import dotenv = require('dotenv');
import HtmlWebpackPlugin = require('html-webpack-plugin');
import TerserPlugin = require('terser-webpack-plugin');
import ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
import MiniCssExtractPlugin = require('mini-css-extract-plugin');
import Mustache = require('mustache');
import CompressionPlugin = require('compression-webpack-plugin');
import LoadablePlugin from '@loadable/webpack-plugin';
import { Configuration, DefinePlugin, ProgressPlugin, HotModuleReplacementPlugin } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import 'webpack-dev-server';


dotenv.config();
const isDev = process.env.NODE_ENV === 'development';
const webpackProdConfig: Configuration = {
  mode: isDev ? 'development' : 'production',
  target: 'web',
  entry: {
    app: path.resolve(__dirname, '../src/app.tsx'),
  },
  output: {
    path: isDev ? path.join(__dirname, '../build') : path.join(__dirname, '../dist'),
    publicPath: '/',
    filename: 'public/js/[contenthash].js',
    chunkFilename: 'public/js/[chunkhash].js',
    assetModuleFilename: 'public/asset/[contenthash][ext]',
  },
  optimization: {
    minimize: !isDev,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: !isDev,
          },
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [process.env.NODE_ENV === 'development' && 'react-refresh/babel'].filter(
                Boolean,
              ),
            },
          },
          'shebang-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(md)$/,
        use: 'raw-loader',
      },
      {
        test: /\.(png|jpg|jpeg|webp|mp4|webm|svg|gif|eot|otf|ttf|woff|woff2)$/,
        type: 'asset',
      },
      // {
      //   test: /\.(png|jpg|jpeg|webp)$/,
      //   use: [
      //     {
      //       loader: ImageMinimizerPlugin.loader,
      //       options: {
      //         minimizer: {
      //           implementation: ImageMinimizerPlugin.imageminMinify,
      //           options: {
      //             type: 'asset',
      //             plugins: [
      //               ['jpegtran', { progressive: true }],
      //               ['mozjpeg', { quality: 90 }],
      //               ['optipng', { optimizationLevel: 5 }],
      //               ['pngquant', { quality: [0.6, 0.8] }],
      //             ],
      //           },
      //         },
      //       },
      //     },
      //   ],
      // },
    ],
  },
  plugins: [
    /**
     * Development and production plugins
     */
    new HotModuleReplacementPlugin(),
    new ProgressPlugin(),
    new LoadablePlugin({
      filename: '/public/loadable-stats.json',
    }) as any,
    new DefinePlugin({
      SC_DISABLE_SPEEDY: process.env.SC_DISABLE_SPEEDY === 'true', // Set as true to disable CSSOM for Yandex Webvisor
    }),
    new MiniCssExtractPlugin({
      filename: 'public/css/[contenthash].css',
      chunkFilename: 'public/css/[contenthash].css',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE ? 'server' : 'disabled',
      openAnalyzer: true,
    }),
    ...(isDev
      ? /**
         * Development only plugins
         */
        [
          new ReactRefreshWebpackPlugin({
            overlay: false,
          }),
          new HtmlWebpackPlugin({
            templateContent: Mustache.render(
              fs.readFileSync(path.resolve(__dirname, '../src/assets/index.mustache'), {
                encoding: 'utf8',
              }),
              {
                /**
                 * Compile preloadedState data as Base64 string
                 */
                preloadedStatesBase64: Buffer.from(
                  JSON.stringify({
                    RELAY: {},
                    REDUX: {
                      server: {
                        graphqlEndpoint: process.env.GRAPHQL_ENDPOINT,
                        subscriptionEndpoint: process.env.GRAPHQL_SUBSCRIPTION,
                      },
                    },
                  }),
                ).toString('base64'),
              },
            ),
          }),
        ]
      : /**
         * Production only plugins
         */
        [
          new HtmlWebpackPlugin({
            excludeChunks: ['app'], // exclude main entypoint
            templateContent: fs.readFileSync(
              path.resolve(__dirname, '../src/assets/index.mustache'),
              {
                encoding: 'utf8',
              },
            ),
            filename: path.resolve(__dirname, '../dist/server/index.mustache'),
            minify: {
              caseSensitive: true,
              collapseWhitespace: true,
              keepClosingSlash: true,
              removeComments: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: true,
            },
          }),
          new CompressionPlugin({
            filename: '[path][base].br',
            algorithm: 'brotliCompress',
            exclude: [/\.mustache$/, /loadable-stats\.json$/],
            threshold: 10240,
            minRatio: 0.8,
            deleteOriginalAssets: false,
          }),
        ]),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.css'],
    alias: {
      '~': path.resolve(__dirname, '..', 'src'),
    },
  },
  devtool: isDev ? 'inline-source-map' : false,
  devServer: isDev
    ? {
        historyApiFallback: {
          verbose: true,
          disableDotRule: true,
        },
        hot: 'only',
        liveReload: true,
        compress: true,
        port: Number(process.env.SERVER_PORT),
        host: process.env.SERVER_HOSTNAME,
      }
    : undefined,
  performance: isDev
    ? {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      }
    : {},
};

export default webpackProdConfig;

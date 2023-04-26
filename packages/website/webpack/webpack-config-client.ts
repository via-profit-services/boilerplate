import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration, HotModuleReplacementPlugin } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { merge } from 'webpack-merge';
import LoadablePlugin from '@loadable/webpack-plugin';
import Mustache from 'mustache';
import CompressionPlugin from 'compression-webpack-plugin';
import 'webpack-dev-server';

import webpackBaseConfig from './webpack-config-base';

dotenv.config();
const isDev = process.env.NODE_ENV === 'development';
const webpackProdConfig: Configuration = merge(webpackBaseConfig, {
  target: 'web',
  entry: {
    app: path.resolve(__dirname, '../src/app.tsx'),
  },
  output: {
    path: isDev ? path.join(__dirname, '../build') : path.join(__dirname, '../dist'),
    publicPath: '/',
    filename: 'public/js/[name]-[contenthash].js',
    chunkFilename: 'public/js/[name]-[chunkhash].js',
    assetModuleFilename: 'public/assets/[name]-[contenthash][ext]',
  },
  optimization: {
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
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      // cacheGroups: {
      //   default: {
      //     test: /[\\/]node_modules[\\/]/,
      //     name: (module: any) => {
      //       const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

      //       return `vandor-${packageName}`;
      //     },
      //   },
      // },
    },
  },
  plugins: [
    /**
     * Development and production plugins
     */
    new LoadablePlugin({
      filename: '/public/loadable-stats.json',
    }) as any,
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE ? 'server' : 'disabled',
      openAnalyzer: true,
    }),
    ...(isDev
      ? /**
         * Development only plugins
         */
        [
          new HotModuleReplacementPlugin(),
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
});

export default webpackProdConfig;

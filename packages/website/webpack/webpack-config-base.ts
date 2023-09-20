import path from 'node:path';
import dotenv from 'dotenv';
import { Configuration, DefinePlugin, ProgressPlugin } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';

import { version } from '../package.json';

dotenv.config();
const isDev = process.env.NODE_ENV === 'development';

const webpackBaseConfig: Configuration = {
  mode: isDev ? 'development' : 'production',
  optimization: {
    minimize: !isDev,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|webp|mp4|webm|svg|gif|eot|otf|ttf|woff|woff2)$/,
        type: 'asset',
      },
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
        test: /favicon\.(png|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'public/assets/favicon.[ext]',
            },
          },
        ],
      },
      {
        test: /robots\.txt$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'public/assets/robots.txt',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ProgressPlugin(),
    // Do not inject «GRAPHQL_ENDPOINT» variables with the «DefinePlugin» plugin.
    // In this case, if you change «GRAPHQL_ENDPOINT», you will have to rebuild
    // the application again.
    new DefinePlugin({
      SC_DISABLE_SPEEDY: process.env.SC_DISABLE_SPEEDY === 'true', // Set as true to disable CSSOM for Yandex Webvisor
      'process.env.APP_VERSION': JSON.stringify(version),
    }),

    new MiniCssExtractPlugin({
      filename: 'public/css/[contenthash].css',
      chunkFilename: 'public/css/[contenthash].css',
    }),

    // new ImageMinimizerPlugin({
    //   // loader: false,
    //   minimizer: {
    //     implementation: ImageMinimizerPlugin.imageminMinify,
    //     options: {
    //       plugins: [
    //         ['imagemin-jpegtran', { progressive: true }],
    //         ['imagemin-mozjpeg', { quality: 85 }],
    //         ['imagemin-optipng', { optimizationLevel: 5 }],
    //         ['imagemin-pngquant', { quality: [0.6, 0.8] }],
    //       ],
    //     },
    //   },
    //   generator: [
    //     {
    //       // You can apply generator using `?as=webp`, you can use any name and provide more options
    //       preset: 'webp',
    //       implementation: ImageMinimizerPlugin.imageminGenerate,
    //       options: {
    //         // Please specify only one plugin here, multiple plugins will not work
    //         plugins: ['imagemin-webp'],
    //       },
    //     },
    //   ],
    // }),
  ],

  resolve: {
    preferRelative: true,
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
    mainFields: ['browser', 'jsnext:main', 'main'],
    alias: {
      '~': path.resolve(__dirname, '..', 'src'),
    },
  },
};

export default webpackBaseConfig;

import path = require('node:path');
import dotenv = require('dotenv');
import MiniCssExtractPlugin = require('mini-css-extract-plugin');
import { Configuration, ProgressPlugin } from 'webpack';

dotenv.config();
const isDev = process.env.NODE_ENV === 'development';

const webpackServerConfig: Configuration = {
  target: 'node',
  mode: isDev ? 'development' : 'production',
  entry: {
    index: path.resolve(__dirname, '../src/server/index.ts'),
  },
  output: {
    path: isDev ? path.join(__dirname, '../build') : path.join(__dirname, '../dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: 'server/js/[name].chunk.[chunkhash].js',
    assetModuleFilename: 'server/asset/[contenthash][ext]',
  },
  optimization: {
    minimize: !isDev,
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
        test: /\.(md)$/,
        use: 'raw-loader',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.css'],
    alias: {
      '~': path.resolve(__dirname, '..', 'src'),
    },
  },
  plugins: [
    new ProgressPlugin(),
    new MiniCssExtractPlugin({
      filename: 'public/css/[contenthash].css',
      chunkFilename: 'public/css/[contenthash].css',
    }),
  ],
};

export default webpackServerConfig;

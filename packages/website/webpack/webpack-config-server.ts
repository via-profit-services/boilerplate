import path from 'node:path';
import dotenv from 'dotenv';
import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';

import webpackBaseConfig from './webpack-config-base';

dotenv.config();
const isDev = process.env.NODE_ENV === 'development';

const webpackServerConfig: Configuration = merge(webpackBaseConfig, {
  target: 'node',
  entry: {
    index: path.resolve(__dirname, '../src/server/index.ts'),
  },
  output: {
    path: isDev ? path.join(__dirname, '../build') : path.join(__dirname, '../dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: 'server/js/[name].chunk.[chunkhash].js',
    assetModuleFilename: 'public/assets/[contenthash][ext]',
  },
  optimization: {
    // minimize: !isDev,
    minimize: false,
  },
  node: {
    __filename: true,
    __dirname: false,
  },
});

export default webpackServerConfig;

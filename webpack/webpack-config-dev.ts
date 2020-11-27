import NodemonPlugin from 'nodemon-webpack-plugin';
import path from 'path';
import { Configuration, WebpackPluginInstance } from 'webpack';
import { merge } from 'webpack-merge';

import webpackBaseConfig from './webpack-config-base';

const webpackDevConfig: Configuration = merge(webpackBaseConfig,{
  entry: {
    index: path.resolve(__dirname, '../src/index.ts'),
    playground: path.resolve(__dirname, '../src/playground/index.ts'),
  },
  output: {
    path: path.join(__dirname, '../build/'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new NodemonPlugin({
      script: path.resolve(__dirname, '../build/playground.js'),
      watch: [path.resolve(__dirname, '../build')],
      verbose: true,
    }) as WebpackPluginInstance,
  ],
});

export default webpackDevConfig;

import ViaProfitPlugin from '@via-profit-services/core/dist/webpack-plugin';
import fs from 'fs-extra';
import path from 'path';
import { BannerPlugin, Configuration, Compiler } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';

import packageInfo from '../package.json';
import webpackbaseConfig from './webpack-config-base';

const webpackProdConfig: Configuration = merge(webpackbaseConfig, {
  optimization: {
    minimize: false,
  },
  entry: {
    index: path.resolve(__dirname, '../src/index.ts'),
  },
  output: {
    path: path.join(__dirname, '../dist/'),
    libraryTarget: 'commonjs2',
    filename: '[name].js',
  },
  mode: 'production',
  plugins: [
    new BundleAnalyzerPlugin({
      openAnalyzer: true,
      analyzerMode: process.env.ANALYZE ? 'server' : 'disabled',
    }),
    new ViaProfitPlugin(),
    new BannerPlugin({
      banner: `
Via Profit services / legal-entity

MIT
Repository ${packageInfo.repository.url}
Contact    ${packageInfo.support}
      `,
    }),
    {
      apply: (compiler: Compiler) => {
        compiler.hooks.beforeRun.tapAsync('WebpackBeforeBuild', (_, callback) => {
          fs.rmdirSync(path.resolve(__dirname, '../dist/'), { recursive: true });
          callback();
        });

        compiler.hooks.afterEmit.tapAsync('WebpackAfterBuild', (_, callback) => {

          fs.copySync(
            path.resolve(__dirname, '../src/schema.graphql'),
            path.resolve(__dirname, '../dist/schema.graphql'),
          );

          callback();
        });
      },
    },
  ],
  externals: [
    /^@via-profit-services\/core/,
    /^@via-profit-services\/geography/,
    /^moment-timezone$/,
    /^moment$/,
    /$uuid$/,
  ],
});


export default webpackProdConfig;

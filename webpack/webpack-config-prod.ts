import ViaProfitPlugin from '@via-profit-services/core/dist/webpack-plugin';
import fs from 'fs-extra';
import path from 'path';
import { ProgressPlugin, BannerPlugin, Configuration, Compiler } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';

import packageInfo from '../package.json';
import webpackbaseConfig from './webpack-config-base';

const webpackProdConfig: Configuration = merge(webpackbaseConfig, {
  entry: {
    index: path.resolve(__dirname, '../src/index.ts'),
    schema: path.resolve(__dirname, '../src/schema.ts'),
    // playground: path.resolve(__dirname, '../src/playground/index.ts'),
  },
  output: {
    path: path.join(__dirname, '../dist/'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  mode: 'production',
  plugins: [
    new BundleAnalyzerPlugin({
      openAnalyzer: true,
      analyzerMode: process.env.ANALYZE ? 'server' : 'disabled',
    }),
    new ViaProfitPlugin(),
    new ProgressPlugin({}),
    new BannerPlugin({
      banner: `
Via Profit services / legal-entity

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

          fs.rmdirSync(path.resolve(__dirname, '../dist/playground'), {
            recursive: true,
          });

          fs.copySync(
            path.resolve(__dirname, '../src/database/migrations/'),
            path.resolve(__dirname, '../dist/database/migrations/'),
          );

          fs.copySync(
            path.resolve(__dirname, '../src/database/seeds/'),
            path.resolve(__dirname, '../dist/database/seeds/'),
          );

          fs.copyFileSync(
            path.resolve(__dirname, '../package.json'),
            path.resolve(__dirname, '../dist/package.json'),
          );

          fs.copyFileSync(
            path.resolve(__dirname, '../README.md'),
            path.resolve(__dirname, '../dist/README.md'),
          );

          fs.copyFileSync(
            path.resolve(__dirname, '../LICENSE'),
            path.resolve(__dirname, '../dist/LICENSE'),
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

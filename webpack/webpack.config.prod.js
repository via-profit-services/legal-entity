/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs-extra');
const { ProgressPlugin, BannerPlugin } = require('webpack');
const merge = require('webpack-merge');
const ViaProfitPlugin = require('@via-profit-services/core/dist/webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const packageInfo = require('../package.json');
const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
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
    new ProgressPlugin(),
    new BannerPlugin({
      banner: `
Via Profit services / legal-entity

Repository ${packageInfo.repository.url}
Contact    ${packageInfo.support}
      `,
    }),
    {
      apply: (compiler) => {
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
    {
      '@via-profit-services/core': 'commonjs2 @via-profit-services/core',
      'moment-timezone': 'commonjs2 moment-timezone',
      moment: 'commonjs2 moment',
      uuid: 'commonjs2 uuid',
    },
    (_, request, callback) => {
      if (request.match(/^@via-profit-services\/geography\//)) {
        return callback(null, { commonjs: request });
      }

      return callback();
    },
  ],
});

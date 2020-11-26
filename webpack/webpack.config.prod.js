/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');
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
    new FileManagerPlugin({
      onStart: {
        delete: ['./dist'],
      },
      onEnd: {
        copy: [
          {
            source: './src/database/migrations/*',
            destination: './dist/database/migrations/',
          },
          {
            source: './src/database/seeds/*',
            destination: './dist/database/seeds/',
          },
          // {
          //   source: './src/schema.graphql',
          //   destination: './schema.graphql',
          // },
        ],
        delete: [
          './dist/playground',
          './dist/database/migrations/!(+([0-9])_legal-entities-*@(.ts|.d.ts))',
        ],
      },
    }),
  ],
  externals: [
    {
      '@via-profit-services/core': 'commonjs2 @via-profit-services/core',
      'moment-timezone': 'commonjs2 moment-timezone',
      'node-fetch': 'commonjs2 node-fetch',
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

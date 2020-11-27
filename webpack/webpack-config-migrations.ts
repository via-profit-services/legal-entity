import ViaProfitPlugin from '@via-profit-services/core/dist/webpack-plugin';
import fs from 'fs-extra';
import path from 'path';
import { Configuration, Compiler, Entry } from 'webpack';
import { merge } from 'webpack-merge';

import webpackbaseConfig from './webpack-config-base';

const knexCompiledDir = path.resolve(__dirname, '../dist/knex');
const knexSourceDir = path.resolve(__dirname, '../src/knex');
const migrations: Entry = {};

// get migrations
fs.readdirSync(path.resolve(knexSourceDir, 'migrations'))
  .filter((filename) => filename.match(/^[0-9]+_legal-entities-/))
  .forEach((filename) => {
    const name = path.basename(filename).replace(/\.ts$/, '');
    migrations[`migrations/${name}`] = path.resolve(path.resolve(knexSourceDir, 'migrations'), filename);
  });

const webpackProdConfig: Configuration = merge(webpackbaseConfig, {
  entry: {
    ...migrations,
    knexfile: path.resolve(__dirname, '../src/utils/knexfile.ts'),
  },
  mode: 'production',
  output: {
    path: knexCompiledDir,
    libraryTarget: 'commonjs2',
    filename: '[name].js',
  },
  plugins: [
    new ViaProfitPlugin(),
    {
      apply: (compiler: Compiler) => {
        compiler.hooks.beforeRun.tapAsync('WebpackBeforeBuild', (_, callback) => {
          fs.rmdirSync(path.resolve(__dirname, '../dist/knex'), { recursive: true });
          callback();
        });
        compiler.hooks.afterEmit.tapAsync('WebpackAfterBuild', (_, callback) => {

          // move knexfile to local dev
          fs.moveSync(
            path.resolve(knexCompiledDir, 'knexfile.js'),
            path.resolve(__dirname, '../.knex/knexfile.js'),
          );

          // make migrations for local dev
          fs.readdirSync(path.resolve(knexCompiledDir, 'migrations'))
            .filter((filename) => filename.match(/\.js$/))
            .forEach((filename) => {
              const dir = path.resolve(__dirname, '../.knex/migrations');
              if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true })
              }

              fs.copyFileSync(
                path.resolve(knexCompiledDir, 'migrations', filename),
                path.resolve(dir, filename),
              )
            })
          callback();
        });
      },
    },
  ],
  externals: [
    /^@via-profit-services\/core/,
    /^@via-profit-services\/geography/,
  ],
});


export default webpackProdConfig;

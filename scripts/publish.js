/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const shelljs = require('shelljs');

const packageJson = require('../package.json');

const files = [
  ['./package.json', './dist/package.json'],
  ['./README.md', './dist/README.md'],
  ['./LICENSE', './dist/LICENSE'],
];


console.log('');
console.log(chalk.magenta('Prepare and publish'));
console.log('');

files.forEach(([source, destination]) => {
  console.log(chalk.magenta(`Copy ${source} ->> ${destination}`));
  fs.copyFileSync(
    path.resolve(process.cwd(), source),
    path.resolve(process.cwd(), destination),
  );
});

// make git tag
console.log(chalk.yellow(`Create new git tag v${packageJson.version}`));
const makeTagRes = shelljs.exec(`git tag -a v${packageJson.version} -m "v${packageJson.version}"`).code;
if (makeTagRes !== 0) {
  process.exit(1);
}
console.log(chalk.green('Done'));


// push the tag
console.log(chalk.yellow('Push all git tags'));
const pushTagsRes = shelljs.exec('git push origin --tags').code;
if (pushTagsRes !== 0) {
  process.exit(1);
}
console.log(chalk.green('Done'));


// publish
console.log(chalk.yellow('NPM Publish'));
const publishRes = shelljs.exec(`npm publish ${path.resolve(process.cwd(), './dist')}`).code;
if (publishRes !== 0) {
  process.exit(1);
}
console.log(chalk.green('Done'));


console.log('');
console.log(chalk.green('SUCCESS'));
console.log('');
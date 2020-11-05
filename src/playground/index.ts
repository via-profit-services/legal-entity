/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import { App, schemas } from '@via-profit-services/core';
import * as geography from '@via-profit-services/geography';
import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';

import * as legalEntity from '../schemas/legal-entity';
import { configureApp } from '../utils/configureApp';

const config = configureApp({
  typeDefs: [legalEntity.typeDefs, geography.typeDefs],
  resolvers: [legalEntity.resolvers, geography.resolvers],
});
const app = new App(config);
const AuthService = schemas.auth.service;

app.bootstrap((props) => {
  const { resolveUrl, context } = props;
  if (process.env.NODE_ENV !== 'development') {
    console.log(`GraphQL server was started at ${resolveUrl.graphql}`);

    return;
  }

  console.log('');
  const authService = new AuthService({ context });
  const { accessToken } = authService.generateTokens({
    uuid: uuidv4(),
    roles: ['developer'],
  }, {
    access: 2.592e6,
    refresh: 2.592e6,
  });

  console.log(chalk.green('Your development token is:'));
  console.log(chalk.yellow(accessToken.token));
  console.log('');

  console.log('');
  console.log(chalk.green('============== Server =============='));
  console.log('');
  console.log(`${chalk.green('GraphQL server')}:     ${chalk.yellow(resolveUrl.graphql)}`);
  console.log(`${chalk.green('Auth server')}:        ${chalk.yellow(resolveUrl.auth)}`);

  console.log('');
});

import { IInitProps, configureLogger } from '@via-profit-services/core';
import dotenv from 'dotenv';
import moment from 'moment-timezone';
import path from 'path';

// project root path
const rootPath = path.join(__dirname, '..', '..');

// dotenv configuration
dotenv.config();
moment.tz.setDefault('UTC');

const serverConfig: IInitProps = {
  enableIntrospection: true,
  port: Number(process.env.PORT),
  timezone: 'UTC',
  database: {
    timezone: 'UTC',
    connection: {
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      user: process.env.DB_USER,
    },
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  },
  jwt: {
    accessTokenExpiresIn: Number(process.env.JWT_ACCESSTOKENEXPIRESIN),
    algorithm: process.env.JWT_ALGORITHM as IInitProps['jwt']['algorithm'],
    issuer: process.env.JWT_ISSUER,
    privateKey: path.resolve(rootPath, process.env.JWT_PRIVATEKEY),
    publicKey: path.resolve(rootPath, process.env.JWT_PUBLICKEY),
    refreshTokenExpiresIn: Number(process.env.JWT_REFRESHTOKENEXPIRESIN),
  },
  logger: configureLogger({
    logDir: path.resolve(rootPath, process.env.LOG),
  }),
};


const configureApp = (props?: IProps): IInitProps => {
  const { typeDefs, resolvers } = props || {};

  return {
    ...serverConfig,
    typeDefs,
    resolvers,
  };
};

interface IProps {
  typeDefs: IInitProps['typeDefs'];
  resolvers: IInitProps['resolvers'];
}

export default configureApp;
export { configureApp };

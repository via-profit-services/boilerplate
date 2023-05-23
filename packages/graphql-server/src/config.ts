import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { ApplicationConfig } from 'common';
import * as permissions from '@via-profit-services/permissions';

import { ACCESS_TOKEN_EMPTY_ID, ACCESS_TOKEN_EMPTY_UUID } from '~/utils/constants';
import { PrivilegeName } from 'users';

dotenv.config();

const isAuthorized: permissions.PermissionResolver = props => {
  const { context } = props;

  return context.token.id !== ACCESS_TOKEN_EMPTY_ID || 'Unauthorized.';
};

const isNotAuthorized: permissions.PermissionResolver = props => {
  const { context } = props;

  return context.token.auid === ACCESS_TOKEN_EMPTY_UUID
    ? true
    : 'The «Authorized» header should NOT be passed for this method';
};

const hasPrivilege: (privileges: PrivilegeName[]) => permissions.PermissionResolver =
  privileges => props => {
    const { context } = props;
    const { token } = context;

    return token.privileges.some(p => privileges.includes(p));
  };

// .env required variables
const envNames = [
  'DEBUG',
  'GRAPHQL_PORT',
  'GRAPHQL_HOST',
  'GRAPHQL_ENDPOINT',
  'GRAPHQL_SUBSCRIPTIONS',
  'FILE_STORAGE_HOSTNAME',
  'FILE_STORAGE_STATIC_PATH',
  'FILE_STORAGE_CACHE_PATH',
  'IMAGE_MAGICK_BIN_PATH',
  'DB_HOST',
  'DB_USER',
  'DB_NAME',
  'DB_PASSWORD',
  'REDIS_HOST',
  'REDIS_PORT',
  'REDIS_PASSWORD',
  'REDIS_DB',
  'JWT_PUBLIC_KEY_PATH',
  'JWT_PRIVATE_KEY_PATH',
  'JWT_ALGHORITM',
  'ACCESS_TOKEN_EXPIRES_IN',
  'LOG_DIR',
];

// Checks for variables in .env
envNames.forEach(envName => {
  if (process.env[envName] === undefined) {
    console.error('\x1b[31m%s\x1b[0m', 'Configuration error');
    console.error('\x1b[31m%s\x1b[0m', `Variable «${envName}» does not found in process.env`);
    console.error(
      '\x1b[31m%s\x1b[0m',
      'Make sure that the «.env» file is present in the root of the project  and it contains the required value then restart the application',
    );
    process.exit(0);
  }
});

// Check keys
[process.env.JWT_PRIVATE_KEY_PATH, process.env.JWT_PUBLIC_KEY_PATH].forEach(keyPath => {
  if (!fs.existsSync(path.resolve(keyPath))) {
    console.error('\x1b[31m%s\x1b[0m', `JWT public key does not found in ${keyPath}`);
    console.error('\x1b[31m%s\x1b[0m', 'Make sure you have generated the jwt keys');
    process.exit(1);
  }
});

const config: ApplicationConfig = {
  logs: {
    logDir: path.resolve(process.env.LOG_DIR),
  },
  port: Number(process.env.GRAPHQL_PORT),
  host: process.env.GRAPHQL_HOST,
  debug:
    process.env.DEBUG === 'false'
      ? false
      : process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development',
  endpoint: process.env.GRAPHQL_ENDPOINT,
  subscriptions: process.env.GRAPHQL_SUBSCRIPTIONS,
  jwt: {
    algorithm: process.env.JWT_ALGHORITM as ApplicationConfig['jwt']['algorithm'],
    issuer: 'boilerplate-iss',
    verifiedIssuers: ['boilerplate-iss'],
    privateKey: fs.readFileSync(path.resolve(process.env.JWT_PRIVATE_KEY_PATH)),
    publicKey: fs.readFileSync(path.resolve(process.env.JWT_PUBLIC_KEY_PATH)),
    accessTokenExpiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
    refreshTokenExpiresIn: 2.592e6, // 30 days
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    db: Number(process.env.REDIS_DB),
    maxRetriesPerRequest: 100,
    retryStrategy: times => Math.min(times * 1000, 30000),
  },
  files: {
    hostname: process.env.FILE_STORAGE_HOSTNAME,
    staticPrefix: '/static/f',
    storagePath: path.resolve(process.env.FILE_STORAGE_STATIC_PATH),
    cachePath: path.resolve(process.env.FILE_STORAGE_CACHE_PATH),
  },
  knex: {
    client: 'pg',
    connection: {
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
    },
  },
  permissions: {
    enableIntrospection: process.env.ENABLE_INTROSPECTION === 'true',
    permissions: {
      'Query.*': isAuthorized,
      // FIXME: Uncomment line below to lock Mutations
      // 'Mutation.*': isAuthorized,
      'Query.version': permissions.allow(),
      'Query.node': permissions.allow(),
      'Query.authentification': permissions.allow(),
      'AuthentificationQuery.*': isAuthorized,
      'AuthentificationQuery.verifyToken': permissions.allow(),
      'AuthentificationMutation.*': isAuthorized,
      'AuthentificationMutation.create': isNotAuthorized,
      'AuthentificationMutation.refresh': isNotAuthorized,
      'UsersQuery.list': hasPrivilege(['Users_UsersList']),

      // Unlock only Query.pages.resolve
      'Query.pages': permissions.allow(),
      'PagesQuery.*': isAuthorized,
      'PagesQuery.resolve': permissions.allow(),
    },
  },
};

export default config;

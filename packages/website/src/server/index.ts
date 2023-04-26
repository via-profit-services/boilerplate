/* eslint-disable no-console */
import dotenv from 'dotenv';
import http from 'node:http';
import path from 'node:path';
import IORedis from 'ioredis';

import routes from '~/server/routes';
import { REDIS_KEY_HTML_CACHE } from '~/server/utils/constants';

const envConfigFilename = path.resolve(process.cwd(), '.env');

const envNames = [
  'GRAPHQL_ENDPOINT',
  'GRAPHQL_SUBSCRIPTION',
  'SERVER_PORT',
  'SERVER_HOSTNAME',
  'REDIS_CACHE_EXP',
  'REDIS_HOST',
  'REDIS_PORT',
  'REDIS_PASSWORD',
  'REDIS_DB',
];

dotenv.config({ path: envConfigFilename });

// Checks for variables in .env
envNames.map(envName => {
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

const appConfig: AppConfigProduction = {
  graphqlEndpoint: process.env.GRAPHQL_ENDPOINT || '',
  subscriptionEndpoint: process.env.GRAPHQL_SUBSCRIPTION || '',
  serverHostname: process.env.SERVER_HOSTNAME || '',
  serverPort: Number(process.env.SERVER_PORT),
  redisCacheExp: Number(process.env.REDIS_CACHE_EXP),
  redisHost: process.env.REDIS_HOST || '',
  redisPassword: process.env.REDIS_PASSWORD || '',
  redisPort: Number(process.env.REDIS_PORT),
  redisDatabase: Number(process.env.REDIS_DB),
};
const server = http.createServer();
const redis = new IORedis({
  host: appConfig.redisHost,
  port: appConfig.redisPort,
  password: appConfig.redisPassword,
  db: appConfig.redisDatabase,
});

// Clear cache at first start
redis.once('connect', async () => {
  const keys = await redis.keys(`${REDIS_KEY_HTML_CACHE}*`);
  if (keys.length) {
    await redis.del(...keys);
  }
});

server.on('request', async (req, res) => {
  await routes({ req, res, redis, ...appConfig });
});

// Start the http server to serve HTML page
server.listen(appConfig.serverPort, appConfig.serverHostname, () => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(
      `\nServer was started at http://${appConfig.serverHostname}:${appConfig.serverPort}`,
    );
  }
});

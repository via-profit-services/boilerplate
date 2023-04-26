import http from 'node:http';
import { Middleware } from '@via-profit-services/core';
import Redis from 'ioredis';

import { ApplicationConfig } from 'common';
import LoggerService from '~/services/LoggerService';

type Factory = (props: {
  readonly redis: ApplicationConfig['redis'];
  readonly loggerService: LoggerService;
  readonly server: http.Server;
}) => {
  redisMiddleware: Middleware;
  redisInstance: Redis;
};

const factory: Factory = props => {
  const { redis, loggerService, server } = props;
  const redisInstance = new Redis(redis);
  let init = false;

  redisInstance.once('error', err => loggerService.log('error', 'redis', `${err.message}`));

  server.on('close', () => {
    redisInstance.disconnect();
  });

  const redisMiddleware: Middleware = ({ context }) => {
    context.redis = redisInstance;
    if (!init) {
      redisInstance.on('error', err => context.emitter.emit('redis-error', err));
      init = true;
    }
  };

  return {
    redisInstance,
    redisMiddleware,
  };
};

export default factory;

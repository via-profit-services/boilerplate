import http from 'node:http';
import { GraphQLError, execute, subscribe, parse, ExecutionArgs } from 'graphql';
import { Middleware } from '@via-profit-services/core';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { useServer } from 'graphql-ws/lib/use/ws';
import ws from 'ws';
import Redis from 'ioredis';

import { ApplicationConfig } from 'common';
import { PERSISTED_QUERY_KEY } from '~/utils/constants';
import persistedQueriesMap from '~/relay/persisted-queries.json';
import LoggerService from '~/services/LoggerService';
import AuthentificationService from '~/services/AuthentificationService';

interface Props extends ApplicationConfig {
  readonly server: http.Server;
  readonly loggerService: LoggerService;
}

const factory = (props: Props): Middleware => {
  const { redis, server, subscriptions, loggerService, jwt } = props;
  let subscriptionsInit = false;

  const redisConfig = {
    ...redis,
    retryStrategy: (times: number) => Math.min(times * 50, 20000),
  };

  const publisher = new Redis(redisConfig);
  const subscriber = new Redis(redisConfig);

  const redisPubsub = new RedisPubSub({
    publisher,
    subscriber,
    connection: redisConfig,
  });

  const subscriptionServer = new ws.Server({
    path: subscriptions,
    server,
  });

  server.on('close', () => {
    redisPubsub.close();
  });

  return async ({ context, schema }) => {
    if (!subscriptionsInit) {
      subscriptionsInit = true;
      useServer(
        {
          execute,
          subscribe,
          schema,
          context,
          onDisconnect: async ctx => {
            const { connectionParams } = ctx;

            try {
              const token = AuthentificationService.extractTokenFromSubscription(connectionParams);
              const tokenPayload = await AuthentificationService.verifyToken({
                token: token || '',
                jwt,
              });
              if (AuthentificationService.isAccessTokenPayload(tokenPayload)) {
                loggerService.log(
                  'info',
                  'subscriptions',
                  `User «${tokenPayload.uuid}» disconnected`,
                );
              }
            } catch (err) {
              // do noyhing
            }
          },
          onSubscribe: async (ctx, msg) => {
            const { payload } = msg;
            const { connectionParams } = ctx;
            const { extensions } = payload;
            const { variables, operationName } = payload;

            let query: string = payload?.query;
            let isPersistedQuery = false;

            if (extensions && typeof extensions[PERSISTED_QUERY_KEY] === 'string') {
              const queryKey = extensions[PERSISTED_QUERY_KEY] as keyof typeof persistedQueriesMap;
              if (typeof persistedQueriesMap[queryKey] === 'string') {
                query = persistedQueriesMap[queryKey];
                isPersistedQuery = true;
              }
            }

            const token = AuthentificationService.extractTokenFromSubscription(connectionParams);

            if (!token) {
              loggerService.log(
                'warn',
                'subscriptions',
                `Unauthorized Subscriptions request for operation «${operationName}» with query ${query} and variables ${JSON.stringify(
                  variables,
                )}`,
              );
            }

            try {
              const tokenPayload = await AuthentificationService.verifyToken({
                token: token || '',
                jwt,
              });
              if (AuthentificationService.isAccessTokenPayload(tokenPayload)) {
                loggerService.log(
                  'info',
                  'subscriptions',
                  `User «${tokenPayload.uuid}» successfully subscribed for operation «${operationName}»`,
                );
              }
            } catch (err) {
              loggerService.log(
                'warn',
                'subscriptions',
                `Subscriptions request with invalid token for operation «${operationName}»`,
              );

              return [
                new GraphQLError(
                  `Authorized users only. Expected Authorization key with Bearer token in connectionParams for operation «${operationName}»`,
                  {},
                ),
              ];
            }

            // Execution if is persisted query only
            if (isPersistedQuery) {
              const executionArgs: ExecutionArgs = {
                schema,
                document: parse(query),
                variableValues: variables,
              };

              return executionArgs;
            }

            // If is not persisted query
            return void 0;
          },
        },
        subscriptionServer,
      );
      context.pubsub = redisPubsub;
    }
  };
};

export default factory;

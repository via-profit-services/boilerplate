import { Middleware } from '@via-profit-services/core';
import knex, { Knex } from 'knex';
import { performance } from 'perf_hooks';

type Factory = (props: { knex: Knex.Config }) => {
  knexMiddleware: Middleware;
  knexInstance: Knex;
};

export type KnexQuery = {
  __knexQueryUid: string;
  sql: string;
  bindings: any;
};

const knexFactory: Factory = props => {
  const queryTime: Record<string, number> = {};
  const knexInstance = knex(props.knex);
  let emitters = false;

  const knexMiddleware: Middleware = ({ context, config }) => {
    const { debug } = config;
    const queryTimeConfig = {
      slow: 201,
      panic: 1001,
    };

    const knexOnQueryErrorListener = (err: Error, _query: KnexQuery) => {
      context.emitter.emit('knex-error', err);
    };

    const knexOnQueryResponseListener = (
      _response: any,
      query: KnexQuery,
      builder: Knex.QueryBuilder,
    ) => {
      const { __knexQueryUid } = query;
      const queryTimeMs = performance.now() - queryTime[__knexQueryUid] || 0;
      let queryTimeLabel = '[normal]';

      if (queryTimeMs > queryTimeConfig.panic) {
        queryTimeLabel = '[panic] ';
      }

      if (queryTimeMs > queryTimeConfig.slow) {
        queryTimeLabel = '[slow]  ';
      }

      if (debug && queryTimeLabel !== '[normal]') {
        console.debug(
          '\x1b[33m%s\x1b[0m \x1b[34m%s\x1b[0m \x1b[90m%s\x1b[0m',
          'SQL slow query at',
          `${queryTimeMs.toFixed(3)} ms`,
          `${builder.toString().substring(0, 70)}...`,
        );
      }

      context.emitter.emit(
        'knex-debug',
        `${queryTimeLabel} ${queryTimeMs.toFixed(3)} ms: ${builder.toString()}`,
      );
    };

    const knexOnQueryListener = (query: KnexQuery) => {
      const { __knexQueryUid } = query;
      queryTime[__knexQueryUid] = performance.now();
    };

    context.knex = knexInstance;
    if (!emitters) {
      context.knex.on('query', knexOnQueryListener);
      context.knex.on('query-response', knexOnQueryResponseListener);
      context.knex.on('query-error', knexOnQueryErrorListener);

      emitters = true;
    }
  };

  return {
    knexMiddleware,
    knexInstance,
  };
};

export default knexFactory;

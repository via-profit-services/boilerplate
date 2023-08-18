import { Middleware } from '@via-profit-services/core';
import { LoggerFactory } from 'logger';

const factory: LoggerFactory = props => {
  const { logger } = props;
  let emitters = false;

  const middleware: Middleware = ({ context, config }) => {
    const { emitter } = context;
    const { debug } = config;
    // FIXME: This hack initializes the data loader object in the context
    // Every middleware that inject any data into the context
    // must check for the presence of a dataloader object
    if (typeof context.dataloader === 'undefined') {
      (context.dataloader as any) = {};
    }

    if (!emitters) {
      emitter.on('permissions-error', msg => {
        logger.log('warn', 'permissions', msg);
        debug && console.error(msg);
      });
      emitter.on('knex-error', err => {
        logger.log('error', 'knex', `${err.message.replace(/\n/gim, ' ')}`);
        debug && console.error(err);
      });

      emitter.on('knex-debug', msg => {
        if (debug || msg.match(/^\[(slow|panic)\]/)) {
          logger.log('debug', 'knex', `${msg.replace(/\n/gim, ' ')}`);
        }
      });

      emitter.on('graphql-error-execute', errors => {
        errors.forEach(error => {
          const { message, path, originalError } = error;
          if (typeof originalError !== 'undefined') {
            logger.log(
              'error',
              originalError.name,
              `${originalError.message}. Stack trace: ${(originalError.stack || '').split('\n')}`,
            );
          }
          logger.log(
            'error',
            'Graphql execute error',
            `${message}. Path: ${(path || ['undefined']).join('->')}`,
          );
          debug && console.error(error);
        });
      });
      emitter.on('graphql-error-validate-field', errors => {
        errors.forEach(error => {
          const { message, path, originalError } = error;
          if (typeof originalError !== 'undefined') {
            logger.log(
              'error',
              'originalError.name',
              `${originalError.message}. Stack trace: ${(originalError.stack || '').split('\n')}`,
            );
          }
          logger.log(
            'error',
            'Graphql validate field error',
            `${message}. Path: ${(path || ['undefined']).join('->')}`,
          );
          debug && console.error(error);
        });
      });
      emitter.on('graphql-error-validate-request', errors => {
        errors.forEach(error => {
          const { message, path, originalError } = error;
          if (typeof originalError !== 'undefined') {
            logger.log(
              'error',
              'originalError.name',
              `${originalError.message}. Stack trace: ${(originalError.stack || '').split('\n')}`,
            );
          }
          logger.log(
            'error',
            'Graphql validate request error',
            `${message}. Path: ${(path || ['undefined']).join('->')}`,
          );
          debug && console.error(error);
        });
      });
      emitter.on('graphql-error-validate-schema', errors => {
        errors.forEach(error => {
          const { name, message, path, originalError } = error;
          if (typeof originalError !== 'undefined') {
            logger.log(
              'error',
              'originalError.name',
              `${originalError.message}. Stack trace: ${(originalError.stack || '').split('\n')}`,
            );
          }
          logger.log('error', name, `${message}. Path: ${(path || ['undefined']).join('->')}`);
          debug && console.error(error);
        });
      });
      emitter.on('log-debug', (tag, msg) => logger.log('debug', tag, msg));
      emitter.on('log-info', (tag, msg) => logger.log('info', tag, msg));
      emitter.on('log-error', (tag, msg) => logger.log('error', tag, msg));
      emitter.on('log-warn', (tag, msg) => logger.log('warn', tag, msg));

      emitters = true;
    }
  };

  return middleware;
};

export default factory;

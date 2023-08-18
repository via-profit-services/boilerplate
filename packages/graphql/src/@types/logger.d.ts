declare module 'logger' {
  import { GraphQLFieldResolver } from 'graphql';
  import { WriteStream } from 'node:fs';
  import { Middleware, Context } from '@via-profit-services/core';

  export type LogLevel = 'error' | 'warn' | 'info' | 'debug';
  export type LogLevelMap = Record<LogLevel, LogLevel[]>;
  export type LoggerCollection = Map<LogLevel, LogInfo>;
  export type LogInfo = {
    readonly stream: WriteStream;
    readonly filename: string;
  };

  export interface Resolvers {
    readonly Subscription: {
      readonly log: {
        subscribe: GraphQLFieldResolver<unknown, Context>;
      };
    };
  }

  export type Configuration = {
    readonly logDir: string;
  };

  export type LoggerFactory = (props: { logger: LoggerService }) => Middleware;

  export interface LoggerServiceProps {
    readonly logDir: string;
  }

  export interface LoggerServiceInterface {
    /**
     * Write to log\
     */
    log(level: LogLevel, logTagOrMessage: string, message?: string): void;
  }

  export interface LoggerService extends LoggerServiceInterface {}

  class LoggerService {
    constructor(props: LoggerServiceProps);
  }

  export const factory: LoggerFactory;
}

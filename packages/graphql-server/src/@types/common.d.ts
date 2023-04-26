declare module 'common' {
  import type { Knex } from 'knex';
  import type { RedisOptions } from 'ioredis';
  import type { Configuration as PermissionsConfig } from '@via-profit-services/permissions';
  import type { Configuration as LoggerConfig } from 'logger';
  import type { JwtConfig } from 'users';
  import type { FilesConfig } from 'files';

  export interface ApplicationConfig {
    readonly debug: boolean;
    readonly port: number;
    readonly host: string;
    readonly endpoint: string;
    readonly subscriptions: string;
    readonly jwt: JwtConfig;
    readonly logs: LoggerConfig;
    readonly redis: RedisOptions;
    readonly files: FilesConfig;
    readonly knex: Knex.Config;
    readonly permissions: PermissionsConfig;
  }
}

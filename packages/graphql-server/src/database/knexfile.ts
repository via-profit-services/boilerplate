import dotenv from 'dotenv';
import { Knex } from 'knex';
import path from 'node:path';

const env = dotenv.config().parsed as NodeJS.ProcessEnv;

const config: Knex.Config = {
  client: 'pg',
  connection: {
    user: env.DB_USER,
    database: env.DB_NAME,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
  },
  seeds: {
    directory: path.resolve(process.cwd(), './seeds'),
  },
  migrations: {
    directory: path.resolve(process.cwd(), './migrations'),
  },
};

export default config;

import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return await knex.raw(/*SQL*/ `
    CREATE TABLE scheduler (
      id uuid NOT NULL primary key,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "cronTime" varchar(255) NOT NULL,
      counter int4 NOT NULL DEFAULT 0,
      cmd text NOT NULL,
      entity uuid default null
    );    

    CREATE INDEX scheduler_entity_idx ON "scheduler" (entity);
  `);
}

export async function down(knex: Knex): Promise<void> {
  return await knex.raw(/*SQL*/ `
    DROP INDEX IF EXISTS scheduler_entity_idx;
    DROP TABLE IF EXISTS scheduler;
  `);
}

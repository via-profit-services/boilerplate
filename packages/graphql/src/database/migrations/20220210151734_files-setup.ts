import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.raw(/*SQL*/ `
    drop table if exists "files" cascade;
    drop type if exists "filesTypes";

    create type "filesTypes" as enum (
      'AVATAR',
      'MEDIA',
      'DOCUMENT'
    );

    create table "files" (
      "id" uuid not null,
      "createdAt" timestamp with time zone not null default now(),
      "updatedAt" timestamp with time zone not null default now(),
      "owner" uuid null,
      "type" "filesTypes" not null,
      "mimeType" character varying(255) not null,
      "name" character varying(255) null,
      "description" text null,
      "meta" jsonb null,
      "access" jsonb not null default '{"del":[],"read":[],"write":[]}':: jsonb,
      "pseudoPath" character varying(255) null
    );

    alter table "files" add constraint "files_pk" primary key ("id");
  `);
}

export async function down(knex: Knex): Promise<any> {
  return knex.raw(/*SQL*/ `
    drop table if exists "files" cascade;
    drop type if exists "filesTypes";
  `);
}

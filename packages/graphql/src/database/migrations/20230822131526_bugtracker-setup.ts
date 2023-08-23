import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(/* SQL */ `
    drop table if exists "bugtrackerTasks" cascade;
    drop type if exists "BugtrackerTaskStatus" cascade;
    drop type if exists "BugtrackerTaskType" cascade;
    drop type if exists "BugtrackerPriorityStatus" cascade;

    create type "BugtrackerTaskStatus" as enum (
      'UNKNOWN',
      'ACCEPTED',
      'REJECTED',
      'FINISHED',
      'CANCELLED',
      'TESTING'
    );

    create type "BugtrackerPriorityStatus" as enum (
      'LOW',
      'USUAL',
      'IMPORTANT',
      'EMERGENCY'
    );

    create type "BugtrackerTaskType" as enum (
      'BUG',
      'DEVELOPMENT',
      'TESTING'
    );

    create table "bugtrackerTasks" (
      "id" uuid not null primary key,
      "createdAt" timestamptz not null default now(),
      "updatedAt" timestamptz not null default now(),
      "expiredAt" timestamptz not null default now(),
      "status" "BugtrackerTaskStatus" not null,
      "priority" "BugtrackerPriorityStatus" not null,
      "type" "BugtrackerTaskType" not null,
      "title" varchar(255) not null,
      "text" text null default null
    );


    -- Rebuild nodes view
    create or replace view "nodes" as
            select id, 'User' as "type" from "users"
      union select id, 'Account' as "type" from "accounts"
      union select id, 'File' as "type" from "files"
      union select id, 'Page' as "type" from "pagesList"
      union select id, 'BlogPost' as "type" from "blogPosts"
      union select id, 'ContentBlockPlainText' as "type" from "contentBlockPlainText"
      union select id, 'ContentBlockImage' as "type" from "contentBlockImage"
      union select id, 'ContentBlockLexical' as "type" from "contentBlockFormattedText"
      union select id, 'Notification' as "type" from "notifications"
      union select id, 'BugtrackerTask' as "type" from "bugtrackerTasks";
  
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(/* SQL */ `

    drop table if exists "bugtrackerTasks" cascade;
    drop type if exists "BugtrackerTaskStatus" cascade;
    drop type if exists "BugtrackerTaskType" cascade;
    drop type if exists "BugtrackerPriorityStatus" cascade;

            -- Rebuild nodes view
    create or replace view "nodes" as
            select id, 'User' as "type" from "users"
      union select id, 'Account' as "type" from "accounts"
      union select id, 'File' as "type" from "files"
      union select id, 'Page' as "type" from "pagesList"
      union select id, 'BlogPost' as "type" from "blogPosts"
      union select id, 'ContentBlockPlainText' as "type" from "contentBlockPlainText"
      union select id, 'ContentBlockImage' as "type" from "contentBlockImage"
      union select id, 'ContentBlockLexical' as "type" from "contentBlockFormattedText"
      union select id, 'Notification' as "type" from "notifications";
  `);
}

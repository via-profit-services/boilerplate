import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(/* SQL */ `

    create type "notificationStatus" as enum ('created', 'read');
    create type "notificationCategory" as enum ('normal', 'critical', 'warn');

    create table "notifications" (
      "id" uuid not null,
      "createdAt" timestamptz not null default now(),
      "updatedAt" timestamptz not null default now(),
      "title" varchar(255) not null,
      "text" text not null,
      "recipient" uuid not null,
      "recipientType" varchar(100) not null,
      "category" "notificationCategory" not null default 'normal'::"notificationCategory",
      "status" "notificationStatus" not null default 'created'::"notificationStatus",
      "actions" jsonb null default null,
      constraint "notifications_pkey" PRIMARY KEY ("id")
    );
     
    create index "notifications_recipient_idx" ON "notifications" ("recipient");

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

export async function down(knex: Knex): Promise<void> {
  return knex.raw(/* SQL */ `
    drop table if exists "notifications" cascade;

    drop type if exists "notificationCategory" cascade;
    drop type if exists "notificationStatus" cascade;

    -- Rebuild nodes view
    create or replace view "nodes" as
            select id, 'User' as "type" from "users"
      union select id, 'Account' as "type" from "accounts"
      union select id, 'File' as "type" from "files"
      union select id, 'Page' as "type" from "pagesList"
      union select id, 'BlogPost' as "type" from "blogPosts"
      union select id, 'ContentBlockPlainText' as "type" from "contentBlockPlainText"
      union select id, 'ContentBlockImage' as "type" from "contentBlockImage"
      union select id, 'ContentBlockLexical' as "type" from "contentBlockFormattedText";
  `);
}

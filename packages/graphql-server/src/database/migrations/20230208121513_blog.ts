import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(/*SQL*/ `
    create table "blogAuthors" (
      "id" uuid not null,
      "name" varchar(255) not null
    );
    alter table "blogAuthors" add constraint "blogAuthorsPk" primary key("id");

    create table "blogPosts" (
      "id" uuid not null,
      "page" uuid not null,
      "createdAt" timestamptz not null default now(),
      "updatedAt" timestamptz not null default now(),
      "author" uuid null,
      "publishedAt" timestamptz not null default now(),
      "name" varchar(255) not null
    );
    alter table "blogPosts" add constraint "blogPostPk" primary key("id");
    alter table "blogPosts" add constraint "blogPostPageFk" foreign key("page") references "pagesList"("id") on delete cascade on update cascade;
    alter table "blogPosts" add constraint "blogPostAuthorFk" foreign key("author") references "blogAuthors"("id") on delete set null on update cascade;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(/*SQL*/ `
    drop table "blogPosts" cascade;
    drop table "blogAuthors" cascade;
  `);
}

import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(/* SQL */ `
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

export async function down(knex: Knex): Promise<void> {
  await knex.raw(/* SQL */ `
    drop view "nodes";
  `);
}

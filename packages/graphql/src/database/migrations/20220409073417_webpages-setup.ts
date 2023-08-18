import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(/* SQL */ `
    create type "pageWindowTarget" as enum (
      'SELF',
      'BLANK'
    );

    create type "contentBlockType" as enum (
      'IMAGE',
      'PLAIN_TEXT',
      'FORMATTED_TEXT'
    );

    create table if not exists "templates" (
      "id" uuid not null,
      "name" varchar(100) not null,
      "displayName" varchar(255) not null,
      constraint "templates_pk"  primary key ("id")
    );

    create table if not exists "pagesList" (
      "id" uuid not null,
      "pid" uuid null,
      "path" varchar(255) not null,
      "createdAt" timestamptz not null default now(),
	    "updatedAt" timestamptz not null default now(),
      "statusCode" int4 not null default 200,
      "order" int4 not null default 0,
      "template" uuid null,
      "name" varchar(255) NOT NULL,
      constraint "pagesList_pkey" primary key (id)
    );

    alter table "pagesList" add constraint "pagesList_pid_fk" foreign key ("pid") references "pagesList"("id") on update cascade on delete cascade;
    create index "pagesListPidIdx" on "pagesList" using btree ("pid");
    create index "pagesListOrderIdx" on "pagesList" using btree ("order");
    create index "pagesListTemplateIdx" on "pagesList" using btree ("template");
    create unique index "pagesListPathIdx" on "pagesList" ("path");
    create unique index "pageslistPathTemplateidx" on "pagesList" ("path","template");
    alter table "pagesList" add constraint "pagesList_fk_template" foreign key ("template") references "templates"("id") on update cascade on delete set null;


    create table if not exists "pagesMeta" (
      "page" uuid not null,
      "locale" varchar(10) null default null,
      "title" varchar(255) null default null,
      "description" text null default null,
      "keywords" varchar(255) null default null,
      constraint "pagesMeta_pkey" primary key ("page"),
      constraint "pagesMeta_fk" foreign key ("page") references "pagesList"(id) on update cascade on delete cascade
    );

    create table if not exists "contentBlocks" (
      "id" uuid not null,
      "createdAt" timestamptz not null default now(),
	    "updatedAt" timestamptz not null default now(),
      "type" "contentBlockType" not null,
      "name" varchar(255) not null,
      "page" uuid null,
      "template" uuid null,
      constraint "contentBlocks_pkey" primary key (id)
    );

    alter table "contentBlocks" add constraint "contentBlocks_page_fk" foreign key ("page") references "pagesList"("id") on delete cascade on update cascade;
    alter table "contentBlocks" add constraint "contentBlocks_fk_template" foreign key ("template") references "templates"("id") on update cascade on delete set null;
    create index "contentBlocksTypeIdx" ON "contentBlocks" using btree ("type");
    create index "contentBlocksNameIdx" ON "contentBlocks" using btree ("name");
    create index "contentBlocksPageTemplateIdx" ON "contentBlocks" using btree ("page", "template");


    create table "contentBlockPlainText" (
      "id" uuid not null,
      "text" varchar(255) not null
    );
    alter table "contentBlockPlainText" add constraint "contentBlockPlainText_pk" primary key("id");
    alter table "contentBlockPlainText" add constraint "contentBlockPlainText_cb" foreign key ("id") references "contentBlocks"("id") on delete cascade on update cascade;


    create table "contentBlockFormattedText" (
      "id" uuid not null,
      "lexical" jsonb not null
    );
    alter table "contentBlockFormattedText" add constraint "contentBlockFormattedText_pk" primary key("id");
    alter table "contentBlockFormattedText" add constraint "contentBlockFormattedText_cb" foreign key ("id") references "contentBlocks"("id")  on delete cascade on update cascade;


    create table "contentBlockImage" (
      "id" uuid not null,
      "file" uuid not null,
      "alt" varchar(255) null,
      "title" varchar(255) null
    );
    alter table "contentBlockImage" add constraint "contentBlockImage_pk" primary key("id");
    alter table "contentBlockImage" add constraint "contentBlockImage_cb" foreign key ("id") references "contentBlocks"("id")  on delete cascade on update cascade;
    alter table "contentBlockImage" add constraint "contentBlockImage_file" foreign key ("file") references "files"("id")  on delete cascade on update cascade;



    create table if not exists "pagesMenu" (
      "id" uuid not null,
      "name" character varying (255) not null,
      "createdAt" timestamptz not null default now(),
	    "updatedAt" timestamptz not null default now()
    );
    alter table "pagesMenu" add constraint "pagesMenu_pk" primary key("id");


    create table if not exists "pagesMenuItems" (
      "id" uuid not null,
      "createdAt" timestamptz not null default now(),
	    "updatedAt" timestamptz not null default now(),
      "pid" uuid null,
      "menu" uuid not null,
      "page" uuid null,
      "name" character varying (255) null,
      "visible" boolean not null,
      "order" int4 not null,
      "target" "pageWindowTarget" null default 'SELF'::"pageWindowTarget",
      "url" character varying(255) null
    );
    alter table "pagesMenuItems" add constraint "pagesMenuItems_pk" primary key("id");
    alter table "pagesMenuItems" add constraint "pagesMenuItems_fk_pid" foreign key ("pid") references "pagesMenuItems"("id") on update cascade on delete cascade;
    alter table "pagesMenuItems" add constraint "pagesMenuItems_fk_menu" foreign key ("menu") references "pagesMenu"("id") on update cascade on delete cascade;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(/* SQL */ `
    drop table if exists "pagesList" cascade;
    drop table if exists "pagesMeta" cascade;
    drop table if exists "pagesMenu" cascade;
    drop table if exists "pagesMenuItems" cascade;
    drop table if exists "contentBlocks" cascade;
    drop table if exists "contentBlockPlainText" cascade;
    drop table if exists "contentBlockFormattedText" cascade;
    drop table if exists "contentBlockImage" cascade;
    drop table if exists "templates" cascade;
    drop type if exists "contentBlockType" cascade;
    drop type if exists "pagesMenuItems" cascade;
    drop type if exists "pageWindowTarget" cascade;
  `);
}

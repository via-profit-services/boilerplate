import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(/* SQL */ `
    drop table if exists "deals" cascade;
    drop table if exists "funnels" cascade;
    drop table if exists "funnelSteps" cascade;
    drop type if exists "funnelType" cascade;

    create type "funnelType" as enum (
      'standard',
      'unprocessed',
      'canceled',
      'finished'
    );

    create table "deals" (
      "id" uuid not null,
      "createdAt" timestamptz not null default now(),
      "updatedAt" timestamptz not null default now(),
      "step" uuid not null,
      "funnel" uuid not null,
      "label" varchar(255) not null,
      "amount" int8 NOT NULL DEFAULT 0,
      "comment" text NULL,
      constraint deals_pkey primary key (id)
    );

    create table "funnels" (
      "id" uuid not null,
      "createdAt" timestamptz not null default now(),
      "updatedAt" timestamptz not null default now(),
      "label" varchar(255) not null,
      "comment" text NULL,
      constraint funnels_pkey primary key (id)
    );

    create table "funnelSteps" (
      "id" uuid not null,
      "createdAt" timestamptz not null default now(),
      "updatedAt" timestamptz not null default now(),
      "funnel" uuid not null,
      "label" varchar(255) not null,
      "color" varchar(30) not null,
      "order" int not null default 0,
      "type" "funnelType" not null default 'standard'::"funnelType",
      constraint "funnelSteps_pkey" primary key (id)
    );
    alter table "deals" add constraint deals_fk_funnel foreign key ("funnel") references "funnels"("id") on delete cascade on update cascade;
    alter table "deals" add constraint deals_fk_step foreign key ("step") references "funnelSteps"("id") on delete cascade on update cascade;
    alter table "funnelSteps" add constraint "funnelSteps_fk_funnel" foreign key ("funnel") references "funnels"("id") on delete cascade on update cascade;

  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(/* SQL */ `
    drop table if exists "deals" cascade;
    drop table if exists "funnels" cascade;
    drop table if exists "funnelSteps" cascade;
    drop type if exists "funnelType" cascade;
  `);
}

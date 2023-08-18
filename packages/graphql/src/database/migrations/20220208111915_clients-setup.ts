import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(/* SQL */ `
    CREATE TYPE "clientLegalStatus" as enum (
      'person',
      'legal',
      'entrepreneur',
      'selfemployed'
    );

    create type "clientStatus" as enum (
      'active',
      'inactive'
    );

    create table "clients" (
      "id" uuid not null,
      "createdAt" timestamptz not null default now(),
      "updatedAt" timestamptz not null default now(),
      "name" varchar(255) not null,
      "comment" text NULL,
      "status" "clientStatus" not null default 'active'::"clientStatus",
      "legalStatus" "clientLegalStatus" not null default 'person'::"clientLegalStatus",
      constraint clients_pkey primary key (id)
    );

    create table "persons" (
      "id" uuid not null,
      "createdAt" timestamptz not null default now(),
      "updatedAt" timestamptz not null default now(),
      "name" varchar(255) not null,
      "heldPost" varchar(255) not null,
      "client" uuid not null,
      "comment" text NULL,
      constraint persons_pkey primary key (id)
    );

    alter table "persons" add constraint persons_fk_clients foreign key ("client") references "clients"("id") on delete cascade on update cascade;

  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(/* SQL */ `
    drop table if exists "clients" cascade;
    drop table if exists "persons" cascade;
    drop type if exists "clientStatus";
    drop type if exists "clientLegalStatus";
  `);
}

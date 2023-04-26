import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(/* SQL */ `
    drop table if exists "clients2deals" cascade;

    create table "clients2deals" (
      "client" uuid NOT NULL,
      "deal" uuid NOT NULL,
      constraint "clients2dealsUn" unique ("client", "deal"),
      constraint "clients2dealsClientFk" foreign key ("client") references "clients"(id) on delete cascade on update cascade,
      constraint "clients2dealsDealFk" foreign key ("deal") references "deals"(id) on delete cascade on update cascade
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(/* SQL */ `
    drop table if exists "clients2deals" cascade;
  `);
}

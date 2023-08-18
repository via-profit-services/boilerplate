import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.raw(/* SQL */ `
    drop table if exists "users" cascade;
    drop table if exists "accounts" cascade;
    drop type if exists "accountStatus";

    create type "accountStatus" AS ENUM (
      'allowed',
      'forbidden'
    );

    CREATE TABLE "users" (
      "id" uuid NOT NULL,
      "name" varchar(100) NOT NULL,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now(),
      "account" uuid null,
      CONSTRAINT users_pkey PRIMARY KEY (id)
    );

    create table "accounts" (
      "id" uuid NOT NULL,
      "login" varchar(100) NOT NULL,
      "password" varchar(255) NOT NULL,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now(),
      "status" "accountStatus" NOT NULL DEFAULT 'allowed'::"accountStatus",
      CONSTRAINT "accounts_login_un" UNIQUE (login),
      CONSTRAINT "accounts_pkey" PRIMARY KEY (id)
    );

    create table "privileges" (
      "privilege" varchar(100) NOT NULL,
      CONSTRAINT "privileges_pkey" PRIMARY KEY ("privilege")
    );

    create table "roles" (
      "role" varchar(100) NOT NULL,
      CONSTRAINT "roles_pkey" PRIMARY KEY ("role")
    );

    create table "role2privileges" (
      "role" varchar(100) NOT NULL,
      "privilege" varchar(100) NOT NULL,
      CONSTRAINT "role2privileges_un" UNIQUE (role, privilege)
    );


    create table "account2roles" (
      "account" uuid NOT NULL,
      "role" varchar(100) NOT NULL,
      CONSTRAINT "account2roles_un" UNIQUE (account, role)
    );


    ALTER TABLE "role2privileges" ADD CONSTRAINT "role2privileges_fk_role" FOREIGN KEY ("role") REFERENCES "roles"("role") ON DELETE CASCADE ON UPDATE CASCADE;
    ALTER TABLE "role2privileges" ADD CONSTRAINT "role2privileges_fk_privilege" FOREIGN KEY ("privilege") REFERENCES "privileges"("privilege") ON DELETE CASCADE ON UPDATE CASCADE;

    ALTER TABLE "account2roles" ADD CONSTRAINT "account2roles_fk_account" FOREIGN KEY ("account") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    ALTER TABLE "account2roles" ADD CONSTRAINT "account2roles_fk_role" FOREIGN KEY ("role") REFERENCES "roles"("role") ON DELETE CASCADE ON UPDATE CASCADE;
   
    ALTER TABLE "users" ADD CONSTRAINT "users_fk_accounts" FOREIGN KEY ("account") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

  `);
}

export async function down(knex: Knex): Promise<any> {
  return knex.raw(/* SQL */ `
    drop table if exists "users" cascade;
    drop table if exists "accounts" cascade;
    drop table if exists "privileges" cascade;
    drop table if exists "roles" cascade;
    drop table if exists "role2privileges" cascade;
    drop table if exists "account2roles" cascade;
    drop type if exists "accountStatus";
  `);
}

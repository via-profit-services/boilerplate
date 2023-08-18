import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(/* SQL */ `
  
    create table "slider" (
      "id" uuid not null,
      "page" uuid null,
      "template" uuid null,
      "createdAt" timestamptz not null default now(),
      "updatedAt" timestamptz not null default now(),
      "displayName" varchar(255),
      "slidesToShow" int4,
      "pauseOnHover" boolean,
      "autoplaySpeed" int4,
      constraint "slider_pk" primary key(id)
    );
    alter table "slider" add constraint "slider_page_fk" foreign key ("page") references "pagesList"("id") on delete set null on update cascade;
    alter table "slider" add constraint "slider_template_fk" foreign key ("template") references "templates"("id") on delete set null on update cascade;

    create table "sliderSlides" (
      "id" uuid not null,
      "slider" uuid not null,
      "createdAt" timestamptz not null default now(),
      "updatedAt" timestamptz not null default now(),
      "enabled" boolean,
      "order" int4,
      "image" uuid,
      constraint "sliderSlides_pk" primary key(id)
    );
    alter table "sliderSlides" add constraint "sliderSlides_image_fk" foreign key ("image") references "contentBlocks"("id") on delete cascade on update cascade;
    alter table "sliderSlides" add constraint "sliderSlides_slider_fk" foreign key ("slider") references "slider"("id") on delete cascade on update cascade;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(/* SQL */ `
    drop table if exists "slider" cascade;
    drop table if exists "sliderSlides" cascade;
  `);
}

import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { Context } from '@via-profit-services/core';

import { TemplateParent } from 'webpages';
import Slider from '~/schema/components/Slider';
import Payments from '~/schema/components/Payments';
import PageTemplateInterface from '~/schema/interfaces/PageTemplateInterface';
import ContentBlockPlainText from '~/schema/types/ContentBlockPlainText';
import Page from '~/schema/types/Page';
import TemplateName from '~/schema/enums/TemplateName';
import { SliderSlidesTableRecord } from 'slider';

const TemplateHomePage = new GraphQLObjectType<TemplateParent, Context>({
  name: 'TemplateHomePage',
  interfaces: [PageTemplateInterface],
  fields: () => {
    const fields: Record<string, GraphQLFieldConfig<TemplateParent, Context>> = {
      id: {
        type: new GraphQLNonNull(GraphQLID),
        resolve: async parent => `fakeID:${parent.page}:${parent.id}`,
      },
      name: { type: new GraphQLNonNull(TemplateName) },
      displayName: { type: new GraphQLNonNull(GraphQLString) },
      page: {
        type: new GraphQLNonNull(Page),
        resolve: async (parent, _args, context) => {
          const { page: pageID } = parent;
          const { dataloader } = context;
          const page = await dataloader.webpages.load(pageID);

          return page;
        },
      },
      heading: {
        type: ContentBlockPlainText,
        description: 'Page H1 heading',
        resolve: parent => parent.contentBlocks.find(cb => cb.name === 'page:heading'),
      },
      payments: {
        type: Payments,
        resolve: async parent => {
          const { contentBlocks } = parent;
          const data = contentBlocks.filter(cb =>
            ['payments:heading', 'payments:subheading', 'payments:content'].includes(cb.name),
          );

          return data.length === 3 ? parent : null;
        },
      },
      slider: {
        type: Slider,
        resolve: async (parent, _args, context) => {
          const { page: pageID } = parent;
          const { knex, dataloader } = context;
          const page = await dataloader.webpages.load(pageID);

          const slider = await knex
            .select<SliderSlidesTableRecord[]>(['*'])
            .from('slider')
            .where({
              page: page.id,
              template: page.template,
            })
            .first();

          if (slider) {
            const slides = await knex
              .select<SliderSlidesTableRecord[]>('*')
              .from('sliderSlides')
              .orderBy([{ column: 'order', order: 'asc' }])
              .where({
                slider: slider.id,
              });

            return {
              ...slider,
              slides,
            };
          }

          return null;
        },
      },
    };

    return fields;
  },
});

export default TemplateHomePage;

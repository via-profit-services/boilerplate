import { Context } from '@via-profit-services/core';
import { GraphQLID, GraphQLNonNull, GraphQLObjectType } from 'graphql';

import { SliderSlide as Parent } from 'slider';
import ContentBlockImage from '~/schema/types/ContentBlockImage';

const Slide = new GraphQLObjectType<Parent, Context>({
  name: 'Slide',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    image: {
      type: ContentBlockImage,
      resolve: async (parent, _args, context) => {
        const { dataloader } = context;
        const { image } = parent;

        const contentBlock = await dataloader.contentBlocks.load(image);

        return contentBlock;
      },
    },
  }),
});

export default Slide;

import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFieldConfig,
} from 'graphql';
import { Context } from '@via-profit-services/core';

import PageSliderSlide from '~/schema/types/PageSliderSlide';
import { WebSlider as Parent } from 'webpages';

const PageSlider = new GraphQLObjectType({
  name: 'PageSlider',
  fields: () => {
    const fields: Record<keyof Parent, GraphQLFieldConfig<Parent, Context>> = {
      slides: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PageSliderSlide))) },
      autoplay: { type: new GraphQLNonNull(GraphQLBoolean) },
      delay: { type: new GraphQLNonNull(GraphQLInt) },
    };

    return fields;
  },
});

export default PageSlider;

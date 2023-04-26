import { GraphQLObjectType, GraphQLID, GraphQLNonNull, GraphQLFieldConfig } from 'graphql';
import { URLScalarType, Context } from '@via-profit-services/core';

import { WebSlider } from 'webpages';

type Parent = WebSlider['slides'][0];

const PageSliderSlide = new GraphQLObjectType<Parent, Context>({
  name: 'HomePageSliderSlide',
  fields: () => {
    const fields: Record<keyof Parent, GraphQLFieldConfig<Parent, Context>> = {
      id: { type: new GraphQLNonNull(GraphQLID) },
      image: { type: new GraphQLNonNull(URLScalarType) },
    };

    return fields;
  },
});

export default PageSliderSlide;

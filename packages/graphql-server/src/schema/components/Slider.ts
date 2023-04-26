import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';

import Slide from './Slide';
import { TemplateParent } from 'webpages';

const Slider = new GraphQLObjectType<TemplateParent>({
  name: 'Slider',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    slides: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Slide))) },
  }),
});

export default Slider;

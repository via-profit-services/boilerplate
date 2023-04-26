import { GraphQLInterfaceType, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';

import Page from '~/schema/types/Page';
import TemplateName from '~/schema/enums/TemplateName';

const PageTemplateInterface = new GraphQLInterfaceType({
  name: 'PageTemplateInterface',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(TemplateName) },
    displayName: { type: new GraphQLNonNull(GraphQLString) },
    page: {
      type: new GraphQLNonNull(Page),
      description: 'Template active page',
    },
  }),
});

export default PageTemplateInterface;

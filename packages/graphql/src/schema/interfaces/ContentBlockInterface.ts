import { GraphQLInterfaceType, GraphQLNonNull, GraphQLID, GraphQLFieldConfig } from 'graphql';
import { NodeInterfaceType, Context, DateTimeScalarType } from '@via-profit-services/core';

import Page from '~/schema/types/Page';
import ContentBlockType from '~/schema/enums/ContentBlockType';
import PageTemplate from '~/schema/types/PageTemplate';

const ContentBlockInterface = new GraphQLInterfaceType({
  name: 'ContentBlockInterface',
  interfaces: [NodeInterfaceType],
  fields: () => {
    const fields: Record<string, GraphQLFieldConfig<unknown, Context>> = {
      id: { type: new GraphQLNonNull(GraphQLID) },
      createdAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      updatedAt: { type: new GraphQLNonNull(DateTimeScalarType) },
      type: { type: new GraphQLNonNull(ContentBlockType) },
      page: { type: Page },
      template: { type: PageTemplate },
    };

    return fields;
  },
});

export default ContentBlockInterface;

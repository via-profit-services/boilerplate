import { GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from 'graphql';
import { Context } from '@via-profit-services/core';

const version: GraphQLFieldConfig<unknown, Context> = {
  type: new GraphQLNonNull(GraphQLString),
  resolve: () => process.env.WEBPACK_INJECT_APP_VERSION || '',
  description: 'Application version info',
};

export default version;

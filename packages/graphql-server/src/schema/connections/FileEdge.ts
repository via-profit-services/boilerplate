import { GraphQLFieldConfig, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { Context, EdgeInterfaceType } from '@via-profit-services/core';

import File from '~/schema/types/File';

const FileEdge = new GraphQLObjectType({
  name: 'FileEdge',
  interfaces: () => [EdgeInterfaceType],
  fields: () => {
    const fields: Record<string, GraphQLFieldConfig<unknown, Context>> = {
      cursor: { type: new GraphQLNonNull(GraphQLString) },
      node: { type: new GraphQLNonNull(File) },
    };

    return fields;
  },
});

export default FileEdge;

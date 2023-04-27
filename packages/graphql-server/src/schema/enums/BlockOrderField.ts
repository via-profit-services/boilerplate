import { GraphQLEnumType } from 'graphql';

const BlockOrderField = new GraphQLEnumType({
  name: 'BlockOrderField',
  values: {
    NAME: { value: 'name' },
    TYPE: { value: 'type' },
    CREATED_AT: { value: 'createdAt' },
    UPDATED_AT: { value: 'updatedAt' },
  },
});

export default BlockOrderField;

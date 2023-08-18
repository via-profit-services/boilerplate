import { GraphQLEnumType } from 'graphql';

const PageWindowTarget = new GraphQLEnumType({
  name: 'PageWindowTarget',
  values: {
    SELF: {
      value: 'SELF',
      description: 'Value for the «target» attribute, e.g.: <a target="_self"></a>',
    },
    BLANK: {
      value: 'BLANK',
      description: 'Value for the «target» attribute, e.g.: <a target="_blank"></a>',
    },
  },
});

export default PageWindowTarget;

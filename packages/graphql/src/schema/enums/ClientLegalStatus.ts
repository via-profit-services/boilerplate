import { GraphQLEnumType } from 'graphql';

const ClientLegalStatus = new GraphQLEnumType({
  name: 'ClientLegalStatus',
  values: {
    PERSON: { value: 'person' },
    LEGAL: { value: 'legal' },
    ENTREPRENEUR: { value: 'entrepreneur' },
    SELFEMPLOYED: { value: 'selfemployed' },
  },
});

export default ClientLegalStatus;

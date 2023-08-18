import { GraphQLSchema } from 'graphql';
import {
  FileUploadScalarType,
  DateScalarType,
  DateTimeScalarType,
  EmailAddressScalarType,
  MoneyScalarType,
  TimeScalarType,
  VoidScalarType,
  URLScalarType,
  JSONScalarType,
  JSONObjectScalarType,
  BetweenDateInputType,
  BetweenDateTimeInputType,
  BetweenIntInputType,
  BetweenMoneyInputType,
  BetweenTimeInputType,
  OrderDirectionType,
  PageInfoType,
  ConnectionInterfaceType,
  EdgeInterfaceType,
  ErrorInterfaceType,
  NodeInterfaceType,
} from '@via-profit-services/core';

import Query from '~/schema/queries/Query';
import Mutation from '~/schema/mutations/Mutation';
import Subscription from '~/schema/subscriptions/Subscription';

const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  subscription: Subscription,
  description: 'GraphQL boilerplate',
  types: [
    FileUploadScalarType,
    DateScalarType,
    DateTimeScalarType,
    EmailAddressScalarType,
    MoneyScalarType,
    TimeScalarType,
    VoidScalarType,
    URLScalarType,
    JSONScalarType,
    JSONObjectScalarType,
    BetweenDateInputType,
    BetweenDateTimeInputType,
    BetweenIntInputType,
    BetweenMoneyInputType,
    BetweenTimeInputType,
    ConnectionInterfaceType,
    OrderDirectionType,
    PageInfoType,
    EdgeInterfaceType,
    ErrorInterfaceType,
    NodeInterfaceType,
  ],
});

export default schema;

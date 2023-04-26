import { GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from 'graphql';
import { Context } from '@via-profit-services/core';

import TokenRegistrationResponse from '~/schema/unions/TokenRegistrationResponse';

type Args = {
  login: string;
  password: string;
};

const create: GraphQLFieldConfig<unknown, Context, Args> = {
  description: 'Create «Access» and «Refresh» tokens pair',
  type: new GraphQLNonNull(TokenRegistrationResponse),
  args: {
    login: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_parent, args, context) => {
    const { login, password } = args;
    const { services, emitter, timezone } = context;
    const { authentification } = services;

    // try to generate token pairs (call user function)
    try {
      const result = await authentification.createToken({
        login,
        password,
      });

      // if registration is done
      if (typeof result === 'object') {
        context.token = result.accessToken.payload;

        emitter.emit(
          'log-info',
          'authentification',
          `Created tokens pair for account with ID: «${
            result.accessToken.payload.auid
          }». Access token will be expire at ${new Date(
            result.accessToken.payload.exp * 1000,
          ).toLocaleString('en-US', {
            timeZone: timezone,
            dateStyle: 'long',
            timeStyle: 'long',
          })}. Refresh token will be expire at ${new Date(
            result.refreshToken.payload.exp * 1000,
          ).toLocaleString('en-US', {
            timeZone: timezone,
            dateStyle: 'long',
            timeStyle: 'long',
          })}`,
        );

        return {
          __typename: 'TokenRegistrationSuccess',
          payload: result,
        };
      }

      emitter.emit('log-info', 'authentification', 'Tokens creation failure. Invalid credentials');

      // if registration is failed
      return {
        __typename: 'TokenRegistrationError',
        name: 'InvalidCredentials',
        msg: typeof result === 'string' ? result : 'Invalid credentials',
      };
    } catch (err) {
      emitter.emit('log-error', 'authentification', err);

      return {
        __typename: 'TokenRegistrationError',
        name: 'UnknownError',
        msg: 'unknown error',
      };
    }
  },
};

export default create;

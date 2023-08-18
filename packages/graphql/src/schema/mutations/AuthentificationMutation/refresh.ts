import { GraphQLNonNull, GraphQLString, GraphQLFieldConfig } from 'graphql';
import { Context } from '@via-profit-services/core';

import type { AccessTokenPayload, RefreshTokenPayload } from 'users';
import AuthentificationService from '~/services/AuthentificationService';
import TokenRegistrationResponse from '~/schema/unions/TokenRegistrationResponse';

type Args = {
  refreshToken: string;
};

const refresh: GraphQLFieldConfig<unknown, Context, Args> = {
  description: 'Exchange a «Refresh» token to new «Access» and «Refresh» tokens pair',
  type: new GraphQLNonNull(TokenRegistrationResponse),
  args: {
    refreshToken: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_parent, args, context) => {
    const { refreshToken } = args;
    const { services, jwt, emitter } = context;
    const { authentification } = services;
    const logTag = 'authentification';

    let tokenPayload: RefreshTokenPayload | AccessTokenPayload;
    try {
      emitter.emit('log-info', logTag, `Refresh Token verification`);
      tokenPayload = await AuthentificationService.verifyToken({
        token: refreshToken,
        jwt,
      });
      emitter.emit('log-info', logTag, `Refresh Token is valid`);
    } catch (err) {
      emitter.emit('log-info', logTag, `Refresh token. Token verification error. ${err.message}`);

      return {
        __typename: 'TokenRegistrationError',
        name: 'TokenVerificationError',
        msg: err.message,
      };
    }

    // if is not a valid refresh token
    if (!AuthentificationService.isRefreshTokenPayload(tokenPayload)) {
      emitter.emit('log-info', logTag, `Refresh token. The token is not a refresh token`);

      return {
        name: 'TokenAreNotRefreshType',
        msg: 'This is token are not «Refresh» token type. You should provide «Refresh» token type',
        __typename: 'TokenRegistrationError',
      };
    }

    // if token was revoked
    const isRevoked = await authentification.checkTokenRevoke(tokenPayload);
    if (isRevoked) {
      emitter.emit('log-info', logTag, 'Refresh token. Token revoked');

      return {
        name: 'TokenRevoked',
        msg: 'Token revoked',
        __typename: 'TokenRegistrationError',
      };
    }

    // try to generate token pairs (call user function)
    try {
      emitter.emit('log-info', logTag, 'Refresh token. Start the operation');
      const result = await authentification.refreshToken(tokenPayload);

      // if registration is done
      if (typeof result === 'object') {
        context.token = result.accessToken.payload;
        emitter.emit(
          'log-info',
          logTag,
          `Refresh token. Token was refreshed for account ${result.accessToken.payload.auid}`,
        );

        return {
          __typename: 'TokenRegistrationSuccess',
          payload: result,
        };
      }

      if (typeof result === 'string' || typeof result === 'boolean') {
        emitter.emit('log-info', logTag, 'Refresh token failure. Invalid credentials');

        // if registration is failed
        return {
          __typename: 'TokenRegistrationError',
          name: 'InvalidCredentials',
          msg: typeof result === 'string' ? result : 'Invalid credentials',
        };
      }
    } catch (err) {
      emitter.emit('log-error', logTag, err);
    }

    // if registration is failed
    return {
      __typename: 'TokenRegistrationError',
      name: 'UnknownError',
      msg: 'Unknown error',
    };
  },
};

export default refresh;

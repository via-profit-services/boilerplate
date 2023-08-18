import { GraphQLNonNull, GraphQLString, GraphQLFieldConfig } from 'graphql';
import { Context } from '@via-profit-services/core';

import type { AccessTokenPayload, RefreshTokenPayload } from 'users';
import TokenVerificationResponse from '~/schema/unions/TokenVerificationResponse';
import AuthentificationService from '~/services/AuthentificationService';

type Args = {
  accessToken: string;
};

const verifyToken: GraphQLFieldConfig<unknown, Context, Args> = {
  description: 'Verify your Access token',
  type: new GraphQLNonNull(TokenVerificationResponse),
  args: {
    accessToken: {
      description: 'Access token',
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: async (_parent, args, context) => {
    const { accessToken } = args;
    const { services, jwt, emitter } = context;
    const { authentification } = services;
    const logTag = 'authentification';

    let tokenPayload: AccessTokenPayload | RefreshTokenPayload;

    try {
      tokenPayload = await AuthentificationService.verifyToken({
        token: accessToken,
        jwt,
      });
    } catch (err) {
      emitter.emit(
        'log-error',
        logTag,
        `Verify token query. ${err.message}. Token: ${accessToken}`,
      );

      return {
        name: 'VerificationError',
        msg: err.message,
        __typename: 'TokenVerificationError',
      };
    }

    try {
      const isRevoked = await authentification.checkTokenRevoke(tokenPayload);

      if (isRevoked) {
        emitter.emit(
          'log-info',
          logTag,
          `Verify token query. Token with ID ${tokenPayload.id} are revoked`,
        );

        return {
          name: 'TokenRevoked',
          msg: 'Token revoked',
          __typename: 'TokenVerificationError',
        };
      }
    } catch (err) {
      emitter.emit(
        'log-error',
        logTag,
        `Verify token query. Error while checking revoked. ${err.message}. Token ID: ${tokenPayload.id}`,
      );

      return {
        name: 'UnknownError',
        msg: err.message,
        __typename: 'TokenVerificationError',
      };
    }

    if (AuthentificationService.isRefreshTokenPayload(tokenPayload)) {
      emitter.emit('log-info', logTag, 'Verify token query. Passed not an access token');

      return {
        name: 'TokenAreNotAccessType',
        msg: 'This is token are «Refresh» token type. You should provide «Access» token type',
        __typename: 'TokenVerificationError',
      };
    }

    emitter.emit(
      'log-info',
      logTag,
      `Verify token query. Token verification success with token ID: ${tokenPayload.id}`,
    );

    return {
      __typename: 'TokenVerificationSuccess',
      payload: tokenPayload,
    };
  },
};

export default verifyToken;

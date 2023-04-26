import { Middleware } from '@via-profit-services/core';
import DataLoader from 'dataloader';

import type { UsersMiddlewareFactory } from 'users';
import UsersService from '~/services/UsersService';
import AuthentificationService from '~/services/AuthentificationService';

const factory: UsersMiddlewareFactory = ({ jwt }) => {
  const middleware: Middleware = async ({ context }) => {
    const { services, emitter } = context;

    // Check to dataloader exist in context
    if (typeof context.dataloader === 'undefined') {
      (context.dataloader as any) = {};
    }

    if (typeof context.jwt === 'undefined') {
      emitter.emit(
        'log-info',
        'authentification',
        `Authentification middleware init with iss: «${jwt.issuer}» and algorithm: «${jwt.algorithm}»`,
      );

      // Define jwt
      context.jwt = jwt;
    }

    // Default token state
    context.token = AuthentificationService.getDefaultTokenPayload();

    // Define services
    // Services must be inited for each request
    services.authentification = new AuthentificationService({
      knex: context.knex,
      redis: context.redis,
      jwt: context.jwt,
    });
    services.users = new UsersService({ knex: context.knex });

    try {
      const requestToken = AuthentificationService.extractTokenFromRequest(context.request);
      if (requestToken) {
        const tokenPayload = await AuthentificationService.verifyToken({
          token: requestToken,
          jwt,
        });

        if (AuthentificationService.isAccessTokenPayload(tokenPayload)) {
          const isRevoked = await services.authentification.checkTokenRevoke(tokenPayload);
          if (!isRevoked) {
            context.token = tokenPayload;
          }
        }
      }
    } catch (err) {
      emitter.emit('log-warn', 'authentification', err.message);

      throw new Error(err);
    }

    // Init dataloaders
    // The Dataloaders must be inited for each request
    context.dataloader.users = new DataLoader(async ids => {
      const { edges } = await services.users.getUsersConnection({
        id: ids,
        first: ids.length,
      });

      return ids.map(id => edges.find(edge => edge.node.id === id)?.node || null);
    });

    context.dataloader.accounts = new DataLoader(async ids => {
      const { edges } = await services.users.getAccountsConnection({
        id: ids,
        first: ids.length,
      });

      return ids.map(id => edges.find(edge => edge.node.id === id)?.node || null);
    });
  };

  return middleware;
};

export default factory;

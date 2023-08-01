import http from 'node:http';
import jsonwebtoken from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4, validate } from 'uuid';

import {
  TOKEN_BEARER_KEY,
  TOKEN_BEARER,
  ACCESS_TOKEN_EMPTY_ID,
  ACCESS_TOKEN_EMPTY_UUID,
  ACCESS_TOKEN_EMPTY_ISSUER,
} from '~/utils/constants';
import type {
  AccountsTableRecord,
  AccessTokenPayload,
  TokenPackage,
  RefreshTokenPayload,
  AuthentificationServiceInterface,
  GenerateTokenPayload,
  AuthentificationServiceProps,
  VerifyTokenProps,
  CreateTokenProps,
  AccountRole,
  PrivilegeName,
  Role2PrivilegesTableRecord,
  Account2RolesTableRecord,
} from 'users';

class AuthentificationService implements AuthentificationServiceInterface {
  #knex: AuthentificationServiceProps['knex'];
  #redis: AuthentificationServiceProps['redis'];
  #jwt: AuthentificationServiceProps['jwt'];

  public constructor(props: AuthentificationServiceProps) {
    this.#knex = props.knex;
    this.#redis = props.redis;
    this.#jwt = props.jwt;
  }

  public static getDefaultTokenPayload(): AccessTokenPayload {
    return {
      type: 'access',
      id: ACCESS_TOKEN_EMPTY_ID,
      uuid: ACCESS_TOKEN_EMPTY_UUID,
      auid: ACCESS_TOKEN_EMPTY_UUID,
      iss: ACCESS_TOKEN_EMPTY_ISSUER,
      roles: [],
      privileges: [],
      exp: 0,
    };
  }

  /**
   * Generate token pair (access + refresh)
   */
  public generateTokens(
    payload: GenerateTokenPayload,
    exp?: {
      access: number;
      refresh: number;
    },
  ): TokenPackage {
    const { accessTokenExpiresIn, refreshTokenExpiresIn, issuer, algorithm, privateKey } =
      this.#jwt;
    const accessExpires = exp?.access ?? accessTokenExpiresIn;
    const refreshExpires = exp?.refresh ?? refreshTokenExpiresIn;

    const accessTokenPayload: AccessTokenPayload = {
      ...payload,
      type: 'access',
      id: uuidv4(),
      exp: Math.floor(Date.now() / 1000) + Number(accessExpires),
      iss: issuer,
    };

    const refreshTokenPayload: RefreshTokenPayload = {
      ...payload,
      type: 'refresh',
      id: uuidv4(),
      exp: Math.floor(Date.now() / 1000) + Number(refreshExpires),
      iss: issuer,
      associated: accessTokenPayload,
    };

    const accessTokenString = jsonwebtoken.sign(accessTokenPayload, privateKey, { algorithm });
    const refreshTokenString = jsonwebtoken.sign(refreshTokenPayload, privateKey, { algorithm });

    return {
      accessToken: {
        token: accessTokenString,
        payload: accessTokenPayload,
      },
      refreshToken: {
        token: refreshTokenString,
        payload: refreshTokenPayload,
      },
    };
  }

  public async createToken(props: CreateTokenProps) {
    const { login, password } = props;

    // get account by login
    const record = await this.#knex
      .select([
        'accounts.id',
        'accounts.password',
        this.#knex.raw('?? as "userID"', ['users.id']),
        this.#knex.raw('json_agg(distinct ??) AS "roles"', ['account2roles.role']),
        this.#knex.raw('json_agg(distinct ??) AS "privileges"', ['role2privileges.privilege']),
      ])
      .groupBy(['accounts.id', 'users.id'])
      .from<
        AccountsTableRecord,
        Pick<AccountsTableRecord, 'id' | 'password'> & {
          readonly userID: string | null;
          readonly privileges: Role2PrivilegesTableRecord['privilege'][] | [null];
          readonly roles: Account2RolesTableRecord['role'][] | [null];
        }
      >('accounts')
      .leftJoin('users', 'users.account', 'accounts.id')
      .leftJoin('account2roles', 'account2roles.account', 'accounts.id')
      .leftJoin('role2privileges', 'role2privileges.role', 'account2roles.role')
      .where({
        status: 'allowed',
        login,
      })
      .first();

    // return error if account not found or password are invalid
    if (!record || !bcryptjs.compareSync(`${login}.${password}`, record.password)) {
      return 'Invalid login or password';
    }
    const { privileges, roles, id, userID } = record;
    const isDeveloper = roles.find(r => r === 'developer');
    const developerPrivileges = AuthentificationService.getPrivilegesList();

    // generate tokens pair
    const { accessToken, refreshToken } = this.generateTokens({
      auid: id,
      uuid: userID,
      roles: roles.filter(r => r !== null),
      privileges: isDeveloper ? developerPrivileges : privileges.filter(p => p !== null),
    });

    // In this example, we save the token ID in Redis,
    // which allows you to specify the time after which
    // the record will be automatically deleted from store
    try {
      await this.#redis.set(
        `tokens:${accessToken.payload.id}`,
        JSON.stringify(accessToken.payload),
        'PX',
        accessToken.payload.exp * 1000 - new Date().getTime(),
      );
      await this.#redis.set(
        `tokens:${refreshToken.payload.id}`,
        JSON.stringify(refreshToken.payload),
        'PX',
        refreshToken.payload.exp * 1000 - new Date().getTime(),
      );
    } catch (err) {
      throw new Error(`Create token error. ${err}`);
    }

    // return both tokens
    return { accessToken, refreshToken };
  }

  public async refreshToken(tokenPayload: RefreshTokenPayload) {
    // get account by id
    const record = await this.#knex
      .select([
        'accounts.id',
        'accounts.password',
        this.#knex.raw('users.id as "userID"'),
        this.#knex.raw('json_agg(distinct ??) AS "roles"', ['account2roles.role']),
        this.#knex.raw('json_agg(distinct ??) AS "privileges"', ['role2privileges.privilege']),
      ])
      .groupBy(['accounts.id', 'users.id'])
      .from<
        AccountsTableRecord,
        Pick<AccountsTableRecord, 'id'> & {
          readonly userID: string | null;
          readonly roles: AccountRole[] | [null];
          readonly privileges: PrivilegeName[] | [null];
        }
      >('accounts')
      .where('accounts.id', '=', tokenPayload.auid)
      .leftJoin('users', 'users.account', 'accounts.id')
      .leftJoin('account2roles', 'account2roles.account', 'accounts.id')
      .leftJoin('role2privileges', 'role2privileges.role', 'account2roles.role')
      .andWhere('accounts.status', '=', 'allowed')
      .first();

    // return error if account not found
    if (!record) {
      return 'Account not found';
    }
    const { roles, id, userID, privileges } = record;
    const isDeveloper = roles.find(r => r === 'developer');
    const developerPrivileges = AuthentificationService.getPrivilegesList();
    // generate tokens pair
    const { accessToken, refreshToken } = this.generateTokens({
      auid: id,
      uuid: userID,
      roles: roles.filter(r => r !== null),
      privileges: isDeveloper ? developerPrivileges : privileges.filter(p => p !== null),
    });

    // In this example, we save the token ID in Redis,
    // which allows you to specify the time after which
    // the record will be automatically deleted from store
    try {
      await this.#redis.set(
        `tokens:${accessToken.payload.id}`,
        JSON.stringify(accessToken.payload),
        'PX',
        accessToken.payload.exp * 1000 - new Date().getTime(),
      );
      await this.#redis.set(
        `tokens:${refreshToken.payload.id}`,
        JSON.stringify(refreshToken.payload),
        'PX',
        refreshToken.payload.exp * 1000 - new Date().getTime(),
      );

      // We can remove the ID of old tokens from your storage
      await this.#redis.del(`tokens:${tokenPayload.id}`, `tokens:${tokenPayload.associated.id}`);

      // You should put the ID of the old tokens in the blacklist
      // so that authorization for them is no longer possible
      // `tokenPayload` - is a old access token payload data
      await this.#redis.set(
        `revoked:${tokenPayload.id}`,
        'access',
        'PX',
        Math.max(tokenPayload.exp * 1000 - new Date().getTime(), 1000),
      );

      await this.#redis.set(
        `revoked:${tokenPayload.associated.id}`,
        'refresh',
        'PX',
        Math.max(tokenPayload.associated.exp * 1000 - new Date().getTime(), 1000),
      );
    } catch (err) {
      throw new Error(`Refresh token error. ${err}`);
    }

    // return both tokens
    return { accessToken, refreshToken };
  }

  public async revokeToken(tokenID: string): Promise<void> {
    try {
      await this.#redis.set(
        `revoked:${tokenID}`,
        'access',
        'PX',
        this.#jwt.accessTokenExpiresIn * 1000,
      );
      await this.#redis.del(`tokens:${tokenID}`);
      await this.#knex('tokens')
        .del()
        .where('id', '=', tokenID)
        .andWhere('associated', '=', tokenID);
    } catch (err) {
      throw new Error(`Revoke token error. ${err}`);
    }
  }

  public static extractTokenFromSubscription(connectionParams: any): string | false {
    if (typeof connectionParams === 'object' && TOKEN_BEARER_KEY in connectionParams) {
      const [bearer, token] = String(connectionParams[TOKEN_BEARER_KEY]).split(' ');

      if (bearer === TOKEN_BEARER && token !== '') {
        return String(token);
      }
    }

    return false;
  }

  public static extractTokenFromRequest(request: http.IncomingMessage): string | false {
    const { headers } = request;

    // try to get access token from headers
    if (TOKEN_BEARER_KEY.toLocaleLowerCase() in headers) {
      const [bearer, tokenFromHeader] = String(headers[TOKEN_BEARER_KEY.toLocaleLowerCase()]).split(
        ' ',
      );

      if (bearer === TOKEN_BEARER && tokenFromHeader !== '') {
        return String(tokenFromHeader);
      }
    }

    return false;
  }

  public static async verifyToken(
    props: VerifyTokenProps,
  ): Promise<AccessTokenPayload | RefreshTokenPayload | never> {
    const { jwt, token } = props;
    const { privateKey, algorithm, verifiedIssuers } = jwt;
    const payload = jsonwebtoken.verify(String(token), privateKey, {
      algorithms: [algorithm],
      issuer: verifiedIssuers,
    }) as AccessTokenPayload | RefreshTokenPayload;

    const defaultToken = AuthentificationService.getDefaultTokenPayload();
    const tokenPayload = {
      ...defaultToken,
      ...payload,
    };

    if (!validate(tokenPayload.auid)) {
      throw new Error('Invalid Account ID in field auid');
    }

    if (!validate(tokenPayload.id)) {
      throw new Error('Invalid Token ID in field auid');
    }

    return tokenPayload;
  }

  public async checkTokenRevoke(token: AccessTokenPayload | RefreshTokenPayload): Promise<boolean> {
    const has = await this.#redis.get(`revoked:${token.id}`);

    return has !== null;
  }

  public static isAccessTokenPayload(
    payload: AccessTokenPayload | RefreshTokenPayload,
  ): payload is AccessTokenPayload {
    return payload.type === 'access';
  }

  public static isRefreshTokenPayload(
    payload: AccessTokenPayload | RefreshTokenPayload,
  ): payload is RefreshTokenPayload {
    return payload.type === 'refresh';
  }

  public static isEmptyToken(tokenPayload: AccessTokenPayload) {
    const { id } = tokenPayload;

    return typeof id === 'undefined' || id === ACCESS_TOKEN_EMPTY_ID;
  }

  public static getPrivilegesList(): PrivilegeName[] {
    const privileges: PrivilegeName[] = [
      'Users_CreateEditUser',
      'Users_PrivilegesAssignment',
      'Users_UsersList',
    ];

    return privileges;
  }
}

export default AuthentificationService;

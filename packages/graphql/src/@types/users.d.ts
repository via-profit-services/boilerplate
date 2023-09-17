declare module 'users' {
  import type { IncomingMessage } from 'node:http';
  import type { GraphQLSchema } from 'graphql';
  import type { Algorithm } from 'jsonwebtoken';
  import type { Knex } from 'knex';
  import type IORedis from 'ioredis';
  import type { Middleware, CursorConnection } from '@via-profit-services/core';
  import type { FileType } from 'files';

  export type AccountStatus = 'allowed' | 'forbidden';
  export type AccountRole = 'developer' | 'administrator' | 'viewer' | 'copywriter' | 'optimizator';
  export type PrivilegeName =
    | 'Users_PrivilegesAssignment'
    | 'Users_CreateEditUser'
    | 'Users_UsersList';

  export interface JwtConfig {
    readonly algorithm?: Algorithm;

    /**
     * Unix time that determines the moment when the Access Token becomes invalid\
     * (the access token lifetime in seconds)\
     * \
     * Unit: `seconds`\
     * Example: `1800` (30 minutes)
     */
    readonly accessTokenExpiresIn?: number;

    /**
     * Unix time that determines the moment when the Refresh Token becomes invalid\
     * (the refresh token lifetime in seconds)\
     * \
     * Unit: `seconds`\
     * Example: `2.592e6` (30 days)
     */
    readonly refreshTokenExpiresIn?: number;

    /**
     * Cert private key
     */
    readonly privateKey: Buffer;

    /**
     * Cert public key
     */
    readonly publicKey: Buffer;
    /**
     * A case-sensitive string or URI that is the unique identifier of the token-generating party
     */
    readonly issuer?: string;
    /**
     * An array of case-sensitive string or URI \
     * that is the unique identifier of the token-generating party
     */
    readonly verifiedIssuers?: string[];
  }

  export interface TokenPackage {
    readonly accessToken: {
      readonly token: string;
      readonly payload: AccessTokenPayload;
    };
    readonly refreshToken: {
      readonly token: string;
      readonly payload: RefreshTokenPayload;
    };
  }

  export interface AccessTokenPayload {
    readonly type: 'access';
    /**
     * Access token ID
     */
    readonly id: string;

    /**
     * User ID
     */
    readonly uuid: string;

    /**
     * Account ID
     */
    readonly auid: string;

    /**
     * Account roles array
     */
    readonly roles: AccountRole[];

    /**
     * Account privileges array
     */
    readonly privileges: PrivilegeName[];

    /**
     * Unix time that determines the moment when the Token becomes invalid
     */
    readonly exp: number;

    /**
     * A case-sensitive string or URI that is the unique identifier of the token-generating party
     */
    readonly iss: string;
  }

  export interface RefreshTokenPayload {
    readonly type: 'refresh';
    /**
     * Access token ID
     */
    readonly id: string;

    /**
     * User ID
     */
    readonly uuid: string;

    /**
     * Account ID
     */
    readonly auid: string;

    /**
     * Access token ID associated value
     */
    readonly associated: AccessTokenPayload;

    /**
     * Unix time that determines the moment when the Token becomes invalid
     */
    readonly exp: number;

    /**
     * A case-sensitive string or URI that is the unique identifier of the token-generating party
     */
    readonly iss: string;
  }

  export interface AccessToken {
    readonly token: string;
    readonly payload: AccessTokenPayload;
  }

  export interface RefreshToken {
    readonly token: string;
    readonly payload: RefreshTokenPayload;
  }

  export interface AccountsTableModel {
    readonly id: string;
    readonly login: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly password: string;
    readonly status: AccountStatus;
  }

  export interface AccountsTableRecord {
    readonly id: string;
    readonly login: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly password: string;
    readonly status: AccountStatus;
  }

  export interface Account2RolesTableModel {
    readonly account: string;
    readonly role: AccountRole;
  }

  export interface Account2RolesTableRecord {
    readonly account: string;
    readonly role: AccountRole;
  }

  export interface Role2PrivilegesTableModel {
    readonly role: AccountRole;
    readonly privilege: PrivilegeName;
  }

  export interface Role2PrivilegesTableRecord {
    readonly role: AccountRole;
    readonly privilege: PrivilegeName;
  }

  export interface PrivilegesTableModel {
    readonly privilege: PrivilegeName;
  }

  export interface PrivilegesTableRecord {
    readonly privilege: PrivilegeName;
  }

  export interface RolesTableModel {
    readonly role: AccountRole;
  }

  export interface RolesTableRecord {
    readonly role: AccountRole;
  }

  export interface UsersTableModel {
    readonly id: string;
    readonly name: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly account: string | null;
  }

  export interface UsersTableRecord {
    readonly id: string;
    readonly name: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly account: string | null;
  }

  export interface Account {
    readonly id: string;
    readonly login: string;
    readonly password: string;
    readonly status: AccountStatus;
    readonly roles: ReadonlyArray<AccountRole>;
    readonly privileges: ReadonlyArray<PrivilegeName>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly user: string | null;
  }

  export interface User {
    readonly id: string;
    readonly name: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly account: string | null;
    readonly avatar: string | null;
  }

  export type UsersMiddlewareFactory = (props: { jwt: JwtConfig }) => Middleware;

  export interface UsersServiceProps {
    readonly knex: Knex;
  }

  export interface GetUsersConnectionProps {
    readonly first?: number | null;
    readonly last?: number | null;
    readonly after?: string | null;
    readonly before?: string | null;
    readonly account?: readonly string[] | null;
    readonly id?: readonly string[] | null;
    readonly type?: readonly FileType[] | null;
    readonly orderBy?:
      | {
          readonly field: 'name' | 'createdAt' | 'updatedAt';
          readonly direction: 'asc' | 'desc';
        }[]
      | null;
    readonly search?:
      | {
          readonly field: 'name';
          readonly query: string;
        }[]
      | null;
  }

  export interface UsersConnectionCursor {
    offset: number;
    account?: readonly string[] | null;
    id?: readonly string[] | null;
    type?: readonly FileType[] | null;
    orderBy?: GetUsersConnectionProps['orderBy'] | null;
    search?: GetUsersConnectionProps['search'] | null;
  }

  export interface GetAccountsConnectionProps {
    readonly first?: number | null;
    readonly last?: number | null;
    readonly after?: string | null;
    readonly before?: string | null;
    readonly user?: readonly string[] | null;
    readonly id?: readonly string[] | null;
    readonly orderBy?:
      | {
          readonly field: 'login' | 'createdAt' | 'updatedAt';
          readonly direction: 'asc' | 'desc';
        }[]
      | null;
    readonly search?:
      | {
          readonly field: 'login';
          readonly query: string;
        }[]
      | null;
  }

  export interface AccountsConnectionCursor {
    offset: number;
    user?: readonly string[] | null;
    id?: readonly string[] | null;
    orderBy?: GetAccountsConnectionProps['orderBy'] | null;
    search?: GetAccountsConnectionProps['search'] | null;
  }

  export interface GetUserFilesConnectionProps {
    readonly first?: number | null;
    readonly last?: number | null;
    readonly after?: string | null;
    readonly before?: string | null;
    readonly id?: readonly string[] | null;
    readonly type?: readonly FileType[] | null;
  }

  export interface AuthentificationServiceProps {
    readonly knex: Knex;
    readonly jwt: JwtConfig;
    readonly redis: IORedis;
  }

  export interface VerifyTokenProps {
    readonly token: string;
    readonly jwt: JwtConfig;
  }

  export interface CreateTokenProps {
    readonly login: string;
    readonly password: string;
  }

  export interface GenerateTokenPayload {
    readonly uuid: string;
    readonly auid: string;
    readonly roles: AccountRole[];
    readonly privileges: PrivilegeName[];
  }

  export class AuthentificationService {
    constructor(props: AuthentificationServiceProps);
    checkTokenRevoke(tokenPayload: AccessTokenPayload | RefreshTokenPayload): Promise<boolean>;
    refreshToken(tokenPayload: RefreshTokenPayload): Promise<false | string | TokenPackage>;
    revokeToken(tokenID: string): Promise<void>;
    createToken(props: CreateTokenProps): Promise<false | string | TokenPackage>;
    generateTokens(
      payload: GenerateTokenPayload,
      exp?: {
        access: number;
        refresh: number;
      },
    ): TokenPackage;
    static getDefaultTokenPayload(): AccessTokenPayload;
    static getPrivilegesList(): PrivilegeName[];
    static extractTokenFromSubscription(connectionParams: any): string | false;
    static extractTokenFromRequest(request: IncomingMessage): string | false;
    static isAccessTokenPayload(
      payload: AccessTokenPayload | RefreshTokenPayload,
    ): payload is AccessTokenPayload;
    static isRefreshTokenPayload(
      payload: AccessTokenPayload | RefreshTokenPayload,
    ): payload is RefreshTokenPayload;
    static isEmptyToken(tokenPayload: AccessTokenPayload): boolean;
    static verifyToken(props: VerifyTokenProps): Promise<AccessTokenPayload | RefreshTokenPayload>;
  }

  export class UsersService {
    constructor(props: UsersServiceProps);
    updateAccount(id: string, data: Partial<AccountsTableModel>): Promise<void>;
    createAccount(data: AccountsTableModel): Promise<string>;
    deleteAccount(id: string): Promise<void>;
    deleteAccounts(ids: string[]): Promise<void>;
    checkLoginExists(login: string, skipId?: string): Promise<boolean>;
    createUser(data: UsersTableModel): Promise<string>;
    updateUser(id: string, data: Partial<UsersTableModel>): Promise<void>;
    getUsersConnection(props: GetUsersConnectionProps): Promise<CursorConnection<User>>;
    getAccountsConnection(props: GetAccountsConnectionProps): Promise<CursorConnection<Account>>;
    deleteUsers(ids: readonly string[]): Promise<void>;
    deleteUser(id: string): Promise<void>;
  }

  export default GraphQLSchema;
}

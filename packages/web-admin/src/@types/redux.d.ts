import { Dispatch } from 'redux';
import { UsersListQuery$variables } from '~/relay/artifacts/UsersListQuery.graphql';
import { PagesListQuery$variables } from '~/relay/artifacts/PagesListQuery.graphql';

export {};

declare global {
  export type ThemeName = 'standardLight' | 'standardDark';
  export type FontSize = 'small' | 'normal' | 'medium' | 'large';
  export type LocaleName = 'ru-RU';
  export type AccountRole =
    | 'DEVELOPER'
    | 'ADMINISTRATOR'
    | 'VIEWER'
    | 'OPTIMIZATOR'
    | 'COPYWRITER'
    | '%future added value';
  export type TokenType = 'ACCESS' | 'REFRESH' | '%future added value';
  export interface AccessToken {
    readonly token: string;
    readonly payload: {
      readonly id: string;
      readonly uuid: string;
      readonly exp: number;
      readonly iss: string | null;
      readonly roles: ReadonlyArray<AccountRole>;
      readonly type: TokenType;
    };
  }

  export interface RefreshToken {
    readonly token: string;
    readonly payload: {
      readonly id: string;
      readonly uuid: string;
      readonly exp: number;
      readonly iss: string | null;
      readonly type: TokenType;
    };
  }

  export type ReduxStore = {
    readonly auth: {
      readonly accessToken: AccessToken | null;
      readonly refreshToken: RefreshToken | null;
    };
    readonly server: {
      readonly graphqlEndpoint: string | null;
      readonly subscriptionEndpoint: string | null;
    };
    readonly ui: {
      readonly theme: 'standardLight' | 'standardDark';
      readonly fontSize: 'small' | 'normal' | 'medium' | 'large';
      readonly locale: 'ru-RU';
    };
    readonly usersListVariables: UsersListQuery$variables;
    readonly pagesListVariables: PagesListQuery$variables;
  };
}

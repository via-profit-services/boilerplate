/**
 * If the user has not received the token,
 * or the token has been revoked,
 * then the current value of the token will contain this value
 */
export const ACCESS_TOKEN_EMPTY_ID = 'NOT_ASSIGNED';

/**
 * If the user has not received the token,
 * or the token has been revoked,
 * then the current value of the token «uuid» will
 * contain this value
 */
export const ACCESS_TOKEN_EMPTY_UUID = 'NOT_ASSIGNED';

/**
 * If the user has not received the token,
 * or the token has been revoked,
 * then the current value of the token «iss» will
 * contain this value
 */
export const ACCESS_TOKEN_EMPTY_ISSUER = 'NOT_ASSIGNED';

/**
 * Name of the token header
 */
export const TOKEN_BEARER_KEY = 'Authorization';

/**
 * Name of the token type
 */
export const TOKEN_BEARER = 'Bearer';

/**
 * Relay persistent quesries query key name
 * @see: https://relay.dev/docs/guides/persisted-queries
 */
export const PERSISTED_QUERY_KEY = 'documentId';

/**
 * Redis key name for the web pages cache prefix
 */
export const REDIS_KEY_PAGES_PATH_CACHE = 'cache:pages:path';

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: 'development' | string;
    GRAPHQL_ENDPOINT?: string;
    GRAPHQL_SUBSCRIPTION?: string;
    GRAPHQL_PERSISTENS?: string;
    SERVER_PORT?: string;
    SERVER_HOSTNAME?: string;
    HTML_CACHE_EXP?: string;
    REDIS_HOST?: string;
    REDIS_PORT?: string;
    REDIS_PASSWORD?: string;
    REDIS_DB?: string;
  }
}

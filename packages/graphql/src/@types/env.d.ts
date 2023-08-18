declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    TEST?: string;
    DEBUG?: string;
    GRAPHQL_PORT?: string;
    GRAPHQL_HOST?: string;
    GRAPHQL_ENDPOINT?: string;
    GRAPHQL_SUBSCRIPTIONS?: string;
    FILE_STORAGE_HOSTNAME?: string;
    FILE_STORAGE_STATIC_PATH?: string;
    FILE_STORAGE_CACHE_PATH?: string;
    IMAGE_MAGICK_BIN_PATH?: string;
    DB_HOST?: string;
    DB_USER?: string;
    DB_NAME?: string;
    DB_PASSWORD?: string;
    REDIS_HOST?: string;
    REDIS_PORT?: string;
    REDIS_PASSWORD?: string;
    REDIS_DB?: string;
    SMSC_LOGIN?: string;
    SMSC_PASSWORD?: string;
    JWT_PUBLIC_KEY_PATH?: string;
    JWT_PRIVATE_KEY_PATH?: string;
    JWT_ALGHORITM?: string;
    ACCESS_TOKEN_EXPIRES_IN?: string;
    LOG_DIR?: string;
  }
}

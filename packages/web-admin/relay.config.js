/* eslint-disable */
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  src: './src',
  artifactDirectory: './src/relay/artifacts',
  schema: './src/relay/schema.graphql',
  persistConfig:
  process.env.USE_PERSISTENS_QUERIES === 'true'
    ? {
        url: process.env.GRAPHQL_PERSISTENS,
        params: {},
      }
    : undefined,
  customScalars: {
    DateTime: 'string',
    Date: 'string',
    Time: 'string',
    EmailAddress: 'string',
    URL: 'string',
    Money: 'number',
    JSON: 'any',
    JSONObject: 'any',
    FileUpload: 'File',
    Void: 'null',
  },
  language: 'typescript',
  exclude: ['**/node_modules/**', '**/__mocks__/**', '**/artifacts/**'],
};

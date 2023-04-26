/* eslint-disable */
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const dotenv = require('dotenv');
const { URL } = require('url');
const { buildClientSchema, getIntrospectionQuery, printSchema } = require('graphql/utilities');
const relayConfig = require('../relay.config');

dotenv.config();

const downloadSchema = async () => {
  return new Promise((resolve, reject) => {
    if (!String(process.env.GRAPHQL_ENDPOINT).length) {
      reject([{ msg: 'Check the «GRAPHQL_ENDPOINT» variable on process.env' }]);
    }

    const url = new URL(process.env.GRAPHQL_ENDPOINT || 'http://unknownhost');
    const request = http.request(
      {
        host: url.hostname,
        port: Number(url.port),
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      socket => {
        /**
         * @type Buffer[];
         */
        const payload = [];
        socket.on('data', buffer => {
          payload.push(buffer);
        });

        socket.on('end', () => {
          const { data, errors } = JSON.parse(Buffer.concat(payload).toString());

          if (errors) {
            reject(errors);
          }

          resolve(data);
        });
      },
    );

    request.write(
      JSON.stringify({
        query: getIntrospectionQuery(),
      }),
    );

    request.end();
  });
};

downloadSchema()
  .then(data => {
    const sdl = printSchema(buildClientSchema(data));
    fs.writeFileSync(path.resolve(relayConfig.schema), sdl);
    console.log('Schema downloaded successfully');
    process.exit(0);
  })
  .catch(errors => {
    console.log('Schema downloading error');
    console.log(errors);
    process.exit(1);
  });

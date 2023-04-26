import zlib from 'node:zlib';
import stream from 'node:stream';
import http from 'node:http';
import { URL } from 'node:url';
import { FetchFunction } from 'relay-runtime';

type Props = { graphqlEndpoint: string; subscriptionEndpoint: string };

type FetchFunctionFactory = (props: Props) => FetchFunction;

const fetchFunctionFactory: FetchFunctionFactory = props => {
  const { graphqlEndpoint } = props;
  if (graphqlEndpoint === '') {
    throw new Error(`Invalid GraphQL endpoint. Got «${graphqlEndpoint}»`);
  }

  const { protocol, hostname, port, pathname } = new URL(graphqlEndpoint);

  const fetchFunction: FetchFunction = (operation, variables) =>
    new Promise((resolve, reject) => {
      const request = http.request(
        {
          method: 'POST',
          protocol,
          hostname,
          port,
          path: pathname,
          headers: {
            'Content-Type': 'application/json',
            'Accept-Encoding': 'br',
          },
        },
        response => {
          const contentEncoding = String(response.headers?.['content-encoding']);
          const buffers: Buffer[] = [];
          let resp: stream.Transform | http.IncomingMessage;
          switch (contentEncoding) {
            case 'br':
              resp = response.pipe(zlib.createBrotliDecompress());
              break;
            case 'gzip':
              resp = response.pipe(zlib.createGunzip());
              break;
            default:
              resp = response;
              break;
          }

          resp
            .on('data', data => {
              buffers.push(data);
            })
            .on('end', () => {
              const buffer = Buffer.concat(buffers);
              resolve(JSON.parse(buffer.toString()));
            });
        },
      );
      request.on('error', err => {
        reject({
          errors: [{ message: err.message }],
        });
      });
      request.write(
        JSON.stringify({
          documentId: operation.id,
          query: operation.text,
          variables,
        }),
      );
      request.end();
    });

  return fetchFunction;
};

export default fetchFunctionFactory;

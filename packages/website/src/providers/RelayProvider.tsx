/* eslint-disable no-console */
import React from 'react';
import {
  FetchFunction,
  SubscribeFunction,
  Observable,
  Environment,
  Network,
  Store,
  RecordSource,
} from 'relay-runtime';
import { GraphQLError } from 'graphql';
import { createClient, NextMessage, Message, Client } from 'graphql-ws';
import { RelayEnvironmentProvider } from 'react-relay';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';

interface RelayProviderProps {
  readonly children: React.ReactNode | React.ReactNode[];
  readonly storeRecords?: Record<string, any>;
}

const selector = createStructuredSelector({
  graphqlEndpoint: (store: ReduxStore) => store.server.graphqlEndpoint,
  subscriptionEndpoint: (store: ReduxStore) => store.server.subscriptionEndpoint,
});

const RelayProvider: React.FC<RelayProviderProps> = props => {
  const { children, storeRecords } = props;
  const { graphqlEndpoint, subscriptionEndpoint } = useSelector(selector);
  const graphqlEndpointRef = React.useRef(graphqlEndpoint);
  const subscriptionEndpointRef = React.useRef(subscriptionEndpoint);
  const subscriptionClientRef = React.useRef<Client | null>(null);
  const subscriptionSocketRef = React.useRef<WebSocket | null>(null);

  if (graphqlEndpointRef.current !== graphqlEndpoint) {
    graphqlEndpointRef.current = graphqlEndpoint;
  }

  if (subscriptionEndpointRef.current !== subscriptionEndpoint) {
    subscriptionEndpointRef.current = subscriptionEndpoint;
  }

  if (!subscriptionClientRef.current && typeof window !== 'undefined') {
    console.debug('[Relay] Subscription client init');
    subscriptionClientRef.current = createClient({
      retryWait: async attempt => {
        await new Promise(resolve => setTimeout(resolve, Math.min(attempt * 1000, 5000)));
      },
      retryAttempts: 30,
      url: subscriptionEndpointRef.current || 'unknown',
      on: {
        connected: socket => {
          (subscriptionSocketRef.current as any) = socket;
          console.log('%c%s', 'color:#009627', 'WebSocket connected');
        },
        closed: () => console.log('%c%s', 'color:#ff4e4e', 'WebSocket closed'),
        error: err => console.log('%c%s', 'color:#ff4e4e', 'WebSocket error', err),
        message: message => {
          if (typeof message === 'undefined') {
            return;
          }
          const isNextMessage = (m: Message): m is NextMessage => m.type === 'next';

          if (isNextMessage(message)) {
            const { data } = message.payload;
            if (typeof data === 'object') {
              Object.entries(data as any).forEach(([trigger, payload]) => {
                console.groupCollapsed(
                  '%c%s%c%s',
                  'color:#009627;',
                  '• ',
                  'color:#009627;',
                  `WebSocket message «${trigger}»`,
                );
                console.log(payload);
                console.groupEnd();
              });
            }
          }
        },
      },
    });
  }

  const relayFetch = React.useCallback<FetchFunction>(
    async (operation, variables, _cacheConfig, uploadables) => {
      const request: RequestInit = {
        method: 'POST',
        headers: {
          'Accept-Encoding': 'gzip',
        },
      };

      if (uploadables) {
        if (!window.FormData) {
          console.error('Uploading files without `FormData` not supported.');
        }

        const formData = new FormData();
        const map: Record<string, [string]> = {};

        let filesFieldName = 'variables.f';

        Object.keys(uploadables).forEach((_file, index) => {
          Object.entries(variables).forEach(([fieldName, fieldValue]) => {
            if (Array.isArray(fieldValue) && typeof fieldValue[index]?.name === 'string') {
              filesFieldName = `variables.${fieldName}`;
            }
          });

          map[index] = [`${filesFieldName}.${index}`];
        });

        formData.append(
          'operations',
          JSON.stringify({
            query: operation.text,
            documentId: operation.id,
            variables: {
              ...variables,
              files: Object.keys(uploadables).map(() => null),
            },
          }),
        );
        formData.append('map', JSON.stringify(map));

        Object.entries(uploadables).forEach(([_key, fileData], index) => {
          formData.append(String(index), fileData);
        });

        request.body = formData;
      } else {
        request.headers = {
          ...request.headers,
          'Content-Type': 'application/json',
        };

        request.body = JSON.stringify({
          documentId: operation.id,
          query: operation.text,
          variables,
        });
      }

      const body = await fetch(graphqlEndpointRef.current || 'unknown-graphql-endpoint', request)
        .then(response => response.json())
        .catch(err => {
          console.error(err);

          return {
            data: null,
            errors: [
              {
                message: `GraphQL fetch error`,
              },
            ],
          };
        });

      if (process.env.NODE_ENV === 'development') {
        const color = body.data && !body.errors ? '#009627' : '#f44336';
        const queryTime =
          typeof body?.extensions?.queryTime === 'number'
            ? parseFloat(body.extensions.queryTime.toFixed(2))
            : null;
        const queryTimeColor = queryTime && queryTime >= 100 ? 'orange' : 'white';
        console.groupCollapsed(
          '%c%s%c%s%c%s',
          `color:${color};`,
          'GraphQL',
          'color: initial',
          ` ${operation.operationKind} ${operation.name}`,
          `color:${queryTimeColor}`,
          ` ${typeof queryTime === 'number' ? `${queryTime}ms` : ''}`,
        );
        console.log('%c%s', `color:${color}`, 'Request ', graphqlEndpointRef.current);
        if (operation.text) {
          console.groupCollapsed('%c%s', `color:${color}`, operation.operationKind);
          console.log(operation.text);
          console.groupEnd();
        }

        if (operation.id) {
          console.groupCollapsed('%c%s', `color:${color}`, `${operation.operationKind} ID`);
          console.log(operation.id);
          console.groupEnd();
        }

        // headers
        console.groupCollapsed('%c%s', `color:${color}`, 'Headers');
        console.table(request.headers);
        console.groupEnd();

        // variables
        console.groupCollapsed('%c%s', `color:${color}`, 'Variables');
        console.groupCollapsed('as Object');
        console.log(variables);
        console.groupEnd();
        console.groupCollapsed('as JSON string');
        console.log(JSON.stringify(variables));
        console.groupEnd();
        console.groupEnd();

        if (uploadables) {
          const filesArray = Object.values(uploadables);
          console.groupCollapsed('%c%s', `color:${color}`, `Files (${filesArray.length})`);
          console.table(filesArray);
          console.groupEnd();
        }
        if (body.data && !body.errors) {
          console.groupCollapsed('%c%s', `color:${color}`, 'Response');
          console.log(body.data);
          console.groupEnd();
        }

        if (body.errors) {
          console.groupCollapsed('%c%s', `color:${color}`, 'Errors');
          if (Array.isArray(body.errors)) {
            body.errors.forEach((error: Error) => {
              console.log('%c%s', `color:${color}`, error.message);
              console.groupCollapsed('%c%s', `color:${color}`, 'Details');
              console.log(error);
              console.groupEnd();
            });
          }
          console.log();
          console.groupEnd();
        }
        console.groupEnd();
      }

      return body;
    },
    [],
  );

  /**
   * Subscribe observer
   */
  const relaySubscribe: SubscribeFunction = React.useCallback(
    (operation, variables) =>
      Observable.create(sink => {
        const { id, name, text } = operation;

        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log(
            '%c%s%c%s',
            'color:#009627;',
            '• ',
            'color:#bb7bff;',
            'GraphQL Subscription',
            name,
          );
        }

        return subscriptionClientRef.current?.subscribe(
          {
            operationName: name,
            query: text || '',
            variables,
            // persisted query support
            extensions: id
              ? {
                  documentId: id,
                }
              : null,
          },
          {
            ...(sink as any),
            error: err => {
              if (err instanceof Error) {
                return sink.error(err);
              }

              if (err instanceof CloseEvent) {
                return sink.error(
                  // reason will be available on clean closes
                  new Error(
                    `WebSocket with Subscription «${operation.name}» closed with event ${
                      err.code
                    } with reason ${err.reason || ''}`,
                  ),
                );
              }

              if (Array.isArray(err)) {
                return sink.error(
                  new Error((err as GraphQLError[]).map(({ message }) => message).join(', ')),
                );
              }

              return sink.error(err as Error);
            },
          },
        );
      }),
    [],
  );

  /**
   * Store
   */
  const relayStore = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      console.debug('[Relay] Store init');
    }

    return new Store(new RecordSource(storeRecords), {
      queryCacheExpirationTime: 5 * 60 * 1000,
    });
  }, [storeRecords]);

  /**
   * Network
   */
  const relayNetwork = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      console.debug('[Relay] Network init');
    }

    return Network.create(relayFetch, relaySubscribe);
  }, [relayFetch, relaySubscribe]);

  /**
   * Environment
   */
  const relayEnvironment = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      console.debug('[Relay] Environment init');
    }

    return new Environment({
      isServer: typeof window === 'undefined',
      store: relayStore,
      network: relayNetwork,
    });
  }, [relayStore, relayNetwork]);

  return (
    <RelayEnvironmentProvider environment={relayEnvironment}>{children}</RelayEnvironmentProvider>
  );
};

export default RelayProvider;

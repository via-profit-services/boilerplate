import bootstrap from '~/app';

// Configure the app
const { server, config, loggerService } = bootstrap();
const { port, host, endpoint, subscriptions } = config;

// Start the server
server.listen(port, host, () => {
  loggerService.log(
    'info',
    'bootstrap',
    `GraphQL server started at http://${host}:${port}${endpoint}`,
  );
  loggerService.log(
    'info',
    'bootstrap',
    `Websocket server started at ws://${host}:${port}${subscriptions}`,
  );
  loggerService.log('info', 'bootstrap', `Voyager URL: http://${host}:${port}/voyager`);
});

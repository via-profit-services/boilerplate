const { execSync, spawn } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');
const dotenv = require('dotenv');
const { URL } = require('url');


const colorsMap = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  Underscore: '\x1b[4m',
  Blink: '\x1b[5m',
  Reverse: '\x1b[7m',
  Hidden: '\x1b[8m',
  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',
  FgGray: '\x1b[90m',
  BgBlack: '\x1b[40m',
  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[43m',
  BgBlue: '\x1b[44m',
  BgMagenta: '\x1b[45m',
  BgCyan: '\x1b[46m',
  BgWhite: '\x1b[47m',
  BgGray: '\x1b[100m',
};

const colored = (cls, message) => console.log(`${cls}%s${colorsMap.Reset}`, message);

const delay = async (timeMs) => new Promise(resolve => {
  setTimeout(() => {
    resolve();
  }, timeMs)
});

const serverEnvFile = path.resolve(__dirname, '../packages/graphql/.env');
const serverEnv = dotenv.parse(fs.readFileSync(serverEnvFile, { encoding: 'utf-8' }));
const serverAddress = new URL(`http://${serverEnv.GRAPHQL_HOST}:${serverEnv.GRAPHQL_PORT}${serverEnv.GRAPHQL_ENDPOINT}`);

const waitForServer = async () => {
  try {
    const resposne = await fetch(serverAddress, {
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        operationName: 'CheckVersionQuery',
        variables: {},
        query: /* GraphQL */`
          query CheckVersionQuery {
            version
          }
      `,
      })
    }).then(res => res.json());

    if (!resposne || typeof resposne.data?.version !== 'string') {
      colored(colorsMap.FgRed, `Failed to parse response of ${JSON.stringify(resposne)}`);
      colored(colorsMap.FgGray, 'Try again after 3sec.');

      await delay(3000);

      return waitForServer();
    }

    return true

  } catch (err) {
    colored(colorsMap.FgGray, 'Server checking failed. Try again after 3 sec.');

    await delay(3000);
    return waitForServer();
  }
}


const bootstrap = async () => {

  colored(colorsMap.FgMagenta, `Trying to start GraphQL server at ${serverAddress.toString()}`);
  const serverProc = spawn('npm', ['run', 'start', '--workspace', 'packages/graphql'], { detached: true }); // start parallele

  colored(colorsMap.FgMagenta, 'Checking GraphQL server status');
  colored(colorsMap.FgMagenta, '...');
  await delay(5000);
  await waitForServer(); // will be resolved if server started successfully

  colored(colorsMap.FgGreen, 'Done. GraphQL server started');

  try {
    execSync('npm run download-schema --workspace packages/website');
    execSync('npm run download-schema --workspace packages/admin');

  } catch (err) {
    colored(colorsMap.FgMagenta, 'Download GraphQL scemas for each project');
    colored(colorsMap.FgRed, err);
  }


  colored(colorsMap.FgGreen, 'Done. GraphQL schemas successfully downloaded');

  try {
    execSync('npm run relay --workspace packages/website');
    execSync('npm run relay --workspace packages/admin');

  } catch (err) {
    colored(colorsMap.FgMagenta, 'Make Relay artifacts for each project');
    colored(colorsMap.FgRed, err);
  }

  process.kill(-serverProc.pid);

  colored(colorsMap.FgGreen, 'Done. Complete for all');
  colored(colorsMap.FgGreen, '...');

  colored(colorsMap.FgGreen, 'Now you can start your projects, just run «npm run start»');
  process.exit(1);

}


bootstrap();
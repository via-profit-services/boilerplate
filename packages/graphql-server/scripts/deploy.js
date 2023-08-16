/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const dotenv = require('dotenv');
const { execSync } = require('child_process');

const args = process.argv.slice(2);

dotenv.config();

const host = process.env.DEPLOY_HOST;
const user = process.env.DEPLOY_USER;
const sourceDistDir = process.env.DEPLOY_SOURCE_DIR;
const destinationDistDir = process.env.DEPLOY_DESTINATION_DIR;
const execScript = process.env.DEPLOY_EXEC_SCRIPT;

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

if (!host || !user || !sourceDistDir || !destinationDistDir || !execScript) {
  colored(colorsMap.FgRed, 'Failed prepare to deploy. Check the «.env file');
  colored(
    colorsMap.FgMagenta,
    `${host}, ${user}, ${sourceDistDir}, ${destinationDistDir}, ${execScript}`,
  );
  process.exit(1);
}

colored(
  colorsMap.FgMagenta,
  `
======================
     DEPLOY
======================
`,
);

colored(colorsMap.FgYellow, 'Apply latest migrations...');
execSync('npm run migrate:latest --knexfile ./.knex/knexfile.js');

// if (args.includes('--rollback')) {
//   scolored(colorsMap.FgYellow, 'Rollback all migrations...');
//   shell.exec('npm run knex migrate:rollback --all --knexfile ./.knex/knexfile.js');
// }

if (args.includes('--with-seeds')) {
  colored(colorsMap.FgYellow, 'Apply seeds...');
  execSync('npm run seed:run --knexfile ./.knex/knexfile.js');
}

try {
  execSync('rsync --help');
} catch (err) {
  colored(colorsMap.FgRed, 'Please install the rsync package on your OS');
  process.exit(1);
}

colored(colorsMap.FgGreen, 'Remote directories was created successfully');
colored(colorsMap.FgYellow, 'Copy files...');

try {
  execSync(`
ssh -T ${user}@${host}<<EOT
mkdir -p ${destinationDistDir};
EOT`);
} catch (err) {
  colored(colorsMap.FgRed, 'Failed to create remote directory');
  process.exit(1);
}

try {
  execSync(`rsync --progress --recursive ${sourceDistDir}/ ${user}@${host}:${destinationDistDir}`);
} catch (err) {
  colored(colorsMap.FgRed, 'Failed to copy files to remote server');
}

const ecosystemJS = `
module.exports = {
  apps : [
    {
      name: "boilerplate-server",
      script: "./index.js",
      cwd: ".",
      instances: "max",
      exec_mode: "cluster",
    }
]
}

`;
execSync(
  `
ssh -T ${user}@${host}<<EOT
WORK_DIR="${destinationDistDir}";
cd $WORK_DIR;
echo "${ecosystemJS}" > ./ecosystem.config.js
#pm2 restart boilerplate

EOT`,
);

colored(
  colorsMap.FgGreen,
  `
Deploy Succussfully finished
`,
);

import path from 'node:path';
import fs from 'node:fs';
import { Configuration, Entry } from 'webpack';

const knexfile = path.resolve(process.cwd(), './src/database/knexfile.ts');
const migrationsSourceDir = path.resolve(process.cwd(), './src/database/migrations');
const seedsSourceDir = path.resolve(process.cwd(), './src/database/seeds');
const entry: Entry = {
  knexfile,
};

// read mifgration directory and get all migration files path
if (fs.existsSync(migrationsSourceDir)) {
  fs.readdirSync(migrationsSourceDir).forEach(filename => {
    const basename = path.basename(filename);
    if (basename.match(/^\./)) {
      return;
    }

    const entryName = path.basename(basename);

    entry[`migrations/${entryName}`] = path.resolve(migrationsSourceDir, filename);
  });
}

// read mifgration directory and get all migration files path
if (fs.existsSync(seedsSourceDir)) {
  fs.readdirSync(seedsSourceDir).forEach(filename => {
    const basename = path.basename(filename);
    if (basename.match(/^\./)) {
      return;
    }

    const entryName = path.basename(basename);

    entry[`seeds/${entryName}`] = path.resolve(seedsSourceDir, filename);
  });
}

console.debug('');
console.debug('\x1b[32m%s\x1b[0m', 'Migrations and seeds entries:');
Object.entries(entry).forEach(([filename]) => {
  console.debug('\x1b[32m%s\x1b[0m', ` - src/database/${filename}`);
});
console.debug('');

const webpackConfig: Configuration = {
  target: 'node',
  mode: 'production',
  optimization: {
    minimize: false,
  },
  entry,
  output: {
    libraryTarget: 'commonjs2',
    path: path.resolve(process.cwd(), '.knex'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      '~': path.resolve(__dirname, '..', 'src'),
    },
  },
  externals: [
    /^@via-profit-services\/geography\/data\/.*/,
    // KNEX ignore not postgress drivers
    /sqlite3/,
    /mysql2/,
    /mssql/,
    /mariasql/,
    /mysql/,
    /oracle/,
    /strong-oracle/,
    /oracledb/,
    /pg-native/,
    /pg-query-stream/,
    /import-file/,
  ],
};

export default webpackConfig;

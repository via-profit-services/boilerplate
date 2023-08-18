import fs from 'node:fs';
import path from 'node:path';

import {
  LoggerServiceInterface,
  LoggerServiceProps,
  LogLevel,
  LoggerCollection,
  LogLevelMap,
} from 'logger';

class LoggerService implements LoggerServiceInterface {
  #logDir: string;
  #collection: LoggerCollection = new Map();
  #distributionMap: LogLevelMap = {
    error: ['debug', 'error'],
    warn: ['debug', 'warn'],
    info: ['debug', 'info'],
    debug: ['debug'],
  };

  constructor(props: LoggerServiceProps) {
    const { logDir } = props;
    this.#logDir = logDir;
  }

  private getLogStream(level: LogLevel): fs.WriteStream {
    const dateLocaleString = new Date().toLocaleString('sv-SE', {
      timeZoneName: 'short',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const dateTimeArray = dateLocaleString.split(' '); // Should be ['YYYY-MM-DD', 'hh:mm:ss', ...]
    const dateString = dateTimeArray[0]; // Should be YYYY-MM-DD
    const dateArray = dateString.split('-'); // Should be ['YYYY', 'MM', 'DD']

    // Combine filename string like a YYYY/YYYY-MM/error.YYY-MM-DD.log
    const filename = [
      this.#logDir, // Maybe ./log
      dateArray[0], // Should be YYYY/MM/DD
      `${dateArray[0]}-${dateArray[1]}`,
      `${level}.${dateString}.log`, // Should be like a error.YYYY-MM-DD.log
    ].join('/');

    if (this.#collection.has(level)) {
      const logInfo = this.#collection.get(level);

      if (logInfo.filename === `${level}.${dateString}.log` && fs.existsSync(filename)) {
        // console.log(`Log «${logInfo.filename}» already exists. Return it`);

        return logInfo.stream;
      }

      try {
        logInfo.stream.destroy();

        // console.log(`destroy stream of «${logInfo.filename}» `);
      } catch (err) {
        throw new Error(`Failed to destroy log stream at path «${filename}».${err.message}`);
      }
    }

    try {
      if (!fs.existsSync(path.dirname(filename))) {
        fs.mkdirSync(path.dirname(filename), {
          recursive: true,
        });
      }

      // console.log(`create stream for «${level}.${dateString}.log» `);
      this.#collection.set(level, {
        filename: `${level}.${dateString}.log`,
        stream: fs.createWriteStream(filename, {
          flags: 'a+',
        }),
      });

      return this.#collection.get(level).stream;
    } catch (err) {
      throw new Error(
        `Failed to create log file at path «${filename}». Check the permissions of this path. ${err.message}`,
      );
    }
  }

  public log(level: LogLevel, logTag: string, message: string) {
    if (process.env.TEST === 'true') {
      return;
    }

    if (typeof this.#distributionMap[level] === 'undefined') {
      return;
    }

    const dateString = new Date().toLocaleString('ru', {
      timeZone: 'UTC',
      dateStyle: 'short',
      timeStyle: 'long',
    });

    this.#distributionMap[level].forEach(levelName => {
      const messageStr = `[${dateString}] [${level}] [${logTag}] ${message}`;
      const stream = this.getLogStream(levelName);

      try {
        stream.write(`${messageStr}\n`);
      } catch (err) {
        console.error(err instanceof Error ? err.message : 'Unknown Error');
      }
    });
  }
}

export default LoggerService;

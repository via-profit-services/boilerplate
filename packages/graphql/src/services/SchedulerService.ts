import EventEmitter from 'node:events';
import crypto from 'node:crypto';
import process from 'node:process';
import fs from 'node:fs';
import path from 'node:path';

import {
  SchedulerJob,
  SchedulerServiceInterface,
  SchedulerServiceProps,
  SaveJobProps,
  CreateJobProps,
  SchedulerTable,
  SchedulerInstanceInfo,
} from 'scheduler';
import Logger from '~/services/LoggerService';

class SchedulerService implements SchedulerServiceInterface {
  #knex: SchedulerServiceProps['knex'];
  #intervalID: NodeJS.Timeout = null;
  #interval = 60000;
  #emitter: EventEmitter;
  #logger: Logger;
  #timezone: string;
  #infoFile = path.resolve(process.cwd(), '.scheduler.info');

  public constructor(props: SchedulerServiceProps) {
    const { knex, interval, timezone, logger } = props;
    this.#knex = knex;

    this.#interval = typeof interval === 'number' ? Math.max(1000, interval) : this.#interval;
    this.#emitter = new EventEmitter();
    this.#logger = logger;
    this.#timezone = timezone ? timezone : 'UTC';
  }

  public static convertMonthName(expression: string, items: string[]): string {
    for (let i = 0; i < items.length; i++) {
      expression = expression.replace(new RegExp(items[i], 'gi'), (i + 1).toString());
    }

    return expression;
  }

  public static convertAsterisk(expression: string, replecement: string): string {
    if (expression.indexOf('*') !== -1) {
      return expression.replace('*', replecement);
    }

    return expression;
  }

  public static convertAsterisksToRanges(expressions: string[]): string[] {
    expressions[0] = SchedulerService.convertAsterisk(expressions[0], '0-59');
    expressions[1] = SchedulerService.convertAsterisk(expressions[1], '0-59');
    expressions[2] = SchedulerService.convertAsterisk(expressions[2], '0-23');
    expressions[3] = SchedulerService.convertAsterisk(expressions[3], '1-31');
    expressions[4] = SchedulerService.convertAsterisk(expressions[4], '1-12');
    expressions[5] = SchedulerService.convertAsterisk(expressions[5], '0-6');

    return expressions;
  }

  /*
   * The node-cron core allows only numbers (including multiple numbers e.g 1,2).
   * This module is going to translate the month names, week day names and ranges
   * to integers relatives.
   *
   * Month names example:
   *  - expression 0 1 1 January,Sep *
   *  - Will be translated to 0 1 1 1,9 *
   *
   * Week day names example:
   *  - expression 0 1 1 2 Monday,Sat
   *  - Will be translated to 0 1 1 1,5 *
   *
   * Ranges example:
   *  - expression 1-5 * * * *
   *  - Will be translated to 1,2,3,4,5 * * * *
   */
  public static interprete(expression: string) {
    let expressions = SchedulerService.removeSpaces(expression).split(' ');
    expressions = SchedulerService.appendSeccondExpression(expressions);
    expressions[4] = SchedulerService.monthNamesConversion(expressions[4]);
    expressions[5] = SchedulerService.convertWeekDays(expressions[5]);
    expressions = SchedulerService.convertAsterisksToRanges(expressions);
    expressions = SchedulerService.convertAllRanges(expressions);
    expressions = SchedulerService.convertSteps(expressions);

    const retArray = SchedulerService.normalizeIntegers(expressions);

    return retArray.join(' ');
  }

  public static monthNamesConversion(monthExpression: string) {
    const months = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ];
    const shortMonths = [
      'jan',
      'feb',
      'mar',
      'apr',
      'may',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'dec',
    ];

    monthExpression = SchedulerService.convertMonthName(monthExpression, months);
    monthExpression = SchedulerService.convertMonthName(monthExpression, shortMonths);

    return monthExpression;
  }

  public static replaceWithRange(
    expression: string,
    text: string,
    init: string,
    end: string,
  ): string {
    const numbers = [];
    let last = parseInt(end, 10);
    let first = parseInt(init, 10);

    if (first > last) {
      last = parseInt(init, 10);
      first = parseInt(end, 10);
    }

    for (let i = first; i <= last; i++) {
      numbers.push(i);
    }

    return expression.replace(new RegExp(text, 'i'), numbers.join());
  }

  public static convertRange(expression: string): string {
    const rangeRegEx = /(\d+)-(\d+)/;
    let match = rangeRegEx.exec(expression);
    while (match !== null && match.length > 0) {
      expression = SchedulerService.replaceWithRange(expression, match[0], match[1], match[2]);
      match = rangeRegEx.exec(expression);
    }

    return expression;
  }

  public static convertAllRanges = (expressions: string[]): string[] => {
    for (let i = 0; i < expressions.length; i++) {
      expressions[i] = SchedulerService.convertRange(expressions[i]);
    }

    return expressions;
  };

  public static convertSteps(expressions: string[]): string[] {
    const stepValuePattern = /^(.+)\/(\w+)$/;
    for (let i = 0; i < expressions.length; i++) {
      const match = stepValuePattern.exec(expressions[i]);
      const isStepValue = match !== null && match.length > 0;
      if (isStepValue) {
        const baseDivider = match[2];
        if (isNaN(parseInt(baseDivider, 10))) {
          throw baseDivider + ' is not a valid step value';
        }
        const values = match[1].split(',');
        const stepValues = [];
        const divider = parseInt(baseDivider, 10);
        for (let j = 0; j <= values.length; j++) {
          const value = parseInt(values[j], 10);
          if (value % divider === 0) {
            stepValues.push(value);
          }
        }
        expressions[i] = stepValues.join(',');
      }
    }

    return expressions;
  }

  public static convertWeekDayName(expression: string, items: string[]) {
    for (let i = 0; i < items.length; i++) {
      expression = expression.replace(new RegExp(items[i], 'gi'), i.toString());
    }

    return expression;
  }

  public static convertWeekDays(expression: string): string {
    const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const shortWeekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    expression = expression.replace('7', '0');
    expression = SchedulerService.convertWeekDayName(expression, weekDays);

    return SchedulerService.convertWeekDayName(expression, shortWeekDays);
  }

  public static normalizeIntegers(expressions: string[]) {
    const retArray = [];
    for (let i = 0; i < expressions.length; i++) {
      const numbers = expressions[i].split(',');
      for (let j = 0; j < numbers.length; j++) {
        numbers[j] = parseInt(numbers[j], 10).toString();
      }
      retArray[i] = numbers;
    }

    return retArray;
  }

  public static removeSpaces(str: string): string {
    return str.replace(/\s{2,}/g, ' ').trim();
  }

  public static appendSeccondExpression(expressions: string[]): string[] {
    if (expressions.length === 5) {
      return ['0'].concat(expressions);
    }

    return expressions;
  }

  public startScheduler(): this {
    const currentInstanceInfo = this.getShedulerInstance();

    if (currentInstanceInfo) {
      const { pid } = currentInstanceInfo;
      if (this.isPidRunning(pid)) {
        return this;
      }
    }

    this.#intervalID = setInterval(() => {
      this.checkScheduler();
    }, this.#interval);

    const newTaskInfo: SchedulerInstanceInfo = {
      pid: process.pid,
    };

    try {
      fs.writeFileSync(this.#infoFile, JSON.stringify(newTaskInfo), { encoding: 'utf8' });
    } catch (er) {
      this.#logger.log('error', 'scheduler', 'Cannot create scheduller process file');
    }

    return this;
  }

  public stopScheduler(): this {
    const info = this.getShedulerInstance();

    if (info) {
      // Stop interval if is my pid
      if (info.pid === process.pid && this.#intervalID) {
        clearInterval(this.#intervalID);
        this.#intervalID = null;
      }
    }

    // Remove pid file
    try {
      fs.rmSync(this.#infoFile, {
        force: true,
      });
    } catch (err) {
      this.#logger.log('error', 'scheduler', 'Unknown Error while removing scheduler PID file');
    }

    return this;
  }

  public async getJobList(): Promise<SchedulerJob[]> {
    const list = await this.#knex.select('*').from<SchedulerTable, SchedulerTable[]>('scheduler');

    return list;
  }

  public async updateJob(id: string, props: Partial<CreateJobProps>) {
    await this.#knex<SchedulerTable>('scheduler')
      .update({ ...props })
      .where('id', id)
      .returning('id');
  }

  public async saveJob(props: Partial<SaveJobProps[]>) {
    const createdAt = new Date(
      new Date().toLocaleString('en-US', {
        timeZone: 'UTC',
        timeZoneName: 'short',
      }),
    ).toISOString();
    const prepared = props.map(job => ({
      ...job,
      id: job.id ? job.id : crypto.randomUUID(),
      createdAt,
    }));

    await this.#knex<SchedulerTable>('scheduler')
      .insert(prepared)
      .returning('*')
      .onConflict('id')
      .merge();
  }

  public async createJob(props: CreateJobProps): Promise<string> {
    const result = await this.createJobs([props]);

    return result[0];
  }

  public async createJobs(jobs: CreateJobProps[]): Promise<string[]> {
    const createdAt = new Date(
      new Date().toLocaleString('en-US', {
        timeZone: 'UTC',
        timeZoneName: 'short',
      }),
    ).toISOString();
    const result = await this.#knex<SchedulerTable>('scheduler')
      .insert([
        ...jobs.map(job => ({
          ...job,
          createdAt,
        })),
      ])
      .returning('id');

    return [...result.map(({ id }) => id)];
  }

  public async deleteJobs(ids: string[]) {
    await this.#knex<SchedulerTable>('scheduler').del().whereIn('id', ids);
  }

  public async deleteJob(id: string) {
    return this.deleteJobs([id]);
  }

  public on(event: 'scheduler-job-execute', listener: (job: SchedulerJob) => void): this {
    this.#emitter.on(event, listener);

    return this;
  }

  public async getJobsByIds(ids: string[]): Promise<SchedulerJob[]> {
    const nodes = await this.#knex
      .select('*')
      .from<SchedulerTable, SchedulerTable[]>('scheduler')
      .whereIn('id', ids);

    return nodes;
  }

  public once(event: 'scheduler-job-execute', listener: (job: SchedulerJob) => void): this {
    this.#emitter.once(event, listener);

    return this;
  }

  /**
   * Get job list and execute jobs
   * if that time has already come
   */
  private async checkScheduler(): Promise<void> {
    const jobList = await this.getJobList();

    jobList.forEach(job => {
      if (this.isTimeHasAlreadyCome(job.cronTime)) {
        this.#emitter.emit('scheduler-job-execute', job);
        this.updateJob(job.id, { counter: job.counter + 1 });
      }
    });

    return;
  }

  private matchPattern(pattern: string, value: number): boolean {
    if (pattern && pattern.indexOf(',') !== -1) {
      const patterns = pattern.split(',');

      return patterns.indexOf(value.toString()) !== -1;
    }

    return pattern === value.toString();
  }

  /**
   * Check if time has already come
   */
  private isTimeHasAlreadyCome(crontime: string): boolean {
    // get current time with timeZone
    const dtf = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
      timeZone: this.#timezone,
    });
    const currentTime = new Date(dtf.format(new Date()));
    // parse cron time string
    const expressionsArray = SchedulerService.interprete(crontime).split(' ');
    delete expressionsArray[0];
    // validate every expression in cron time string
    // const runOnSecond = this.matchPattern(expressionsArray[0], currentTime.getSeconds());
    const runOnMinute = this.matchPattern(expressionsArray[1], currentTime.getMinutes());
    const runOnHour = this.matchPattern(expressionsArray[2], currentTime.getHours());
    const runOnDay = this.matchPattern(expressionsArray[3], currentTime.getDate());
    const runOnMonth = this.matchPattern(expressionsArray[4], currentTime.getMonth() + 1);
    const runOnWeekDay = this.matchPattern(expressionsArray[5], currentTime.getDay());

    return runOnMinute && runOnHour && runOnDay && runOnMonth && runOnWeekDay;
  }

  /**
   * Returns running task info
   */
  private getShedulerInstance(): SchedulerInstanceInfo | null {
    try {
      if (fs.existsSync(this.#infoFile)) {
        const plainData = fs.readFileSync(this.#infoFile, { encoding: 'utf8' });
        const info: SchedulerInstanceInfo = JSON.parse(plainData);

        return info;
      }

      return null;
    } catch (err) {
      console.error(
        err instanceof Error ? err.message : 'Unknown Error while read scheduler PID file',
      );

      return null;
    }
  }

  /**
   * Test if a process with a given pid is running
   */
  private isPidRunning(pid: number) {
    try {
      return process.kill(pid, 0);
    } catch (err) {
      return err.code === 'EPERM';
    }
  }
}

export default SchedulerService;

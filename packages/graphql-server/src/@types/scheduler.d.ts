declare module 'scheduler' {
  import { Knex } from 'knex';
  import Logger from '~/services/LoggerService';

  export interface SchedulerJob {
    /**
     * Unique cron ID\
     * Example.: `bb96403f-2006-437f-bff2-a9cfe292802b`
     */
    readonly id: string;
    /**
     * Datetime of sheduller job was created\
     * Example.: ``
     */
    readonly createdAt: string;
    /**
     * Cron time format\
     * Example.: `0-1,4 0 0 * * *`
     */
    readonly cronTime: string;
    /**
     * Number of executes\
     * Example: `1`
     */
    readonly counter: number;
    /**
     * Execution command\
     * Example: `remove-orders`
     */
    readonly cmd: string;
    /**
     * entity of the job\
     * Example: `839fd003-f923-4649-be19-2e6ae6f59595`
     */
    readonly entity: string;
  }

  export type CreateJobProps = SchedulerJob;
  export type SaveJobProps = Omit<CreateJobProps, 'id' | 'createdAt'> & {
    id?: string;
  };

  export interface SchedulerServiceProps {
    /**
     * Knex instance
     */
    knex: Knex;
    /**
     * Timeout interval in milliseconds\
     * \
     * `Default: 60000`
     */
    interval?: number;

    /**
     * Execution timeZone string\
     * \
     * `Default: UTS`
     */
    timezone?: string;

    logger: Logger;
  }

  export interface SchedulerTable {
    id: string;
    createdAt: string;
    cronTime: string;
    counter: number;
    cmd: string;
    entity: string;
  }

  export interface SchedulerServiceInterface {
    /**
     * Start scheduler timer\
     */
    startScheduler(): this;
    /**
     * Stop scheduler timer\
     */
    stopScheduler(): this;
    /**
     * Get job list
     */
    getJobList(): Promise<SchedulerJob[]>;
    /**
     * Create job
     */
    createJob(props: CreateJobProps): Promise<string>;
    /**
     * Create job
     */
    createJobs(props: CreateJobProps[]): Promise<string[]>;
    /**
     * update job
     */
    updateJob(id: string, props: Partial<CreateJobProps>): Promise<void>;
    /**
     * insert or update job
     */
    saveJob(props: Partial<SaveJobProps[]>): Promise<void>;
    /**
     * Delete multiple jobs
     */
    deleteJob(id: string): Promise<void>;
    /**
     * Delete a job by id
     */
    deleteJobs(ids: string[]): Promise<void>;
    /**
     * Get jobs by ids
     */
    getJobsByIds(ids: string[]): Promise<SchedulerJob[]>;
    /**
     * Adds the `listener` function to the end of the listeners array for the
     * event named `scheduler-job-execute`.
     */
    on(event: 'scheduler-job-execute', listener: (job: SchedulerJob) => void): this;

    /**
     * Adds a **one-time**`listener` function for the event named `scheduler-job-execute`
     */
    once(event: 'scheduler-job-execute', listener: (job: SchedulerJob) => void): this;
  }

  export type SchedulerInstanceInfo = {
    pid: number;
  };

  export interface SchedulerService extends SchedulerServiceInterface {}

  class SchedulerService {
    constructor(props: SchedulerServiceProps);
  }
}

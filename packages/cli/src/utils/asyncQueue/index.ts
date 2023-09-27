/*
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Dependency
 */
import { Job } from '../../types';

export default abstract class AsyncQueue {
  /**
   * List of jobs.
   * @private
   */
  private jobList: Array<Job> = [];

  /**
   * Concurrency.
   * @private
   */
  private concurrency = 5;

  /**
   * Get list of jobs.
   * @returns {Array<Job>} List of jobs.
   */
  public getJobs() {
    return this.jobList;
  }

  /**
   * Create single jobs.
   * @param {any} data Job data.
   * @returns void
   */
  public create(data: any): void {
    const job: Job = {
      data,
      status: 'pending',
      response: null,
      message: '',
    };

    this.jobList.push(job);
  }

  /**
   * Create multiple jobs.
   * @param {Array<any>} listOfData List of job data.
   * @returns void
   */
  public createMultiple(listOfData: Array<any>) {
    for (let index = 0; index < listOfData.length; index++) {
      this.create(listOfData[index]);
    }
  }

  /**
   * Simple process function for single JOB.
   * @abstract
   * @param job
   * @returns Promise<any>
   */
  // @ts-ignore
  abstract async process(job: Job): Promise<any>;

  /* Sample process function.
  public async process(job: Job): Promise<any> {
    const min = 1000;
    const max = 2000;
    const delayTime = Math.floor(Math.random() * (max - min + 1) + min);
    await delay(delayTime);
    return 'Yes';
  }
   */

  /**
   * Single worker instance.
   * @private
   */
  private async workerInstance(): Promise<void> {
    for (let index = 0; index < this.jobList.length; index++) {
      const job: Job = this.jobList[index];
      if ('pending' !== job.status) {
        continue;
      }

      this.jobList[index].status = 'in-process';

      try {
        // eslint-disable-next-line no-await-in-loop
        const response = await this.process(job);
        this.jobList[index].status = 'success';
        this.jobList[index].response = response;
      } catch (e) {
        console.error('Error: ', e);
        this.jobList[index].status = 'fail';
      }
    }
  }

  /**
   * Run all the jobs.
   * @returns void
   */
  public async run(): Promise<void> {
    const promises: Array<any> = [];

    for (let index = 0; index < this.concurrency; index++) {
      promises.push(this.workerInstance());
    }

    await Promise.all(promises);
  }
}

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
 * External dependencies.
 */
import {
  CookieDatabase,
  analyzeCookiesUrls,
  analyzeTechnologiesUrlsInBatches,
} from '@ps-analysis-tool/analysis-utils';
import Bull, { type Job } from 'bull';
import { type Collection } from 'mongodb';

export type AnalysisJobData = {
  url: string;
  shouldReanalyizeCookies: boolean;
  shouldReanalyizeTechnologies: boolean;
};

export class SiteAnalysisJobQueue {
  queueHandle;
  cookieDictionary;
  urlCollection;
  cookieAnalysisCollection;
  technologyAnalysisCollection;
  delayTime;
  concurrencyCount;
  debug;

  constructor(
    queueName: string,
    redisUrl: string,
    urlCollection: Collection,
    cookieAnalysisCollection: Collection,
    technologyAnalysisCollection: Collection,
    cookieDictionary: CookieDatabase,
    delayTime: number,
    concurrencyCount: number,
    debug = false
  ) {
    this.queueHandle = new Bull(queueName, {
      redis: {
        host: '127.0.0.1',
        port: 6379,
      },
    });
    this.cookieDictionary = cookieDictionary;
    this.urlCollection = urlCollection;
    this.cookieAnalysisCollection = cookieAnalysisCollection;
    this.technologyAnalysisCollection = technologyAnalysisCollection;
    this.delayTime = delayTime;
    this.concurrencyCount = concurrencyCount;
    this.debug = debug;

    this.queueHandle.process(this.concurrencyCount, this.processJob);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(message: any) {
    if (!this.debug) {
      return;
    }

    console.log(message);
  }

  async createJob(job: AnalysisJobData): Promise<number> {
    this.log(`creating job for url: ${job.url}`);
    const activeJobs = await this.queueHandle.getJobs(['active']);
    const waitingJobs = await this.queueHandle.getJobs(['waiting']);

    let placeInQueue: number | undefined;

    activeJobs.forEach((_job) => {
      const url = _job.data.url;

      if (url === job.url) {
        placeInQueue = 0;
      }
    });

    waitingJobs.forEach((_job, ind) => {
      const url = _job.data.url;

      if (url === job.url) {
        placeInQueue = ind;
      }
    });

    if (typeof placeInQueue !== 'undefined') {
      return placeInQueue;
    } else {
      await this.queueHandle.add(job);
      const _waitingJobs = await this.queueHandle.getJobs(['waiting']);
      return _waitingJobs.length;
    }
  }

  processJob = async (job: Job<AnalysisJobData>) => {
    const { url, shouldReanalyizeCookies, shouldReanalyizeTechnologies } =
      job.data;

    const pageDocument = await this.urlCollection?.findOne({
      pageUrl: url,
    });

    if (!pageDocument) {
      console.error('Page document is not available');
      return;
    }

    if (shouldReanalyizeCookies || shouldReanalyizeTechnologies) {
      //Data is in DB but its reanalysis is requested.

      let cookieData;
      let technologyData;

      if (!shouldReanalyizeCookies) {
        cookieData = (
          await this.cookieAnalysisCollection?.findOne({
            pageId: pageDocument._id,
          })
        )?.cookieData;
      } else {
        const [cookieAnalysis] = await analyzeCookiesUrls(
          [url],
          true,
          this.delayTime,
          this.cookieDictionary
        );

        cookieData = cookieAnalysis.cookieData;

        await this.cookieAnalysisCollection.updateOne(
          {
            pageId: pageDocument._id,
          },
          {
            $set: {
              cookieData: cookieData,
              updataedAt: new Date().toUTCString(),
            },
          }
        );
      }

      if (!shouldReanalyizeTechnologies) {
        technologyData = (
          await this.technologyAnalysisCollection?.findOne({
            pageId: pageDocument._id,
          })
        )?.technologyData;
      } else {
        [technologyData] = await analyzeTechnologiesUrlsInBatches([url]);

        await this.technologyAnalysisCollection.updateOne(
          {
            pageId: pageDocument._id,
          },
          {
            $set: {
              technologyData: technologyData,
              updataedAt: new Date().toUTCString(),
            },
          }
        );
      }
    } else {
      // No previous analysis in DB.

      const [cookieAnalysis] = await analyzeCookiesUrls(
        [url],
        true,
        this.delayTime,
        this.cookieDictionary
      );

      const [technologyData] = await analyzeTechnologiesUrlsInBatches([url]);

      const _pageDocument = await this.urlCollection.insertOne({
        pageUrl: url,
        createdAt: new Date().toUTCString(),
        updataedAt: new Date().toUTCString(),
      });

      await this.cookieAnalysisCollection.insertOne({
        pageId: _pageDocument.insertedId,
        cookieData: cookieAnalysis.cookieData,
        createdAt: new Date().toUTCString(),
        updataedAt: new Date().toUTCString(),
      });

      await this.technologyAnalysisCollection.insertOne({
        pageId: _pageDocument.insertedId,
        technologyData: technologyData,
        createdAt: new Date().toUTCString(),
        updataedAt: new Date().toUTCString(),
      });
    }
  };
}

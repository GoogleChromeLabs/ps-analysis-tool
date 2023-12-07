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

import {
  CookieDatabase,
  analyzeCookiesUrls,
  analyzeTechnologiesUrlsInBatches,
} from '@ps-analysis-tool/analysis-utils';
import { Collection } from 'mongodb';

const analyzeSingleUrl = async (
  urlCollection: Collection,
  cookieAnalysisCollection: Collection,
  technologyAnalysisCollection: Collection,
  url: string,
  cookieDictionary: CookieDatabase,
  delayTime: number,
  shouldReanalyizeCookies: boolean,
  shouldReanalyizeTechnologies: boolean,
  allowDebugLogs = false
) => {
  allowDebugLogs &&
    console.log(`Request received for analysis for url: ${url}`);
  const pageDocument = await urlCollection?.findOne({
    pageUrl: url,
  });

  if (!pageDocument) {
    allowDebugLogs && console.log(`No previous analysis found for url: ${url}`);

    allowDebugLogs && console.log(`Analyzing cookies for url: ${url}`);
    const [cookieData] = await analyzeCookiesUrls(
      [url],
      true,
      delayTime,
      cookieDictionary
    );

    allowDebugLogs && console.log(`Analyzing technologies url: ${url}`);
    const [technologyData] = await analyzeTechnologiesUrlsInBatches([url]);

    const _pageDocument = await urlCollection.insertOne({
      pageUrl: url,
      createdAt: new Date().toUTCString(),
      updataedAt: new Date().toUTCString(),
    });

    allowDebugLogs && console.log(`Adding analysis date to DB for url: ${url}`);
    await cookieAnalysisCollection.insertOne({
      pageId: _pageDocument.insertedId,
      cookieData: cookieData,
      createdAt: new Date().toUTCString(),
      updataedAt: new Date().toUTCString(),
    });

    await technologyAnalysisCollection.insertOne({
      pageId: _pageDocument.insertedId,
      technologyData: technologyData,
      createdAt: new Date().toUTCString(),
      updataedAt: new Date().toUTCString(),
    });

    return {
      pageUrl: url,
      cookieData: cookieData.cookieData,
      technologyData,
    };
  }

  let cookieData;
  let technologyData;

  if (!shouldReanalyizeCookies) {
    allowDebugLogs &&
      console.log(`Fetching cookie analysis data for url: ${url}`);
    cookieData = (
      await cookieAnalysisCollection?.findOne({
        pageId: pageDocument._id,
      })
    )?.cookieData;
  } else {
    allowDebugLogs &&
      console.log(`Reanalyzing cookie analysis data for url: ${url}`);
    [cookieData] = await analyzeCookiesUrls(
      [url],
      true,
      delayTime,
      cookieDictionary
    );

    await cookieAnalysisCollection.updateOne(
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
    allowDebugLogs &&
      console.log(`Fetching technology analysis data for url: ${url}`);
    technologyData = (
      await technologyAnalysisCollection?.findOne({
        pageId: pageDocument._id,
      })
    )?.technologyData;
  } else {
    allowDebugLogs &&
      console.log(`Reanalyzing technology data for url: ${url}`);
    [technologyData] = await analyzeTechnologiesUrlsInBatches([url]);

    await technologyAnalysisCollection.updateOne(
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

  return {
    pageUrl: url,
    cookieData: cookieData.cookieData,
    technologyData,
  };
};

export default analyzeSingleUrl;

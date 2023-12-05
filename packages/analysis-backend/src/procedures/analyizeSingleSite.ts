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
  shouldReanalyizeTechnologies: boolean
) => {
  const pageDocument = await urlCollection?.findOne({
    pageUrl: url,
  });

  if (
    pageDocument &&
    !shouldReanalyizeCookies &&
    !shouldReanalyizeTechnologies
  ) {
    //Simple lookup

    const cookieData = (
      await cookieAnalysisCollection?.findOne({
        pageId: pageDocument._id,
      })
    )?.cookieData;

    const technologyData = (
      await technologyAnalysisCollection?.findOne({
        pageId: pageDocument._id,
      })
    )?.technologyData;

    return {
      pageUrl: url,
      cookieData: cookieData.cookieData,
      technologyData,
    };
  } else if (
    pageDocument &&
    (shouldReanalyizeCookies || shouldReanalyizeTechnologies)
  ) {
    //Data is in DB but it reanalysis is requested.
    //@Todo Make this a job and reply with queue no

    let cookieData;
    let technologyData;

    if (!shouldReanalyizeCookies) {
      cookieData = (
        await cookieAnalysisCollection?.findOne({
          pageId: pageDocument._id,
        })
      )?.cookieData;
    } else {
      const [cookieAnalysis] = await analyzeCookiesUrls(
        [url],
        true,
        delayTime,
        cookieDictionary
      );

      cookieData = cookieAnalysis.cookieData;

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
      technologyData = (
        await technologyAnalysisCollection?.findOne({
          pageId: pageDocument._id,
        })
      )?.technologyData;
    } else {
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
  } else {
    // No previous analysis in DB.
    //@Todo Make this a job and reply with queue no

    const [cookieAnalysis] = await analyzeCookiesUrls(
      [url],
      true,
      delayTime,
      cookieDictionary
    );

    const [technologyData] = await analyzeTechnologiesUrlsInBatches([url]);

    const _pageDocument = await urlCollection.insertOne({
      pageUrl: url,
      createdAt: new Date().toUTCString(),
      updataedAt: new Date().toUTCString(),
    });

    await cookieAnalysisCollection.insertOne({
      pageId: _pageDocument.insertedId,
      cookieData: cookieAnalysis.cookieData,
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
      cookieData: cookieAnalysis.cookieData,
      technologyData,
    };
  }
};

export default analyzeSingleUrl;

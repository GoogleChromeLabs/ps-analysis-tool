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

class NotFoundError extends Error {
  constructor() {
    super('Entry not found in DB');
    this.name = 'AuthenticationError';
  }
}

const getAnalysisFromDatabase = async (
  urlCollection: Collection,
  cookieAnalysisCollection: Collection,
  technologyAnalysisCollection: Collection,
  url: string
) => {
  const pageDocument = await urlCollection?.findOne({
    pageUrl: url,
  });

  if (!pageDocument) {
    throw NotFoundError;
  }
  const cookieDataFromDB = await cookieAnalysisCollection?.findOne({
    pageId: pageDocument._id,
  });

  const technologyDataFromDB = await technologyAnalysisCollection?.findOne({
    pageId: pageDocument._id,
  });

  return {
    pageUrl: url,
    cookieData: cookieDataFromDB?.cookieData.cookieData,
    technologyData: technologyDataFromDB?.technologyData,
  };
};

const analyzeSingleUrl = async (
  urlCollection: Collection,
  cookieAnalysisCollection: Collection,
  technologyAnalysisCollection: Collection,
  url: string,
  cookieDictionary: CookieDatabase,
  delayTime: number
) => {
  try {
    return await getAnalysisFromDatabase(
      urlCollection,
      cookieAnalysisCollection,
      technologyAnalysisCollection,
      url
    );
  } catch (error) {
    if (!(Error instanceof NotFoundError)) {
      throw error;
    } else {
      const [cookieData] = await analyzeCookiesUrls(
        [url],
        true,
        delayTime,
        cookieDictionary
      );

      const [technologyData] = await analyzeTechnologiesUrlsInBatches([url]);

      const pageObject = await urlCollection.insertOne({
        pageUrl: url,
      });

      await cookieAnalysisCollection.insertOne({
        pageId: pageObject.insertedId,
        cookieData: cookieData,
      });

      await technologyAnalysisCollection.insertOne({
        pageId: pageObject.insertedId,
        technologyData: technologyData,
      });

      return {
        pageUrl: url,
        cookieData: cookieData.cookieData,
        technologyData,
      };
    }
  }
};

export default analyzeSingleUrl;

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
import { type Collection } from 'mongodb';
import { type SiteAnalysisJobQueue } from '../utils';

const analyzeSingleUrl = async (
  cookieAnalysisCollection: Collection,
  technologyAnalysisCollection: Collection,
  urlCollection: Collection,
  url: string,
  shouldReanalyizeCookies: boolean,
  shouldReanalyizeTechnologies: boolean,
  queueHandle: SiteAnalysisJobQueue
) => {
  const pageDocument = await urlCollection?.findOne({
    pageUrl: url,
  });

  if (
    pageDocument &&
    !shouldReanalyizeCookies &&
    !shouldReanalyizeTechnologies
  ) {
    //Simple lookup, if Page document exists it can be assumed that analysis data related to it also exists.

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
      cookieData,
      technologyData,
    };
  } else {
    // If page document does not exist or reanalysis is requested add to Job queue.
    const queueInd = await queueHandle.createJob({
      url,
      shouldReanalyizeCookies,
      shouldReanalyizeTechnologies,
    });

    return queueInd;
  }
};

export default analyzeSingleUrl;

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
// @ts-ignore Package does not support typescript.
import Spinnies from 'spinnies';
// @ts-ignore Package does not support typescript.
import Wapplalyzer from 'wappalyzer';

/**
 * Internal dependencies.
 */
import { TechnologyDetailList } from '../types';

export const analyzeTechnologiesUrlsInBatches = async (
  urls: Array<string>,
  batchSize = 3
): Promise<TechnologyDetailList[]> => {
  const spinnies = new Spinnies();

  let report: TechnologyDetailList[] = [];

  for (let i = 0; i < urls.length; i += batchSize) {
    const start = i;
    const end = Math.min(urls.length - 1, i + batchSize - 1);

    spinnies.add(`spinner-${i}`, {
      text: `Analysing technologies in urls ${start + 1} - ${end + 1} `,
    });

    const urlsWindow = urls.slice(start, end + 1);
    const wappalyzer = new Wapplalyzer();

    await wappalyzer.init();

    const technologyAnalysis = await Promise.all(
      urlsWindow.map(async (url) => {
        const { technologies } = await (await wappalyzer.open(url)).analyze();
        return technologies;
      })
    );

    await wappalyzer.destroy();

    report = [...report, ...technologyAnalysis];

    spinnies.succeed(`spinner-${i}`, {
      text: `Done technology in urls ${start + 1} - ${end + 1} `,
    });
  }

  return report;
};

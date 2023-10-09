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
import { Command } from 'commander';
import events from 'events';
import { ensureFile, writeFile } from 'fs-extra';
// @ts-ignore Package does not support typescript.
import Spinnies from 'spinnies';
import { exec } from 'child_process';

/**
 * Internal dependencies.
 */
import { analyzeTechnologiesUrls } from './procedures/analyzeTechnologiesUrls';
import Utility from './utils/utility';
import { fetchDictionary } from './utils/fetchCookieDictionary';
import { delay } from './utils';
import { analyzeCookiesUrls } from './procedures/analyzeCookieUrls';
import { analyzeCookiesUrlsInBatches } from './procedures/analyzeCookieUrlsInBatches';

events.EventEmitter.defaultMaxListeners = 15;
const delayTime = 20000;

const program = new Command();

program
  .version('0.0.1')
  .description('CLI to test a URL for 3p cookies')
  .option('-u, --url <value>', 'URL of a site')
  .option('-s, --sitemap-url <value>', 'URL of a sitemap')
  .option(
    '-nh, --no-headless ',
    'flag for running puppeteer in non headless mode'
  );

program.parse();

const isHeadless = Boolean(program.opts().headless);

export const initialize = async () => {
  const url = program.opts().url;
  const sitemapURL = program.opts().sitemapUrl;
  const cookieDictionary = await fetchDictionary();
  if (url) {
    const prefix = Utility.generatePrefix(url ?? 'untitled');
    const directory = `./out/${prefix}`;

    const spinnies = new Spinnies();

    spinnies.add('cookie-spinner', {
      text: 'Analysing cookies on first page visit',
    });
    const [cookieData] = await analyzeCookiesUrls(
      [url],
      isHeadless,
      delayTime,
      cookieDictionary
    );
    spinnies.succeed('cookie-spinner', {
      text: 'Done analyzing cookies.',
    });

    spinnies.add('technology-spinner', {
      text: 'Analysing technologies',
    });
    const technologyData = await analyzeTechnologiesUrls([url]);
    spinnies.succeed('technology-spinner', {
      text: 'Done analyzing technologies.',
    });

    const output = {
      pageUrl: url,
      cookieData: cookieData.cookieData,
      technologyData,
    };
    await ensureFile(directory + '/out.json');
    await writeFile(directory + '/out.json', JSON.stringify(output, null, 4));

    exec('npm run cli-dashboard:dev');

    await delay(3000);

    console.log(
      `Report is being served on URL: http://localhost:9000?path=${encodeURIComponent(
        directory + '/out.json'
      )}`
    );
  } else {
    const spinnies = new Spinnies();
    const urls: Array<string> = await Utility.getUrlsFromSitemap(sitemapURL);
    const prefix = Utility.generatePrefix([...urls].shift() ?? 'untitled');
    const spinnies = new Spinnies();
    const directory = `./out/${prefix}`;
    const userInput: any = await Utility.askUserInput(
      `Provided sitemap has ${urls.length} pages. Please enter the number of pages you want to analyze (Default ${urls.length}):`,
      { default: urls.length.toString() }
    );
    let numberOfUrls: number = isNaN(userInput)
      ? urls.length
      : parseInt(userInput);
    numberOfUrls = numberOfUrls < urls.length ? numberOfUrls : urls.length;

    const urlsToProcess = urls.splice(0, numberOfUrls);

    const cookieAnalysisData = await analyzeCookiesUrlsInBatches(
      urlsToProcess,
      isHeadless,
      delayTime,
      cookieDictionary
    );

    spinnies.add('technology-spinner', {
      text: 'Analysing technologies',
    });

    const technologyAnalysisData = await Promise.all(
      urlsToProcess.map((siteUrl: string) => analyzeTechnologiesUrls([siteUrl]))
    );
    spinnies.succeed('technology-spinner', {
      text: 'Done analysing technologies',
    });

    spinnies.succeed('technologies-spinner', {
      text: 'Done analyzing technologies.',
    });
    const result = urlsToProcess.map((_url, ind) => {
      return {
        pageUrl: _url,
        technologyData: technologyAnalysisData[ind],
        cookieData: cookieAnalysisData[ind].cookieData,
      };
    });

    await ensureFile(directory + '/out.json');
    await writeFile(directory + '/out.json', JSON.stringify(result, null, 4));

    exec('npm run cli-dashboard:dev');

    await delay(3000);

    console.log(
      `Report is being served on URL: http://localhost:9000?path=${encodeURIComponent(
        directory + '/out.json'
      )}&type=sitemap`
    );
  }
};

(async () => {
  await initialize();
})();

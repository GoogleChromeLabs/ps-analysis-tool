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

/**
 * Internal dependencies.
 */
import { analyzeTechnologiesUrls } from './procedures/analyzeTechnologiesUrls';
import { analyzeCookiesUrl } from './analyseCookiesUrl';
import Utility from './utils/utility';
import { fetchDictionary } from './utils/fetchCookieDictionary';

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
      text: 'Analysing cookies on the first page visit',
    });
    const cookieData = await analyzeCookiesUrl(
      url,
      isHeadless,
      delayTime,
      cookieDictionary
    );
    spinnies.succeed('cookie-spinner', {
      text: 'Done Analyzing cookies',
    });

    spinnies.add('technology-spinner', {
      text: 'Analysing cookies on the first page visit',
    });
    const technologyData = await analyzeTechnologiesUrls([url]);
    spinnies.succeed('technology-spinner', {
      text: 'Done Analyzing technologies',
    });

    const output = {
      pageUrl: url,
      cookieData,
      technologyData,
    };
    await ensureFile(directory + '/out.json');
    await writeFile(directory + '/out.json', JSON.stringify(output, null, 4));
  } else {
    const urls: Array<string> = await Utility.getUrlsFromSitemap(sitemapURL);

    const prefix = Utility.generatePrefix([...urls].shift() ?? 'untitled');
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

    const promises = urlsToProcess.map(async (siteUrl: string) => {
      const cookieData = await analyzeCookiesUrl(
        siteUrl,
        isHeadless,
        delayTime,
        cookieDictionary
      );
      const technologyData = await analyzeTechnologiesUrls([siteUrl]);

      return {
        pageUrl: siteUrl,
        technologyData,
        cookieData,
      };
    });

    const result = await Promise.all(promises);

    await ensureFile(directory + '/out.json');
    await writeFile(directory + '/out.json', JSON.stringify(result, null, 4));
  }
  process.exit(1);
};

(async () => {
  await initialize();
})();

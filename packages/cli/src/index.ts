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
import path from 'path';
import { CompleteJson } from '@ps-analysis-tool/common';
import { I18n } from '@ps-analysis-tool/i18n';

/**
 * Internal dependencies.
 */
import Utility from './utils/utility';
import { analyzeCookiesUrlsInBatches } from './procedures/analyzeCookieUrlsInBatches';
import { analyzeTechnologiesUrlsInBatches } from './procedures/analyzeTechnologiesUrlsInBatches';
import {
  fetchDictionary,
  delay,
  getUrlListFromArgs,
  validateArgs,
  saveCSVReports,
} from './utils';
import { checkPortInUse } from './utils/checkPortInUse';

events.EventEmitter.defaultMaxListeners = 15;

const locale = Intl.DateTimeFormat().resolvedOptions().locale;
I18n.loadCLIMessagesData(locale);

const DELAY_TIME = 20000;
const program = new Command();

program
  .version('0.7.0')
  .description(I18n.getMessage('toTest3PCookies'))
  .option('-u, --url <value>', I18n.getMessage('urlOfSite'))
  .option('-s, --sitemap-url <value>', I18n.getMessage('urlOfSitemap'))
  .option('-c, --csv-path <value>', I18n.getMessage('pathToCSV'))
  .option('-p, --sitemap-path <value>', I18n.getMessage('pathToSitemap'))
  .option('-po, --port <value>', I18n.getMessage('portForServer'))
  .option('-ul, --url-limit <value>', I18n.getMessage('urlLimit'))
  .option('-nh, --no-headless ', I18n.getMessage('nonHeadless'))
  .option('-np, --no-prompts', I18n.getMessage('noPrompts'))
  .option('-nt, --no-technology', I18n.getMessage('noTechnology'))
  .option('-d, --out-dir <value>', I18n.getMessage('outDir'))
  .option('-ab, --accept-banner', I18n.getMessage('acceptBanner'));

program.parse();

const saveResults = async (
  outDir: string,
  result: CompleteJson | CompleteJson[]
) => {
  await ensureFile(outDir + '/out.json');
  await writeFile(outDir + '/out.json', JSON.stringify(result, null, 4));
};

const startDashboardServer = async (dir: string, port: number) => {
  exec(`npm run cli-dashboard:dev -- -- --port ${port}`);

  await delay(2000);

  console.log(
    I18n.getMessage('reportServedAt', [`http://localhost:${port}/?dir=${dir}`])
  );
};

// eslint-disable-next-line complexity
(async () => {
  const url = program.opts().url;
  const sitemapUrl = program.opts().sitemapUrl;
  const csvPath = program.opts().csvPath;
  const sitemapPath = program.opts().sitemapPath;
  const port = parseInt(program.opts().port || '9000');
  const numberOfUrlsInput = program.opts().urlLimit;
  const isHeadless = Boolean(program.opts().headless);
  const shouldSkipPrompts = !program.opts().prompts;
  const shouldSkipTechnologyAnalysis = !program.opts().technology;
  const outDir = program.opts().outDir;
  const shouldSkipAcceptBanner = program.opts().acceptBanner;

  validateArgs(
    url,
    sitemapUrl,
    csvPath,
    sitemapPath,
    numberOfUrlsInput,
    outDir,
    port
  );

  //check if devserver port in already in use only if the dashboard is goint to be used

  if (!outDir) {
    const isPortInUse = await checkPortInUse(port);

    if (isPortInUse) {
      console.error(I18n.getMessage('errorInPort', [port.toString()]));
      process.exit(1);
    }
  }

  const prefix =
    url || sitemapUrl
      ? Utility.generatePrefix(url || sitemapUrl)
      : path.parse(csvPath || sitemapPath).name;

  const outputDir = outDir ? outDir : `./out/${prefix}`;

  const spinnies = new Spinnies();

  const urls = await getUrlListFromArgs(
    url,
    sitemapUrl,
    csvPath,
    sitemapPath,
    spinnies
  );

  let urlsToProcess: string[] = [];

  if (sitemapUrl || csvPath || sitemapPath) {
    let numberOfUrls: number | null = null;
    let userInput: string | null = null;

    if (!shouldSkipPrompts && !numberOfUrlsInput) {
      userInput = await Utility.askUserInput(
        I18n.getMessage('urlCountPrompt', [
          sitemapUrl || sitemapPath ? 'Sitemap' : 'CSV file',
          urls.length.toString(),
        ]),
        { default: urls.length.toString() }
      );
      numberOfUrls =
        userInput && isNaN(parseInt(userInput))
          ? urls.length
          : parseInt(userInput);
    } else if (numberOfUrlsInput) {
      console.log(I18n.getMessage('analyzingUrls', [numberOfUrlsInput]));
      numberOfUrls = parseInt(numberOfUrlsInput);
    } else {
      console.log(
        I18n.getMessage('analyzingAllUrls', [urls.length.toString()])
      );
      numberOfUrls = urls.length;
    }

    urlsToProcess = urlsToProcess.concat(urls.splice(0, numberOfUrls));
  } else if (url) {
    urlsToProcess.push(url);
  }

  const cookieDictionary = await fetchDictionary();

  spinnies.add('cookie-spinner', {
    text: I18n.getMessage('analyzingCookies'),
  });

  const cookieAnalysisData = await analyzeCookiesUrlsInBatches(
    urlsToProcess,
    isHeadless,
    DELAY_TIME,
    cookieDictionary,
    3,
    urlsToProcess.length !== 1 ? spinnies : undefined,
    shouldSkipAcceptBanner
  );

  spinnies.succeed('cookie-spinner', {
    text: I18n.getMessage('doneAnalyzingCookies'),
  });

  let technologyAnalysisData: any = null;

  if (!shouldSkipTechnologyAnalysis) {
    spinnies.add('technology-spinner', {
      text: I18n.getMessage('analyzingTechnologies'),
    });

    technologyAnalysisData = await analyzeTechnologiesUrlsInBatches(
      urlsToProcess,
      3,
      urlsToProcess.length !== 1 ? spinnies : undefined
    );

    spinnies.succeed('technology-spinner', {
      text: I18n.getMessage('doneAnalyzingTechonlogies'),
    });
  }

  const result = urlsToProcess.map((_url, ind) => {
    return {
      pageUrl: _url,
      technologyData: technologyAnalysisData ? technologyAnalysisData[ind] : [],
      cookieData: cookieAnalysisData[ind].cookieData,
    } as CompleteJson;
  });

  await saveResults(outputDir, result);

  if (outDir) {
    await saveCSVReports(path.resolve(outputDir), result);
    process.exit(0);
  }

  startDashboardServer(
    encodeURIComponent(prefix) +
      (sitemapUrl || csvPath || sitemapPath ? '&type=sitemap' : ''),
    port
  );
})();

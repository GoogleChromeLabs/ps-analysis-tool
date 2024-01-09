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
import {
  CompleteJson,
  generateAffectedCookiesCSV,
  generateAllCookiesCSV,
  generateSummaryDataCSV,
  generateTechnologyCSV,
} from '@ps-analysis-tool/common';

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
} from './utils';
import { checkPortInUse } from './utils/checkPortInUse';

events.EventEmitter.defaultMaxListeners = 15;

const DELAY_TIME = 20000;
const program = new Command();

program
  .version('0.4.1')
  .description('CLI to test a URL for 3p cookies')
  .option('-u, --url <value>', 'URL of a site')
  .option('-s, --sitemap-url <value>', 'URL of a sitemap')
  .option('-c, --csv-path <value>', 'Path to a CSV file with a set of URLs.')
  .option(
    '-p, --sitemap-path <value>',
    'Path to a sitmap saved in the file system'
  )
  .option('-ul, --url-limit <value>', 'No of Urls to analyze')
  .option(
    '-nh, --no-headless ',
    'Flag for running puppeteer in non headless mode'
  )
  .option(
    '-np, --no-prompts',
    'Flags for skipping all prompts. Default options will be used'
  )
  .option('-nt, --no-technology', 'Flags for skipping technology analysis.')
  .option(
    '-d, --out-dir <value>',
    'Directory path where the analysis data will be stored'
  );

program.parse();

const initialize = async () => {
  //check if devserver port in already in use

  const portInUse = await checkPortInUse(9000);

  if (portInUse) {
    console.error(
      'Error: Report server port (9000) already in use. You might be already running CLI'
    );
    process.exit(1);
  }
};

const saveResults = async (outDir: string, result: CompleteJson[]) => {
  await ensureFile(outDir + '/out.json');
  await writeFile(
    outDir + '/out.json',
    JSON.stringify(Array.isArray(result) ? result[0] : result, null, 4)
  );
};

const generateCSVFiles = (data: CompleteJson) => {
  const allCookiesCSV = generateAllCookiesCSV(data);
  let technologyDataCSV = null;
  if (data.technologyData.length > 0) {
    technologyDataCSV = generateTechnologyCSV(data);
  }
  const affectedCookiesDataCSV = generateAffectedCookiesCSV(data);
  const summaryDataCSV = generateSummaryDataCSV(data);

  return {
    allCookiesCSV,
    technologyDataCSV,
    affectedCookiesDataCSV,
    summaryDataCSV,
  };
};

export const getFolderName = (pageUrl: string) => {
  let folderName = pageUrl
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/+/g, '-');

  if (folderName.endsWith('-')) {
    const lastDashIndex = folderName.lastIndexOf('-');
    folderName = folderName.substring(0, lastDashIndex);
  }

  return folderName;
};

const saveCSVReports = async (outDir: string, result: CompleteJson[]) => {
  if (result.length > 1) {
    // Sitemap report
    await Promise.all(
      result.map(async (siteReport) => {
        const {
          allCookiesCSV,
          technologyDataCSV,
          affectedCookiesDataCSV,
          summaryDataCSV,
        } = generateCSVFiles(siteReport);

        const fileDir = path.join(outDir, getFolderName(siteReport.pageUrl));

        await ensureFile(path.join(fileDir, 'cookies.csv'));
        await writeFile(path.join(fileDir, 'cookies.csv'), allCookiesCSV);

        if (technologyDataCSV) {
          await ensureFile(path.join(fileDir, 'technologies.csv'));
          await writeFile(
            path.join(fileDir, 'technologies.csv'),
            technologyDataCSV
          );
        }

        await ensureFile(path.join(fileDir, 'affected-cookies.csv'));
        await writeFile(
          path.join(fileDir, 'affected-cookies.csv'),
          affectedCookiesDataCSV
        );

        await ensureFile(path.join(fileDir, 'report.csv'));
        await writeFile(path.join(fileDir, 'report.csv'), summaryDataCSV);
      })
    );
  } else {
    //site report
    const {
      allCookiesCSV,
      technologyDataCSV,
      affectedCookiesDataCSV,
      summaryDataCSV,
    } = generateCSVFiles(result[0]);
    await ensureFile(path.join(outDir, 'cookies.csv'));
    await writeFile(path.join(outDir, 'cookies.csv'), allCookiesCSV);

    if (technologyDataCSV) {
      await ensureFile(path.join(outDir, 'technologies.csv'));
      await writeFile(path.join(outDir, 'technologies.csv'), technologyDataCSV);
    }

    await ensureFile(path.join(outDir, 'affected-cookies.csv'));
    await writeFile(
      path.join(outDir, 'affected-cookies.csv'),
      affectedCookiesDataCSV
    );

    await ensureFile(path.join(outDir, 'report.csv'));
    await writeFile(path.join(outDir, 'report.csv'), summaryDataCSV);
  }
};

const startDashboardServer = async (dir: string) => {
  exec('npm run cli-dashboard:dev');

  await delay(2000);

  console.log(
    `Report is being served at the URL: http://localhost:9000?dir=${dir}`
  );
};

// eslint-disable-next-line complexity
(async () => {
  await initialize();

  const url = program.opts().url;
  const sitemapUrl = program.opts().sitemapUrl;
  const csvPath = program.opts().csvPath;
  const sitemapPath = program.opts().sitemapPath;
  const numberOfUrlsInput = program.opts().urlLimit;
  const isHeadless = Boolean(program.opts().headless);
  const shouldSkipPrompts = !program.opts().prompts;
  const shouldSkipTechnologyAnalysis = !program.opts().technology;
  const outDir = program.opts().outDir;

  validateArgs(
    url,
    sitemapUrl,
    csvPath,
    sitemapPath,
    numberOfUrlsInput,
    outDir
  );

  const prefix =
    url || sitemapUrl
      ? Utility.generatePrefix(url || sitemapUrl)
      : path.parse(csvPath || sitemapPath).base;

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
        `Provided ${sitemapUrl || sitemapPath ? 'Sitemap' : 'CSV file'} has ${
          urls.length
        } pages. Please enter the number of pages you want to analyze (Default ${
          urls.length
        }):`,
        { default: urls.length.toString() }
      );
      numberOfUrls =
        userInput && isNaN(parseInt(userInput))
          ? urls.length
          : parseInt(userInput);
    } else if (numberOfUrlsInput) {
      console.log(`Analysing ${numberOfUrlsInput} urls.`);
      numberOfUrls = parseInt(numberOfUrlsInput);
    } else {
      console.log(`Analysing all ${urls.length} urls.`);
      numberOfUrls = urls.length;
    }

    urlsToProcess = urlsToProcess.concat(urls.splice(0, numberOfUrls));
  } else if (url) {
    urlsToProcess.push(url);
  }

  const cookieDictionary = await fetchDictionary();

  spinnies.add('cookie-spinner', {
    text: 'Analysing cookies on first page visit',
  });

  const cookieAnalysisData = await analyzeCookiesUrlsInBatches(
    urlsToProcess,
    isHeadless,
    DELAY_TIME,
    cookieDictionary,
    3,
    urlsToProcess.length !== 1 ? spinnies : undefined
  );

  spinnies.succeed('cookie-spinner', {
    text: 'Done analyzing cookies.',
  });

  let technologyAnalysisData: any = null;

  if (!shouldSkipTechnologyAnalysis) {
    spinnies.add('technology-spinner', {
      text: 'Analysing technologies',
    });

    technologyAnalysisData = await analyzeTechnologiesUrlsInBatches(
      urlsToProcess,
      3,
      urlsToProcess.length !== 1 ? spinnies : undefined
    );

    spinnies.succeed('technology-spinner', {
      text: 'Done analyzing technologies.',
    });
  }

  const result = urlsToProcess.map((_url, ind) => {
    return {
      pageUrl: _url,
      technologyData: technologyAnalysisData ? technologyAnalysisData[ind] : [],
      cookieData: cookieAnalysisData[ind].cookieData,
    } as CompleteJson;
  });

  await saveResults(path.join(outputDir, prefix), result);

  if (outDir) {
    await saveCSVReports(path.join(outputDir, prefix), result);
  }

  if (!outDir) {
    startDashboardServer(
      encodeURIComponent(prefix) +
        (sitemapUrl || csvPath || sitemapPath ? '&type=sitemap' : '')
    );
  }
})();

#!/usr/bin/env node
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
import fs from 'fs';
import path from 'path';
import { I18n } from '@ps-analysis-tool/i18n';
import { CompleteJson, LibraryData } from '@ps-analysis-tool/common';
import {
  analyzeCookiesUrlsInBatchesAndFetchResources,
  analyzeTechnologiesUrlsInBatches,
} from '@ps-analysis-tool/analysis-utils';
import {
  DetectionFunctions,
  Libraries,
  detectMatchingSignatures,
} from '@ps-analysis-tool/library-detection';

/**
 * Internal dependencies.
 */
import {
  fetchDictionary,
  getUrlListFromArgs,
  validateArgs,
  saveCSVReports,
  askUserInput,
  generatePrefix,
} from './utils';

events.EventEmitter.defaultMaxListeners = 15;

const locale = Intl.DateTimeFormat().resolvedOptions().locale;
I18n.loadCLIMessagesData(locale);

const DELAY_TIME = 20000;
const program = new Command();

program
  .version('0.8.0')
  .description('CLI to test a URL for 3p cookies')
  .argument('[website-url]', 'The URL of website you want to analyse')
  .option('-u, --url <value>', 'URL of a site')
  .option('-s, --sitemap-url <value>', 'URL of a sitemap')
  .option('-c, --csv-path <value>', 'Path to a CSV file with a set of URLs.')
  .option(
    '-p, --sitemap-path <value>',
    'Path to a sitemap saved in the file system'
  )
  .option(
    '-l, --locale <value>',
    'Locale to use for the CLI, supported: en, hi, ja, ko, pt-BR'
  )
  .option('-ul, --url-limit <value>', 'No of URLs to analyze')
  .option(
    '-nh, --no-headless ',
    'Flag for running puppeteer in non-headless mode'
  )
  .option(
    '-np, --no-prompts',
    'Flags for skipping all prompts. Default options will be used'
  )
  .option('-nt, --no-technology', 'Flags for skipping technology analysis.')
  .option(
    '-d, --out-dir <value>',
    'Directory path where the analysis data will be stored'
  )
  .option(
    '-ab, --accept-banner',
    'This will accept the GDPR banner if present.'
  );

program.parse();

const saveResultsAsJSON = async (
  outDir: string,
  result: CompleteJson | CompleteJson[]
) => {
  await ensureFile(outDir + '/out.json');
  await writeFile(outDir + '/out.json', JSON.stringify(result, null, 4));
};

const saveResultsAsHTML = async (
  outDir: string,
  result: CompleteJson | CompleteJson[],
  isSiteMap: boolean,
  _locale: string
) => {
  const htmlText = fs.readFileSync(
    path.resolve(__dirname + '../../../cli-dashboard/dist/index.html'),
    'utf-8'
  );

  const reportHTML = fs.readFileSync(
    path.resolve(__dirname + '../../../cli-dashboard/dist/report/index.html'),
    'base64'
  );

  I18n.loadCLIMessagesData(_locale);
  const messages = I18n.getMessages();

  const html =
    htmlText.substring(0, htmlText.indexOf('</head>')) +
    `<script>
    window.PSAT_REPORT_HTML = '${reportHTML}'
    window.PSAT_DATA = ${JSON.stringify({
      json: result,
      type: isSiteMap ? 'sitemap' : 'url',
      selectedSite: outDir?.trim()?.slice(6) ?? '',
      translations: messages,
    })}</script>` +
    htmlText.substring(htmlText.indexOf('</head>'));

  fs.copyFileSync(
    path.resolve(__dirname + '../../../cli-dashboard/dist/index.js'),
    outDir + '/index.js'
  );

  const outFileFullDir = path.resolve(outDir + '/index.html');
  const htmlBlob = new Blob([html]);
  const buffer = Buffer.from(await htmlBlob.arrayBuffer());

  fs.writeFile(outDir + '/index.html', buffer, () =>
    console.log(`Report created successfully: ${outFileFullDir}`)
  );
};

// eslint-disable-next-line complexity
(async () => {
  const url = program.args?.[0] ?? program.opts().url;
  const sitemapUrl = program.opts().sitemapUrl;
  const csvPath = program.opts().csvPath;
  const sitemapPath = program.opts().sitemapPath;
  const numberOfUrlsInput = program.opts().urlLimit;
  const isHeadless = Boolean(program.opts().headless);
  const shouldSkipPrompts = !program.opts().prompts;
  const shouldSkipTechnologyAnalysis = !program.opts().technology;
  const outDir = program.opts().outDir;
  const shouldSkipAcceptBanner = program.opts().acceptBanner;
  const _locale = program.opts().locale;

  await validateArgs(
    url,
    sitemapUrl,
    csvPath,
    sitemapPath,
    numberOfUrlsInput,
    outDir
  );

  const prefix =
    url || sitemapUrl
      ? generatePrefix(url || sitemapUrl)
      : path.parse(csvPath || sitemapPath).name;

  let outputDir;

  if (outDir && path.isAbsolute(outDir)) {
    outputDir = outDir;
  } else if (outDir && !path.isAbsolute(outDir)) {
    outputDir = path.join('./out', outDir);
  } else {
    outputDir = `./out/${prefix}`;
  }

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
      userInput = await askUserInput(
        I18n.getMessage('urlCountPrompt', [
          sitemapUrl || sitemapPath ? 'Sitemap' : 'CSV file',
          urls.length.toString(),
        ])
      );

      numberOfUrls =
        userInput && isNaN(parseInt(userInput))
          ? urls.length
          : parseInt(userInput as string);
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

  const cookieAnalysisAndFetchedResourceData =
    await analyzeCookiesUrlsInBatchesAndFetchResources(
      urlsToProcess,
      //@ts-ignore Fix type.
      Libraries,
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
    const detectedMatchingSignatures: LibraryData = {
      ...detectMatchingSignatures(
        cookieAnalysisAndFetchedResourceData[ind].resources ?? [],
        Object.fromEntries(
          Libraries.map((library) => [library.name, library.detectionFunction])
        ) as DetectionFunctions
      ),
      ...(cookieAnalysisAndFetchedResourceData[ind]?.domQueryMatches ?? {}),
    };
    return {
      pageUrl: _url,
      technologyData: technologyAnalysisData ? technologyAnalysisData[ind] : [],
      cookieData: cookieAnalysisAndFetchedResourceData[ind].cookieData,
      libraryMatches: detectedMatchingSignatures ?? [],
    } as unknown as CompleteJson;
  });

  const isSiteMap = sitemapUrl || csvPath || sitemapPath ? true : false;

  if (outDir) {
    await saveCSVReports(path.resolve(outputDir), result);
    process.exit(0);
  }

  await saveResultsAsJSON(outputDir, result);
  await saveResultsAsHTML(outputDir, result, isSiteMap, _locale);
})();

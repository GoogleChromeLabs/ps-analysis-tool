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
import { existsSync, ensureFile, writeFile } from 'fs-extra';
import Spinnies from 'spinnies';
import fs from 'fs';
import path from 'path';
import { I18n } from '@google-psat/i18n';
import {
  CompleteJson,
  LibraryData,
  removeAndAddNewSpinnerText,
} from '@google-psat/common';
import {
  analyzeCookiesUrlsInBatchesAndFetchResources,
  analyzeTechnologiesUrlsInBatches,
} from '@google-psat/analysis-utils';
import {
  DetectionFunctions,
  Libraries,
  detectMatchingSignatures,
} from '@google-psat/library-detection';
import URL from 'node:url';

/**
 * Internal dependencies.
 */
import {
  fetchDictionary,
  getUrlListFromArgs,
  saveCSVReports,
  askUserInput,
  generatePrefix,
  localeValidator,
  outDirValidator,
  filePathValidator,
  urlValidator,
  numericValidator,
} from './utils';

events.EventEmitter.defaultMaxListeners = 15;

const program = new Command();

const isFromNPMRegistry = !existsSync(
  path.resolve(__dirname + '../../../extension')
);

program
  .name(isFromNPMRegistry ? 'psat' : 'npm run cli')
  .version('0.9.0-2')
  .usage(
    isFromNPMRegistry ? '[website-url] [option]' : '[website-url] -- [options]'
  )
  .description('CLI to test a URL for 3p cookies.')
  .argument(
    '[website-url]',
    'The URL of a single site to analyze',
    urlValidator
  )
  .option(
    '-u, --url <url>',
    'The URL of a single site to analyze',
    urlValidator
  )
  .option(
    '-s, --source-url <url>',
    ' The URL of a sitemap or CSV to analyze',
    urlValidator
  )
  .option(
    '-f, --file <path>',
    'The path to a local file (CSV or XML sitemap) to analyze',
    filePathValidator
  )
  .option(
    '-n, --number-of-urls <num>',
    'Limit the number of URLs to analyze (from sitemap or CSV)',
    numericValidator
  )
  .option('-d, --display', 'Flag for running CLI in non-headless mode')
  .option('-v, --verbose', 'Enables verbose logging')
  .option('-t, --tech', 'Enables technology analysis')
  .option(
    '-o, --out-dir <path>',
    'Directory to store analysis data (JSON, CSV, HTML) without launching the dashboard',
    outDirValidator
  )
  .option(
    '-i, --ignore-gdpr',
    'Ignore automatically accepting the GDPR banner if present'
  )
  .option('-q, --quiet', 'Skips all prompts; uses default options')
  .option(
    '-c, --concurrency <num>',
    'Number of tabs to open in parallel during sitemap or CSV analysis',
    numericValidator,
    3
  )
  .option(
    '-w, --wait <num>',
    'Number of seconds to wait after the page is loaded before generating the report',
    numericValidator,
    20000
  )
  .option(
    '-l, --locale <language>',
    'Locale to use for the CLI, supported: en, hi, es, ja, ko, pt-BR',
    localeValidator,
    'en'
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
  isSiteMap: boolean
) => {
  let htmlText = '';
  let reportHTML = '';

  if (
    existsSync(
      path.resolve(
        __dirname +
          '../../node_modules/@google-psat/cli-dashboard/dist/index.html'
      )
    )
  ) {
    htmlText = fs.readFileSync(
      path.resolve(
        __dirname +
          '../../node_modules/@google-psat/cli-dashboard/dist/index.html'
      ),
      'utf-8'
    );

    reportHTML = fs.readFileSync(
      path.resolve(
        __dirname +
          '../../node_modules/@google-psat/cli-dashboard/dist/report/index.html'
      ),
      'base64'
    );

    fs.copyFileSync(
      path.resolve(
        __dirname +
          '../../node_modules/@google-psat/cli-dashboard/dist/index.js'
      ),
      outDir + '/index.js'
    );
  } else {
    htmlText = fs.readFileSync(
      path.resolve(__dirname + '../../../cli-dashboard/dist/index.html'),
      'utf-8'
    );

    reportHTML = fs.readFileSync(
      path.resolve(__dirname + '../../../cli-dashboard/dist/report/index.html'),
      'base64'
    );

    fs.copyFileSync(
      path.resolve(__dirname + '../../../cli-dashboard/dist/index.js'),
      outDir + '/index.js'
    );
  }

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

  const outFileFullDir = path.resolve(outDir + '/index.html');
  const htmlBlob = new Blob([html]);
  const buffer = Buffer.from(await htmlBlob.arrayBuffer());

  writeFile(outDir + '/index.html', buffer, () =>
    console.log(`\nReport: ${URL.pathToFileURL(outFileFullDir)}`)
  );
};

// eslint-disable-next-line complexity
(async () => {
  const url = program.args?.[0] ?? program.opts().url;
  const verbose = Boolean(program.opts().verbose);
  const sitemapUrl = program.opts().sourceUrl;
  const filePath = program.opts().file;
  const locale = program.opts().locale;
  const numberOfUrlsInput = program.opts().numberOfUrls;
  const isHeadless = !program.opts().display;
  const shouldSkipPrompts = program.opts().quiet;
  const shouldSkipTechnologyAnalysis = !program.opts().tech;
  const outDir = program.opts().outDir;
  const shouldSkipAcceptBanner = program.opts().ignoreGdpr;
  const concurrency = program.opts().concurrency;
  const waitTime = program.opts().wait;

  const numArgs: number = [
    Boolean(url),
    Boolean(sitemapUrl),
    Boolean(filePath),
  ].reduce((acc, arg) => {
    acc += arg ? 1 : 0;
    return acc;
  }, 0);

  if (numArgs !== 1) {
    console.error(
      `Please provide one and only one of the following
        a) URL of a site (-u or --url or default argument)
        b) URL of a sitemap (-s or --sitemap-url)
        c) Path to a file (CSV or XML sitemap) (-f or --file)`
    );
    process.exit(1);
  }

  const prefix =
    url || sitemapUrl
      ? generatePrefix(url || sitemapUrl)
      : path.parse(filePath).name;

  let outputDir;

  if (outDir && path.isAbsolute(outDir)) {
    outputDir = outDir;
  } else if (outDir && !path.isAbsolute(outDir)) {
    outputDir = path.join('./out', outDir);
  } else {
    outputDir = `./out/${prefix}`;
  }

  const spinnies = new Spinnies();

  const urls = await getUrlListFromArgs(url, spinnies, sitemapUrl, filePath);

  let urlsToProcess: string[] = [];

  if (sitemapUrl || filePath) {
    let numberOfUrls: number | null = null;
    let userInput: string | null = null;

    if (!shouldSkipPrompts && !numberOfUrlsInput) {
      userInput = await askUserInput(
        `Please enter the number of pages to analyze (Default: ${urls.length}):`,
        { default: urls.length.toString() }
      );
      numberOfUrls =
        userInput && isNaN(parseInt(userInput))
          ? urls.length
          : parseInt(userInput as string);
    } else if (numberOfUrlsInput) {
      console.log(`Analyzing ${numberOfUrlsInput} urls.`);
      numberOfUrls = parseInt(numberOfUrlsInput);
    } else {
      console.log(`Analyzing all ${urls.length} urls.`);
      numberOfUrls = urls.length;
    }

    urlsToProcess = urlsToProcess.concat(urls.splice(0, numberOfUrls));
  } else if (url) {
    urlsToProcess.push(url);
  }

  const cookieDictionary = await fetchDictionary();

  spinnies.add('cookie-spinner', {
    text: 'Analyzing cookies on first site visit',
  });

  const cookieAnalysisAndFetchedResourceData =
    await analyzeCookiesUrlsInBatchesAndFetchResources(
      urlsToProcess,
      //@ts-ignore Fix type.
      Libraries,
      isHeadless,
      waitTime,
      cookieDictionary,
      concurrency,
      spinnies,
      shouldSkipAcceptBanner,
      verbose
    );

  removeAndAddNewSpinnerText(
    spinnies,
    'cookie-spinner',
    'Done analyzing cookies!'
  );

  let technologyAnalysisData: any = null;

  if (!shouldSkipTechnologyAnalysis) {
    spinnies.add('technology-spinner', {
      text: 'Analyzing technologies',
    });

    technologyAnalysisData = await analyzeTechnologiesUrlsInBatches(
      urlsToProcess,
      concurrency,
      spinnies
    );

    removeAndAddNewSpinnerText(
      spinnies,
      'technology-spinner',
      'Done analyzing technologies!'
    );
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

  I18n.loadCLIMessagesData(locale);

  const isSiteMap = sitemapUrl || filePath ? true : false;

  if (outDir) {
    await saveCSVReports(path.resolve(outputDir), result);
    console.log('Reports created successfully!');
    process.exit(0);
  }

  await saveResultsAsJSON(outputDir, result);
  await saveResultsAsHTML(outputDir, result, isSiteMap);
})().catch((error) => {
  const spinnies = new Spinnies();
  spinnies.add('error-line-1', {
    text: 'Some error occured while analyzing the website.',
    status: 'non-spinnable',
    color: 'red',
  });
  spinnies.add('error-line-2', {
    text: 'For more information check the stack trace below:\n',
    status: 'non-spinnable',
    color: 'red',
  });
  spinnies.add('error-line-3', {
    text: `${error}`,
    status: 'non-spinnable',
    color: 'red',
  });
  process.exit(process?.exitCode ?? 0);
});

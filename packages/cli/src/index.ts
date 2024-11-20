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
import { existsSync } from 'fs-extra';
// @ts-ignore Package does not support typescript.
import Spinnies from 'spinnies';
import path, { basename } from 'path';
import { I18n } from '@google-psat/i18n';
import { removeAndAddNewSpinnerText } from '@google-psat/common';
import { analyzeCookiesUrlsInBatchesAndFetchResources } from '@google-psat/analysis-utils';
import { LIBRARIES } from '@google-psat/library-detection';
import { pathToFileURL } from 'node:url';

/**
 * Internal dependencies.
 */
import {
  fetchDictionary,
  getUrlListFromArgs,
  saveReports,
  askUserInput,
  generatePrefix,
  localeValidator,
  outDirValidator,
  filePathValidator,
  urlValidator,
  numericValidator,
  redLogger,
  getSiteReport,
  saveResultsAsHTML,
} from './utils';
import getSelectorsFromPath from './utils/getSelectorsFromPath';
import checkLatestVersion from './utils/checkLatestVersion';
import packageJson from '../package.json';

events.EventEmitter.defaultMaxListeners = 15;

const program = new Command();

const isFromNPMRegistry = !existsSync(
  path.resolve(__dirname + '../../../extension')
);

program
  .name(isFromNPMRegistry ? 'psat' : 'npm run cli')
  .version(packageJson.version)
  .usage(
    isFromNPMRegistry ? '[website-url] [options]' : '[website-url] -- [options]'
  )
  .description('CLI to test a URL for 3p cookies.')
  .argument('[website-url]', 'The URL of a single site to analyze', (value) =>
    urlValidator(value, '[website-url]')
  )
  .option('-u, --url <url>', 'The URL of a single site to analyze', (value) =>
    urlValidator(value, '-u')
  )
  .option(
    '-s, --source-url <url>',
    'The URL of a sitemap or CSV to analyze',
    (value) => urlValidator(value, '-s')
  )
  .option(
    '-f, --file <path>',
    'The path to a local file (CSV or XML sitemap) to analyze',
    (value) => filePathValidator(value, '-f')
  )
  .option(
    '-n, --number-of-urls <num>',
    'Limit the number of URLs to analyze (from sitemap or CSV)',
    (value) => numericValidator(value, '-n')
  )
  .option('-d, --display', 'Flag for running CLI in non-headless mode', false)
  .option('-v, --verbose', 'Enables verbose logging', false)
  .option(
    '-o, --out-dir <path>',
    'Directory to store analysis data (JSON, CSV, HTML) without launching the dashboard',
    (value) => outDirValidator(value, '-o')
  )
  .option(
    '-i, --ignore-gdpr',
    'Ignore automatically accepting the GDPR banner if present',
    false
  )
  .option('-q, --quiet', 'Skips all prompts; uses default options', false)
  .option(
    '-c, --concurrency <num>',
    'Number of tabs to open in parallel during sitemap or CSV analysis',
    (value) => numericValidator(value, '-c'),
    3
  )
  .option(
    '-w, --wait <num>',
    'Number of milliseconds to wait after the page is loaded before generating the report',
    (value) => numericValidator(value, '-w'),
    20000
  )
  .option(
    '-l, --locale <language>',
    'Locale to use for the CLI, supported: en, hi, es, ja, ko, pt-BR',
    (value) => localeValidator(value, '-l'),
    'en'
  )
  .option(
    '-b, --button-selectors <path>',
    'The path to a JSON file that contains selectors or button text to be used for GDPR banner acceptance',
    (value) => filePathValidator(value, '-b')
  )
  .helpOption('-h, --help', 'Display help for command')
  .addHelpText(
    'after',
    '\nTo learn more, visit our wiki: https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki.'
  )
  .configureOutput({
    outputError: (error) => {
      if (error.startsWith('error')) {
        redLogger(error.charAt(0).toUpperCase() + error.slice(1));
      } else {
        redLogger(error);
      }
    },
  });

program.parse();

// eslint-disable-next-line complexity
(async () => {
  const url = program.processedArgs?.[0] ?? program.opts().url;
  const verbose = program.opts().verbose;
  const sitemapUrl = program.opts().sourceUrl;
  const filePath = program.opts().file;
  const locale = program.opts().locale;
  const numberOfUrlsInput = program.opts().numberOfUrls;
  const isHeadful = program.opts().display;
  const shouldSkipPrompts = program.opts().quiet;
  const outDir = program.opts().outDir;
  const shouldSkipAcceptBanner = program.opts().ignoreGdpr;
  const concurrency = program.opts().concurrency;
  const waitTime = program.opts().wait;
  const selectorFilePath = program.opts().buttonSelectors;

  await checkLatestVersion();

  const numArgs: number = [
    Boolean(url),
    Boolean(sitemapUrl),
    Boolean(filePath),
  ].reduce((acc, arg) => {
    acc += arg ? 1 : 0;
    return acc;
  }, 0);

  if (numArgs > 1) {
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

  let selectors;

  if (selectorFilePath) {
    selectors = getSelectorsFromPath(selectorFilePath);
  }

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
      console.log(`Analyzing ${numberOfUrlsInput} urls`);
      numberOfUrls = parseInt(numberOfUrlsInput);
    } else {
      console.log(`Analyzing all ${urls.length} urls`);
      numberOfUrls = urls.length;
    }

    urlsToProcess = urlsToProcess.concat(urls.splice(0, numberOfUrls));
  } else if (url) {
    urlsToProcess.push(url);
  }

  const cookieDictionary = await fetchDictionary();

  spinnies.add('cookie-spinner', {
    text: 'Analyzing cookies on the first site visit',
  });

  let cookieAnalysisAndFetchedResourceData: any;

  // eslint-disable-next-line no-useless-catch -- Because we are rethrowing the same error no need to create a new Error instance
  try {
    cookieAnalysisAndFetchedResourceData =
      await analyzeCookiesUrlsInBatchesAndFetchResources(
        urlsToProcess,
        LIBRARIES,
        !isHeadful,
        waitTime,
        cookieDictionary,
        concurrency,
        spinnies,
        shouldSkipAcceptBanner,
        verbose,
        sitemapUrl || filePath ? 4 : 3,
        selectors
      );
  } catch (error) {
    if (urlsToProcess.length === 1) {
      removeAndAddNewSpinnerText(
        spinnies,
        'cookie-spinner',
        'Failure in analyzing cookies!',
        0,
        true
      );
      throw error;
    }
  }
  removeAndAddNewSpinnerText(
    spinnies,
    'cookie-spinner',
    'Done analyzing cookies!'
  );

  const result = getSiteReport(
    urlsToProcess,
    cookieAnalysisAndFetchedResourceData
  );

  result['psatVersion'] = packageJson.version; // For adding in downloaded JSON file.

  I18n.loadCLIMessagesData(locale);

  const isSiteMap = sitemapUrl || filePath ? true : false;

  if (outDir) {
    await saveReports(path.resolve(outputDir), result, sitemapUrl);
    console.log('Reports created successfully!');
    console.log(`Report path: ${pathToFileURL(outputDir)}`);
    process.exit(0);
  }

  let selectedSiteName = '';

  if (isSiteMap) {
    if (sitemapUrl) {
      selectedSiteName = new URL(sitemapUrl).hostname;
    } else {
      selectedSiteName = basename(outputDir);
    }
  } else {
    selectedSiteName = new URL(result[0].pageUrl).hostname;
  }

  await saveResultsAsHTML(
    outputDir,
    result,
    isSiteMap,
    selectedSiteName,
    null,
    sitemapUrl
  );
})().catch((error) => {
  const spinnies = new Spinnies();
  spinnies.add('error-line-1', {
    text: 'Some errors occurred while analyzing the website.',
    status: 'non-spinnable',
    color: 'red',
  });
  spinnies.add('error-line-2', {
    text: 'For more information, check the stack trace below:\n',
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

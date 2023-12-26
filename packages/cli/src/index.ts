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
import { ensureFile, exists, readFile, writeFile } from 'fs-extra';
// @ts-ignore Package does not support typescript.
import Spinnies from 'spinnies';
import { exec } from 'child_process';
import path from 'path';
import { parseUrl } from '@ps-analysis-tool/common';
import { parseStringPromise } from 'xml2js';

/**
 * Internal dependencies.
 */
import Utility from './utils/utility';
import { fetchDictionary } from './utils/fetchCookieDictionary';
import { analyzeCookiesUrlsInBatches } from './procedures/analyzeCookieUrlsInBatches';
import { analyzeTechnologiesUrlsInBatches } from './procedures/analyzeTechnologiesUrlsInBatches';
import { delay } from './utils';
import { checkPortInUse } from './utils/checkPortInUse';

events.EventEmitter.defaultMaxListeners = 15;

const DELAY_TIME = 20000;
const program = new Command();

program
  .version('0.4.0')
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
  .option('-nt, --no-technology', 'Flags for skipping technology analysis.');

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

// eslint-disable-next-line complexity
const validateArgs = async (
  url: string,
  sitemapUrl: string,
  csvPath: string,
  sitemapPath: string,
  numberOfUrls: string
) => {
  if (!url && !sitemapUrl && !csvPath && !sitemapPath) {
    console.log(
      `Please provide one of the following 
      a) URL of a site (-u or --url) 
      b) URL of a sitemap (-s or --sitemap-url)
      c) Path to a CSV file (-c or --csv-path)
      d) Path to a XML file (-p or --sitemap-path)`
    );
    process.exit(1);
  }

  if (
    (url && sitemapUrl) ||
    (sitemapUrl && csvPath) ||
    (csvPath && sitemapPath) ||
    (sitemapPath && url)
  ) {
    console.log(
      `Please provide ONLY one of the following 
      a) URL of a site (-u or --url) 
      b) URL of a sitemap (-s or --sitemap-url)
      c) Path to a CSV file (-c or --csv-path)
      d) Path to a XML file (-p or --sitemap-path)`
    );
    process.exit(1);
  }

  if (csvPath) {
    const csvFileExists = await exists(csvPath);
    if (!csvFileExists) {
      console.log(`No file at ${csvPath}`);
      process.exit(1);
    }
  }

  if (sitemapPath) {
    const sitemapFileExists = await exists(sitemapPath);
    if (!sitemapFileExists) {
      console.log(`No file at ${sitemapPath}`);
      process.exit(1);
    }
  }

  if (url || sitemapUrl) {
    const _url = url || sitemapUrl;

    const parsedUrl = parseUrl(_url);

    if (parsedUrl === null) {
      console.log(`Provided Url ${parsedUrl} is not valid`);
      process.exit(1);
    }
  }

  if (numberOfUrls) {
    if (isNaN(parseInt(numberOfUrls))) {
      console.log(`${numberOfUrls} is not valid numeric value`);
      process.exit(1);
    }
  }
};

const getUrlListFromArgs = async (
  url: string,
  sitemapUrl: string,
  csvPath: string,
  sitemapPath: string,
  // @ts-ignore Package does not support typescript.
  spinnies
): Promise<string[]> => {
  let urls: string[] = [];

  if (url) {
    urls.push(url);
  } else if (sitemapUrl) {
    spinnies.add('sitemap-spinner', {
      text: 'Parsing Sitemap',
    });

    try {
      const _urls = await Utility.getUrlsFromSitemap(sitemapUrl);
      urls = urls.concat(_urls);
    } catch (error) {
      console.log('Error parsing the sitemap file');
      process.exit(1);
    }

    spinnies.succeed('sitemap-spinner', {
      text: 'Done parsing Sitemap',
    });
  } else if (csvPath) {
    spinnies.add('csv-spinner', {
      text: 'Parsing CSV File',
    });

    try {
      const csvString = await readFile(csvPath, 'utf-8');

      const lines = csvString.split('\n');

      const _urls = lines.reduce((acc, line) => {
        if (line.length === 0) {
          return acc;
        } else {
          return acc.concat(line.split(','));
        }
      }, [] as string[]);

      if (_urls.length === 0) {
        console.log('Provided CSV files has no urls');
        process.exit(1);
      }
      _urls.forEach((_url) => {
        if (!_url.includes('http')) {
          console.log(`${_url} is not a valid URL`);
          process.exit(1);
        }
      });

      urls = urls.concat(_urls);
    } catch (error) {
      console.log('Error reading the CSV file');
      process.exit(1);
    }

    spinnies.succeed('csv-spinner', {
      text: 'Done parsing CSV file',
    });
  } else if (sitemapPath) {
    spinnies.add('sitemap-spinner', {
      text: 'Parsing XML File',
    });

    try {
      const xmlString = await readFile(sitemapPath, 'utf-8');
      const data = await parseStringPromise(xmlString as string);

      const isSiteIndex = Boolean(data['siteIndex']);
      const isSiteMap = Boolean(data['urlset']);

      if (isSiteIndex) {
        console.log(
          'Sorry, XML Schema for Sitemap index files is not supported by the tool'
        );
        process.exit(1);
      }

      if (!isSiteMap) {
        console.log('Provided file is not a valid sitemap');
        process.exit(1);
      }

      let _urls: string[] = [];

      try {
        _urls = data['urlset']['url'].reduce(
          (acc: string[], { loc }: { loc: string | undefined }) =>
            loc ? acc.concat(loc) : acc,
          []
        );
      } catch (error) {
        console.log('Provided XML files has no urls in its urlset');
        process.exit(1);
      }

      if (_urls.length === 0) {
        console.log('Provided XML files has no urls ');
        process.exit(1);
      }
      _urls.forEach((_url) => {
        if (!_url.includes('http')) {
          console.log(`${_url} is not a valid URL`);
          process.exit(1);
        }
      });

      urls = urls.concat(_urls);
    } catch (error) {
      console.log('Error reading the XML file');
      process.exit(1);
    }

    spinnies.succeed('sitemap-spinner', {
      text: 'Done parsing XML file',
    });
  }

  return urls;
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

  validateArgs(url, sitemapUrl, csvPath, sitemapPath, numberOfUrlsInput);

  const prefix =
    url || sitemapUrl
      ? Utility.generatePrefix(url || sitemapUrl)
      : path.parse(csvPath || sitemapPath).base;

  const outputDir = `./out/${prefix}`;
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
    };
  });

  await ensureFile(outputDir + '/out.json');
  await writeFile(
    outputDir + '/out.json',
    JSON.stringify(url ? result[0] : result, null, 4)
  );

  exec('npm run cli-dashboard:dev');

  await delay(2000);

  console.log(
    `Report is being served at the URL: http://localhost:9000?dir=${encodeURIComponent(
      prefix
    )}${sitemapUrl || csvPath || sitemapPath ? '&type=sitemap' : ''}`
  );
})();

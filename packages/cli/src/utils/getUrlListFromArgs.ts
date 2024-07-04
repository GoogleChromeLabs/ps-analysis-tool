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
import { readFile } from 'fs-extra';
import { parseStringPromise } from 'xml2js';
import path, { basename } from 'path';
import chalk from 'chalk';
import { removeAndAddNewSpinnerText } from '@google-psat/common';
/**
 * Internal dependencies.
 */
import getUrlsFromSitemap from './getUrlsfromSitemap';
import Spinnies from 'spinnies';

const parseUrlsFromSitemap = async (sitemapUrl: string, spinnies: Spinnies) => {
  spinnies.add('sitemap-spinner', {
    text: 'Parsing Sitemap',
  });

  try {
    const _urls = await getUrlsFromSitemap(sitemapUrl);
    removeAndAddNewSpinnerText(
      spinnies,
      'sitemap-spinner',
      'Done parsing Sitemap!'
    );
    return _urls;
  } catch (error) {
    throw new Error();
  }
};

const parseUrlsFromCSV = async (csvPath: string, spinnies: Spinnies) => {
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
      console.log(
        chalk.red(`Error: CSV file contains no URLs: ${basename(csvPath)}`)
      );
      process.exit(1);
    }
    _urls.forEach((_url) => {
      if (!_url.includes('http')) {
        console.log(chalk.red(`Error: Invalid URL: ${_url}`));
        process.exit(1);
      }
    });

    removeAndAddNewSpinnerText(
      spinnies,
      'csv-spinner',
      'Done parsing CSV file!'
    );
    return _urls;
  } catch (error) {
    throw new Error('csv parsing error');
  }
};

const parseUrlsFromLocalSitemap = async (
  sitemapPath: string,
  spinnies: Spinnies
) => {
  try {
    spinnies.add('sitemap-spinner', {
      text: 'Parsing XML File',
    });
    const xmlString = await readFile(sitemapPath, 'utf-8');
    const data = await parseStringPromise(xmlString as string);

    const isSiteIndex = Boolean(data['siteIndex']);
    const isSiteMap = Boolean(data['urlset']);

    if (isSiteIndex) {
      console.log(chalk.red('Error: Sitemap index not supported'));
      process.exit(1);
    }

    if (!isSiteMap) {
      console.log(
        chalk.red(
          `Error: Sitemap file contains no URLs: ${basename(sitemapPath)}`
        )
      );
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
      console.log(
        chalk.red(
          `Error: Sitemap file contains no URLs: ${basename(sitemapPath)}`
        )
      );
      process.exit(1);
    }

    if (_urls.length === 0) {
      console.log(
        chalk.red(
          `Error: Sitemap file contains no URLs: ${basename(sitemapPath)}`
        )
      );
      process.exit(1);
    }
    _urls.forEach((_url) => {
      if (!_url.includes('http')) {
        console.log(
          chalk.red(
            `Error: Sitemap file contains no URLs: ${basename(sitemapPath)}`
          )
        );
        process.exit(1);
      }
    });

    removeAndAddNewSpinnerText(
      spinnies,
      'sitemap-spinner',
      'Done parsing XML file!'
    );

    return _urls;
  } catch (error) {
    throw new Error('Local sitemap parsing error');
  }
};

/**
 * Validate arguments passed to the CLI. Process for the CLI is exited with appropriate message.
 * @param {string} url Url input to CLI.
 * @param {Spinnies} spinnies handler for logging.
 * @param {string} sitemapUrl Url of a sitemap.
 * @param {string} filePath File system path to a csv file with urls or sitemap xml file.
 * @returns {string[]} list of urls.
 */
const getUrlListFromArgs = async (
  url: string,
  spinnies: Spinnies,
  sitemapUrl?: string,
  filePath?: string
): Promise<string[]> => {
  let urls: string[] = [];

  if (url) {
    urls.push(url);
  } else if (sitemapUrl) {
    try {
      const _urls = await parseUrlsFromSitemap(sitemapUrl, spinnies);
      urls = urls.concat(_urls);
    } catch (error) {
      console.log(chalk.red('Error: Error parsing sitemap.'));
      process.exit(1);
    }
  } else if (filePath) {
    try {
      const isCSV = path.parse(filePath).ext === '.csv';
      if (isCSV) {
        const _urls = await parseUrlsFromCSV(filePath, spinnies);
        urls = urls.concat(_urls);
        return urls;
      }
      const _urls = await parseUrlsFromLocalSitemap(filePath, spinnies);
      urls = urls.concat(_urls);
    } catch (error) {
      if (error === 'csv parsing error') {
        console.log(chalk.red('Error: CSV file could not be parsed'));
        process.exit(1);
      }
      if (error === 'Local sitemap parsing error') {
        console.log(chalk.red('Error: Sitemap could not be parsed'));
        process.exit(1);
      }
      console.log(chalk.red('Error parsing file.'));
      process.exit(1);
    }
  }

  return urls;
};

export default getUrlListFromArgs;

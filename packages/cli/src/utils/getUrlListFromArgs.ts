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
/**
 * Internal dependencies.
 */
import Utility from './utility';
import succeedTextLog from './succeedTextLog';

const parseUrlsFromSitemap = async (sitemapUrl: string, spinnies: any) => {
  spinnies?.add('sitemap-spinner', {
    text: 'Parsing Sitemap',
  });

  try {
    const _urls = await Utility.getUrlsFromSitemap(sitemapUrl);
    spinnies?.succeed('sitemap-spinner');
    succeedTextLog('Done parsing Sitemap');
    return _urls;
  } catch (error) {
    throw new Error();
  }
};

const parseUrlsFromCSV = async (csvPath: string, spinnies: any) => {
  spinnies?.add('csv-spinner', {
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
    spinnies?.succeed('csv-spinner');
    succeedTextLog('Done parsing CSV file');
    return _urls;
  } catch (error) {
    throw new Error();
  }
};

const parseUrlsFromLocalSitemap = async (
  sitemapPath: string,
  spinnies: any
) => {
  spinnies?.add('sitemap-spinner', {
    text: 'Parsing XML File',
  });

  const xmlString = await readFile(sitemapPath, 'utf-8');
  const data = await parseStringPromise(xmlString as string);

  const isSiteIndex = Boolean(data['siteIndex']);
  const isSiteMap = Boolean(data['urlset']);

  if (isSiteIndex) {
    throw new Error(
      'Sorry, XML Schema for Sitemap index files is not supported by the tool'
    );
  }

  if (!isSiteMap) {
    throw new Error(
      'Sorry, XML Schema for Sitemap index files is not supported by the tool'
    );
  }

  let _urls: string[] = [];

  try {
    _urls = data['urlset']['url'].reduce(
      (acc: string[], { loc }: { loc: string | undefined }) =>
        loc ? acc.concat(loc) : acc,
      []
    );
  } catch (error) {
    throw new Error('Provided XML files has no urls in its urlset');
  }

  if (_urls.length === 0) {
    throw new Error('Provided XML files has no urls ');
  }
  _urls.forEach((_url) => {
    if (!_url.includes('http')) {
      throw new Error(`${_url} is not a valid URL`);
    }
  });
  spinnies?.succeed('sitemap-spinner');
  succeedTextLog('Done parsing XML file');

  return _urls;
};

/**
 * Validate arguments passed to the CLI. Process for the CLI is exited with appropriate message.
 * @param {string} url Url input to CLI.
 * @param {string} sitemapUrl Url of a sitemap.
 * @param {string} csvPath File system path to a csv file with urls.
 * @param {string} sitemapPath File system path to a sitemap xml file.
 * @param {any} spinnies handler for logging.
 * @returns {string[]} list of urls.
 */
const getUrlListFromArgs = async (
  url: string,
  sitemapUrl?: string,
  csvPath?: string,
  sitemapPath?: string,
  // @ts-ignore Package does not support typescript.
  spinnies
): Promise<string[]> => {
  let urls: string[] = [];

  if (url) {
    urls.push(url);
  } else if (sitemapUrl) {
    try {
      const _urls = await parseUrlsFromSitemap(sitemapUrl, spinnies);
      urls = urls.concat(_urls);
    } catch (error) {
      console.log('Error parsing sitemap');
      process.exit(1);
    }
  } else if (csvPath) {
    try {
      const _urls = await parseUrlsFromCSV(csvPath, spinnies);
      urls = urls.concat(_urls);
    } catch (error) {
      console.log('Error parsing CSV file');
      process.exit(1);
    }
  } else if (sitemapPath) {
    try {
      const _urls = await parseUrlsFromLocalSitemap(sitemapPath, spinnies);
      urls = urls.concat(_urls);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        process.exit(1);
      }
    }
  }

  return urls;
};

export default getUrlListFromArgs;

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

import { readFile } from 'fs-extra';
import Utility from './utility';
import { parseStringPromise } from 'xml2js';

/**
 * Validate arguments passed to the CLI. Process for the CLI is exited with appropriate message.
 * @param {string} url Url input to CLI.
 * @param {string} sitemapUrl Url of a sitemap.
 * @param {string} csvPath File system path to a csv file with urls.
 * @param {string} sitemapPath File system path to a sitemap xml file.
 * @param {string} numberOfUrls Url limit argument.
 * @param {string} outDir File system path to the output directory.
 */

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

export default getUrlListFromArgs;

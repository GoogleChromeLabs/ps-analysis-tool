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
import { I18n } from '@ps-analysis-tool/i18n';
/**
 * Internal dependencies.
 */
import getUrlsFromSitemap from './getUrlsfromSitemap';

const parseUrlsFromSitemap = async (sitemapUrl: string, spinnies: any) => {
  spinnies?.add('sitemap-spinner', {
    text: I18n.getMessage('parsingSitemap'),
  });

  try {
    const _urls = await getUrlsFromSitemap(sitemapUrl);
    spinnies?.succeed('sitemap-spinner', {
      text: I18n.getMessage('doneParsingSitemap'),
    });
    return _urls;
  } catch (error) {
    throw new Error();
  }
};

const parseUrlsFromCSV = async (csvPath: string, spinnies: any) => {
  spinnies?.add('csv-spinner', {
    text: I18n.getMessage('parsingCSV'),
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
      console.log(I18n.getMessage('cSVHasNoUrls'));
      process.exit(1);
    }
    _urls.forEach((_url) => {
      if (!_url.includes('http')) {
        console.log(I18n.getMessage('notValidUrl', [_url]));
        process.exit(1);
      }
    });
    spinnies?.succeed('csv-spinner', {
      text: I18n.getMessage('doneParsingCSV'),
    });
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
    text: I18n.getMessage('parsingXML'),
  });

  const xmlString = await readFile(sitemapPath, 'utf-8');
  const data = await parseStringPromise(xmlString as string);

  const isSiteIndex = Boolean(data['siteIndex']);
  const isSiteMap = Boolean(data['urlset']);

  if (isSiteIndex) {
    throw new Error(I18n.getMessage('xMLSchemaNotSupported'));
  }

  if (!isSiteMap) {
    throw new Error(I18n.getMessage('xMLSchemaNotSupported'));
  }

  let _urls: string[] = [];

  try {
    _urls = data['urlset']['url'].reduce(
      (acc: string[], { loc }: { loc: string | undefined }) =>
        loc ? acc.concat(loc) : acc,
      []
    );
  } catch (error) {
    throw new Error(I18n.getMessage('noUrlsInXMLUrlset'));
  }

  if (_urls.length === 0) {
    throw new Error(I18n.getMessage('noUrlsInXML'));
  }
  _urls.forEach((_url) => {
    if (!_url.includes('http')) {
      throw new Error(I18n.getMessage('notValidUrl'));
    }
  });
  spinnies?.succeed('sitemap-spinner', {
    text: I18n.getMessage('doneParsingXML'),
  });

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
      console.log(I18n.getMessage('errorParsingSitemap'));
      process.exit(1);
    }
  } else if (csvPath) {
    try {
      const _urls = await parseUrlsFromCSV(csvPath, spinnies);
      urls = urls.concat(_urls);
    } catch (error) {
      console.log(I18n.getMessage('errorParsingCSV'));
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

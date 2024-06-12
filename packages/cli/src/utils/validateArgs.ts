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

import { parseUrl } from '@ps-analysis-tool/common';
import { I18n } from '@ps-analysis-tool/i18n';
import { exists, mkdir } from 'fs-extra';
import path from 'path';

/**
 * Validate arguments passed to the CLI. Process for the CLI is exited with appropriate message.
 * @param {string} url Url input to CLI.
 * @param {string} sitemapUrl Url of a sitemap.
 * @param {string} csvPath File system path to a csv file with urls.
 * @param {string} sitemapPath File system path to a sitemap xml file.
 * @param {string} numberOfUrls Url limit argument.
 * @param {string} outDir File system path to the output directory.
 * @param port
 */
// eslint-disable-next-line complexity
const validateArgs = async (
  url: string,
  sitemapUrl: string,
  csvPath: string,
  sitemapPath: string,
  numberOfUrls: string,
  outDir: string,
  port: number
) => {
  if (isNaN(port) || (!isNaN(port) && (port < 0 || port > 65536))) {
    console.log(I18n.getMessage('cliInvalidPort'));
    process.exit(1);
  }

  const numArgs: number = [
    Boolean(url),
    Boolean(sitemapUrl),
    Boolean(csvPath),
    Boolean(sitemapPath),
  ].reduce((acc, arg) => {
    acc += arg ? 1 : 0;
    return acc;
  }, 0);

  if (numArgs !== 1) {
    console.log(I18n.getMessage('cliProvideCLIArguments'));
    process.exit(1);
  }

  if (csvPath) {
    const csvFileExists = await exists(csvPath);
    if (!csvFileExists) {
      console.log(I18n.getMessage('noFileFound', [csvPath]));
      process.exit(1);
    }
  }

  if (sitemapPath) {
    const sitemapFileExists = await exists(sitemapPath);
    if (!sitemapFileExists) {
      console.log(I18n.getMessage('noFileFound', [sitemapPath]));
      process.exit(1);
    }
  }

  if (url || sitemapUrl) {
    const _url = url || sitemapUrl;

    const parsedUrl = parseUrl(_url);

    if (parsedUrl === null) {
      console.log(I18n.getMessage('cliUrlInvalid', [_url]));
      process.exit(1);
    }
  }

  if (numberOfUrls) {
    if (isNaN(parseInt(numberOfUrls))) {
      console.log(I18n.getMessage('notValidNumber'));
      process.exit(1);
    }
  }

  if (outDir) {
    const parentDirExists = await exists(path.resolve('./out'));

    if (!parentDirExists) {
      await mkdir(path.resolve('./out'));
    }

    let output;

    if (!path.isAbsolute(outDir)) {
      output = path.resolve('./out', outDir);
    } else {
      output = path.resolve(outDir);
    }

    const outDirExists = await exists(output);

    if (!outDirExists) {
      console.log(`"${output}" does not exist, creating now.`);
      await mkdir(output);
    }
  }
};

export default validateArgs;

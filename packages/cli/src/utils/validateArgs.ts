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

import { parseUrl } from '@google-psat/common';
import { exists, mkdir } from 'fs-extra';
import path from 'path';

/**
 * Validate arguments passed to the CLI. Process for the CLI is exited with appropriate message.
 * @param {string} url Url input to CLI.
 * @param {string} sitemapUrl Url of a sitemap.
 * @param {string} filePath File system path to a csv file with urls.
 * @param {string} numberOfUrls Url limit argument.
 * @param {string} outDir File system path to the output directory.
 * @param {string} locale Locale of the site.
 * @param {string} concurrency The number of tabs to be opened during sitemap analysis.
 * @param {string} waitTime The amount of time to be waited on a page.
 */
// eslint-disable-next-line complexity
const validateArgs = async (
  url: string,
  sitemapUrl: string,
  filePath: string,
  numberOfUrls: string,
  outDir: string,
  locale: string,
  concurrency: string,
  waitTime: string
) => {
  const numArgs: number = [
    Boolean(url),
    Boolean(sitemapUrl),
    Boolean(filePath),
  ].reduce((acc, arg) => {
    acc += arg ? 1 : 0;
    return acc;
  }, 0);

  if (numArgs !== 1) {
    console.log(
      `Please provide one and only one of the following
        a) URL of a site (-u or --url or default argument)
        b) URL of a sitemap (-s or --sitemap-url)
        c) Path to a file (CSV or XML sitemap) (-f or --file)`
    );
    process.exit(1);
  }

  if (isNaN(parseInt(concurrency))) {
    console.log(`${concurrency} is not valid numeric value`);
    process.exit(1);
  }

  if (isNaN(parseInt(waitTime))) {
    console.log(`${waitTime} is not valid numeric value`);
    process.exit(1);
  }

  if (filePath) {
    const csvFileExists = await exists(filePath);
    if (!csvFileExists) {
      console.log(`Error: No file at ${filePath}`);
      process.exit(1);
    }
  }

  if (url || sitemapUrl) {
    const _url = url || sitemapUrl;

    const parsedUrl = parseUrl(_url);

    if (parsedUrl === null) {
      console.log(`Error: Invalid Url  ${parsedUrl}`);
      process.exit(1);
    }
  }

  if (numberOfUrls) {
    if (isNaN(parseInt(numberOfUrls))) {
      console.log(`${numberOfUrls} is not valid numeric value`);
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
      console.log(`"${output}" does not exist, creating!`);
      await mkdir(output);
    }
  }

  const availableLocales = ['en [default]', 'hi', 'es', 'ja', 'ko', 'pt-BR'];

  if (locale && !availableLocales.includes(locale)) {
    console.error(
      `Locale '${locale}' is not supported, please use ${availableLocales.join(
        ', '
      )}.`
    );
    process.exit(1);
  }
};

export default validateArgs;

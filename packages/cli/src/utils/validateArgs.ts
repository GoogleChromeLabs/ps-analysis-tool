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
    console.log(`Invalid port argument. Please porvide a port >=0 and <=65536`);
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
    console.log(
      `Please provide one and only one of the following
        a) URL of a site (-u or --url)
        b) URL of a sitemap (-s or --sitemap-url)
        c) Path to a CSV file (-c or --csv-path)
        d) Path to an XML file (-p or --sitemap-path)`
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

  if (outDir) {
    const outDirExists = await exists(path.resolve(outDir));
    if (!outDirExists) {
      console.log(`"${path.resolve(outDir)}" does not exist, creating now.`);
      await mkdir(path.resolve(outDir));
    }
  }
};

export default validateArgs;

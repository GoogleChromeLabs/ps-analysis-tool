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
 * External dependencies
 */
import { type CompleteJson, getCurrentDateAndTime } from '@google-psat/common';
import { I18n } from '@google-psat/i18n';
import { ensureDir } from 'fs-extra';
import { existsSync, writeFile } from 'node:fs';
import path from 'node:path';
import URL from 'node:url';
import fs from 'fs';

/**
 * Internal dependencies
 */
import getOutputFilePath from './getOutputFilePath';

const isProduction = process.env.NODE_ENV === 'production';
/**
 * This function will return the HTML file.
 * @param outDir The path to the output.
 * @param result The completeJSON of the output.
 * @param isSiteMap Whether the output is sitemap of not
 * @param selectedSiteName Selected site name to be used for exporting cookies.
 * @param fileName Optional filename to use used for the output file.
 * @param sitemapUrl Sitemap URL
 */
const saveResultsAsHTML = async (
  outDir: string,
  result: CompleteJson[],
  isSiteMap: boolean,
  selectedSiteName: string,
  fileName?: string | null,
  sitemapUrl?: string | undefined
) => {
  let htmlText = '';

  await ensureDir(outDir);

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

    if (!isProduction) {
      fs.copyFileSync(
        path.resolve(
          __dirname +
            '../../node_modules/@google-psat/cli-dashboard/dist/index.js'
        ),
        outDir + '/index.js'
      );
    }
  } else {
    htmlText = fs.readFileSync(
      path.resolve(__dirname + '../../../cli-dashboard/dist/index.html'),
      'utf-8'
    );

    if (!isProduction) {
      fs.copyFileSync(
        path.resolve(__dirname + '../../../cli-dashboard/dist/index.js'),
        outDir + '/index.js'
      );
    }
  }

  const messages = I18n.getMessages();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const dateTime =
    getCurrentDateAndTime('DD MMMM, YYYY, hh:mm:ssam/pm') + ' ' + timeZone;

  const html =
    htmlText.substring(0, htmlText.indexOf('</head>')) +
    `<script id='JSONDATASCRIPT'>
      window.PSAT_DATA = ${JSON.stringify({
        json: result,
        type: isSiteMap ? 'sitemap' : 'url',
        selectedSite: selectedSiteName,
        translations: messages,
        dateTime,
        siteMapUrl: isSiteMap ? sitemapUrl : '',
      })}</script>` +
    htmlText.substring(htmlText.indexOf('</head>'));

  const outputFilePath = fileName
    ? outDir + `/${fileName}`
    : getOutputFilePath(outDir);

  const outFileFullDir = path.resolve(outputFilePath);
  const htmlBlob = new Blob([html]);
  const buffer = Buffer.from(await htmlBlob.arrayBuffer());

  writeFile(outputFilePath, buffer, () => {
    if (!fileName) {
      console.log(`\nReport: ${URL.pathToFileURL(outFileFullDir)}`);
    }
  });
};

export default saveResultsAsHTML;

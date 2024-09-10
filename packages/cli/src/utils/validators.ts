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
import { existsSync, mkdirSync } from 'fs';
import path, { isAbsolute } from 'path';
import { InvalidArgumentError } from 'commander';

/**
 * Internal dependencies.
 */
import { LONG_CONSTANTS, SHORT_CONSTANTS } from './constants';
import { redLogger } from './coloredLoggers';

/**
 * This will check if the argument for the flag is another flag.
 * @param argument The value of the argument.
 * @returns boolean true if the argumment is a flag, false otherwise.
 */
function isOtherFlagsAsArgumentValidator(argument: string) {
  let isAFlag = false;

  LONG_CONSTANTS.forEach((flag) => {
    if (argument.startsWith(flag)) {
      isAFlag = true;
    }
  });

  SHORT_CONSTANTS.forEach((flag) => {
    if (argument.startsWith(flag)) {
      isAFlag = true;
    }
  });

  return isAFlag;
}
/**
 * This validates the waitTime or the concurrency of the URLs to be analysed together.
 * @param {string} value The supposed numeric value.
 * @param {string} flag The flag that the validator is validating.
 * @returns The user passed value else default value.
 */
export function numericValidator(value: string, flag: string) {
  if (isOtherFlagsAsArgumentValidator(value)) {
    switch (flag) {
      case '-n':
        throw new InvalidArgumentError(
          "The correct value for option  '-n, --number-of-urls <num>' would be a nonnegative number greater than 0 and less than equal to the total number of URLs"
        );
      case '-c':
        throw new InvalidArgumentError(
          "The correct value for option '-c, --concurrency <num>' would be a nonnegative number greater than 0 and less than equal to the total number of URLs"
        );
      case '-w':
        throw new InvalidArgumentError(
          "Correct value for option '-w, --wait <num>' would be number of milliseconds greater than 0"
        );
      default:
        throw new InvalidArgumentError('');
    }
  }

  const parsedValue = parseInt(value);
  if (isNaN(parsedValue)) {
    redLogger(`Error: ${value} is not a valid numeric value.`);
  }
  return parsedValue;
}

/**
 * This validates the locale provided by the user.
 * @param {string} locale The locale provided by the user.
 * @param {string} flag The flag that the validator is validating.
 * @returns validated locale.
 */
export function localeValidator(locale: string, flag: string) {
  const availableLocales = ['en [default]', 'hi', 'es', 'ja', 'ko', 'pt-BR'];

  if (isOtherFlagsAsArgumentValidator(locale)) {
    switch (flag) {
      case '-l':
        throw new InvalidArgumentError(
          `Correct value for option '-l, --locale <language>' would be ${availableLocales.join(
            ', '
          )}`
        );
      default:
        throw new InvalidArgumentError('');
    }
  }

  if (locale && !availableLocales.includes(locale)) {
    redLogger(
      `Error: Locale '${locale}' is not supported, please use ${availableLocales.join(
        ', '
      )}.`
    );
  }
  return locale;
}

/**
 * This validates the file path to be analysed by the user.
 * @param {string} filePath The file path provided by the user.
 * @param {string} flag The flag that the validator is validating.
 * @returns validated file path.
 */
export function filePathValidator(filePath: string, flag: string) {
  if (isOtherFlagsAsArgumentValidator(filePath)) {
    switch (flag) {
      case '-f':
        throw new InvalidArgumentError(
          "Correct value for option '-f, --file <path>' would be /users/path/to/urls.csv or /users/path/to/urls.xml"
        );
      case '-b':
        throw new InvalidArgumentError(
          "Correct value for option '-b, --button-selector <path>' would be /users/path/to/selectors.json"
        );
      default:
        throw new InvalidArgumentError('');
    }
  }

  if (flag === '-b' && path.extname(filePath) !== '.json') {
    redLogger('Error: Provided selector file must be a JSON file.');
  }

  const fileExists = existsSync(filePath);
  if (!fileExists) {
    const isAbsoluteFilePath = isAbsolute(filePath);
    const absoluteFilePath = path.resolve(filePath);

    redLogger(
      `Error: No file at ${isAbsoluteFilePath ? filePath : absoluteFilePath}`
    );
  }

  return filePath;
}

/**
 * This validates the url to be analysed by the user.
 * @param {string} url The url provided by the user.
 * @param {string} flag The flag that the validator is validating.
 * @returns validated url.
 */
export function urlValidator(url: string, flag: string) {
  if (isOtherFlagsAsArgumentValidator(url)) {
    switch (flag) {
      case '[website-url]':
        throw new InvalidArgumentError(
          'The correct value for the command-argument would be https://example.com'
        );
      case '-u':
        throw new InvalidArgumentError(
          "The correct value for option '-u, --url <url>' would be https://example.com"
        );
      case '-s':
        throw new InvalidArgumentError(
          "The correct value for option '-s, --source-url <url>' would be https://example.com/sitemap/sitemap.xml or https://example.com/sitemaps/sitemap.csv"
        );
      default:
        throw new InvalidArgumentError('');
    }
  }

  const parsedUrl = parseUrl(url);

  if (parsedUrl === null) {
    redLogger(`Error: Invalid Url ${url}`);
  }
  return url;
}

/**
 * This validates the output directory path provided by the user.
 * @param {string} outDir output directory path provided by the user.
 * @param {string} flag The flag that the validator is validating.
 * @returns validated outDir or the created output directory.
 */
export function outDirValidator(outDir: string, flag: string) {
  if (isOtherFlagsAsArgumentValidator(outDir)) {
    switch (flag) {
      case '-o':
        throw new InvalidArgumentError(
          "The correct value for option '-o, --out-dir <path>' would be /users/path/to/save/output"
        );
      default:
        throw new InvalidArgumentError('');
    }
  }

  const parentDirExists = existsSync(path.resolve('./out'));

  if (!parentDirExists) {
    mkdirSync(path.resolve('./out'));
  }

  let output;

  if (!path.isAbsolute(outDir)) {
    output = path.resolve('./out', outDir);
  } else {
    output = path.resolve(outDir);
  }

  const outDirExists = existsSync(output);

  if (!outDirExists) {
    console.log(`"${output}" does not exist, creating\n`);
    mkdirSync(output);
  }
  return outDir;
}

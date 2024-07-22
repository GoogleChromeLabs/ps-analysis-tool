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
import path from 'path';
import { InvalidArgumentError } from 'commander';

/**
 * Internal dependencies.
 */
import { LONG_CONSTANTS, SHORT_CONSTANTS } from './constants';

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
 * @returns The user passed value else default value.
 */
export function numericValidator(value: string) {
  if (isOtherFlagsAsArgumentValidator(value)) {
    throw new InvalidArgumentError('');
  }

  const parsedValue = parseInt(value);
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError(
      `Error: ${value} is not valid numeric value.`
    );
  }
  return parsedValue;
}

/**
 * This validates the locale provided by the user.
 * @param {string} locale The locale provided by the user.
 * @returns validated locale.
 */
export function localeValidator(locale: string) {
  if (isOtherFlagsAsArgumentValidator(locale)) {
    throw new InvalidArgumentError('');
  }

  const availableLocales = ['en [default]', 'hi', 'es', 'ja', 'ko', 'pt-BR'];
  if (locale && !availableLocales.includes(locale)) {
    throw new InvalidArgumentError(
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
 * @returns validated file path.
 */
export function filePathValidator(filePath: string) {
  if (isOtherFlagsAsArgumentValidator(filePath)) {
    throw new InvalidArgumentError('');
  }

  const csvFileExists = existsSync(filePath);
  if (!csvFileExists) {
    throw new InvalidArgumentError(`Error: No file at ${filePath}`);
  }
  return filePath;
}

/**
 * This validates the url to be analysed by the user.
 * @param {string} url The url provided by the user.
 * @returns validated url.
 */
export function urlValidator(url: string) {
  if (isOtherFlagsAsArgumentValidator(url)) {
    throw new InvalidArgumentError('');
  }

  const parsedUrl = parseUrl(url);

  if (parsedUrl === null) {
    throw new InvalidArgumentError(`Error: Invalid Url ${parsedUrl}`);
  }
  return url;
}

/**
 * This validates the output directory path provided by the user.
 * @param {string} outDir output directory path provided by the user.
 * @returns validated outDir or the created output directory.
 */
export function outDirValidator(outDir: string) {
  if (isOtherFlagsAsArgumentValidator(outDir)) {
    throw new InvalidArgumentError('');
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
